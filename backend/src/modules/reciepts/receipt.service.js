import mongoose from "mongoose";
import puppeteer from "puppeteer";

import Payment from "../payments/payment.model.js";
import Order from "../orders/order.model.js";
import Customer from "../customers/customer.model.js";
import User from "../users/user.model.js";

import {
  getMonthlyReceiptCount,
} from "../../services/plan-usage.service.js";

import {
  getPlanLimits,
  checkLimit,
} from "../../utils/plan.js";

import Counter from "../invoice/counter.model.js";

import {
  generateReceiptHTML,
} from "./receipt.template.js";

const generateReceiptNumber =
  async () => {
    const counter =
      await Counter.findOneAndUpdate(
        {
          _id: "receipt",
        },
        {
          $inc: {
            sequence: 1,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

    return `RCT-${String(
      counter.sequence
    ).padStart(6, "0")}`;
  };


const getOrCreateReceiptNumber =
  async (paymentId, userId) => {
    const existingPayment =
      await Payment.findOne({
        _id: paymentId,
        userId,
      })
        .select("receiptNumber")
        .lean();

    // Existing receipt:
    // Do not consume another receipt allowance.
    if (existingPayment?.receiptNumber) {
      return existingPayment.receiptNumber;
    }

    // No receipt exists yet.
    // Check the user's plan.
    const user =
      await User.findById(userId)
        .select("subscription")
        .lean();

    if (!user) {
      const error = new Error(
        "Business owner not found."
      );

      error.statusCode = 404;

      throw error;
    }

    const {
      receiptsPerMonth,
    } = getPlanLimits(user);

    const monthlyReceiptCount =
      await getMonthlyReceiptCount(
        userId
      );

    if (
      !checkLimit(
        monthlyReceiptCount,
        receiptsPerMonth
      )
    ) {
      const error = new Error(
        "You've reached the 5-receipt monthly limit on the Free plan. Upgrade to Pro to create unlimited receipts."
      );

      error.statusCode = 403;
      error.code =
        "RECEIPT_LIMIT_REACHED";

      throw error;
    }

    // Generate receipt number only after
    // confirming the user can create one.
    const receiptNumber =
      await generateReceiptNumber();

    const updatedPayment =
      await Payment.findOneAndUpdate(
        {
          _id: paymentId,
          userId,
          receiptNumber: {
            $exists: false,
          },
        },
        {
          $set: {
            receiptNumber,
          },
        },
        {
          new: true,
        }
      ).lean();

    if (updatedPayment) {
      return updatedPayment.receiptNumber;
    }

    // Another request may have created
    // the receipt concurrently.
    const finalPayment =
      await Payment.findOne({
        _id: paymentId,
        userId,
      })
        .select("receiptNumber")
        .lean();

    return finalPayment.receiptNumber;
  };


export const getReceiptData =
  async (userId, paymentId) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        paymentId
      )
    ) {
      const error = new Error(
        "Invalid payment ID."
      );

      error.statusCode = 400;

      throw error;
    }

    const payment =
      await Payment.findOne({
        _id: paymentId,
        userId,
      }).lean();

    if (!payment) {
      const error = new Error(
        "Payment not found."
      );

      error.statusCode = 404;

      throw error;
    }

    const [
      order,
      user,
    ] = await Promise.all([
      Order.findOne({
        _id: payment.orderId,
        userId,
      }).lean(),

      User.findById(userId)
        .select(
          "name email phone businessName businessPhone businessAddress currency"
        )
        .lean(),
    ]);

    if (!order) {
      const error = new Error(
        "Order not found."
      );

      error.statusCode = 404;

      throw error;
    }

    const orderCustomer =
      await Customer.findOne({
        _id: order.customerId,
        userId,
        isArchived: false,
      })
        .select(
          "name phone email address"
        )
        .lean();

    if (!orderCustomer) {
      const error = new Error(
        "Customer not found."
      );

      error.statusCode = 404;

      throw error;
    }

    if (!user) {
      const error = new Error(
        "Business owner not found."
      );

      error.statusCode = 404;

      throw error;
    }

    const receiptNumber =
      await getOrCreateReceiptNumber(
        payment._id,
        userId
      );

    return {
      receiptNumber,

      business: {
        name: user.businessName,
        phone:
          user.businessPhone ||
          user.phone,
        email: user.email,
        address:
          user.businessAddress || "",
      },

      customer: {
        name: orderCustomer.name,
        phone:
          orderCustomer.phone,
        email:
          orderCustomer.email || "",
        address:
          orderCustomer.address || "",
      },

      payment: {
        amount: payment.amount,
        paymentMethod:
          payment.paymentMethod,
        paymentDate:
          payment.paymentDate,
        reference:
          payment.reference || "",
        notes:
          payment.notes || "",
      },

      order: {
        orderNumber:
          order.orderNumber,
        total: order.total,
      },

      currency:
        user.currency || "NGN",
    };
  };

export const generateReceiptPDF =
  async (receiptData) => {
    const html =
      generateReceiptHTML(
        receiptData
      );

    const browser =
      await puppeteer.launch({
        headless: true,
      });

    try {
      const page =
        await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
      });

      return await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
      });
    } finally {
      await browser.close();
    }
  };
