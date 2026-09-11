import mongoose from "mongoose";
import puppeteer from "puppeteer";
import crypto from "crypto";

import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";
import Customer from "../customers/customer.model.js";
import User from "../users/user.model.js";

import {
  getMonthlyInvoiceCount,
} from "../../services/plan-usage.service.js";

import { getPlanLimits, checkLimit, hasFeature } from "../../utils/plan.js";
import Counter from "./counter.model.js";

import {
  generateInvoiceHTML,
} from "./invoice.template.js";

const generateInvoicePublicToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generateInvoiceNumber =
  async () => {
    const counter =
      await Counter.findOneAndUpdate(
        {
          _id: "invoice",
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

    return `INV-${String(
      counter.sequence
    ).padStart(6, "0")}`;
  };


const getOrCreateInvoiceAccess =
  async (orderId, userId) => {
    const existingOrder =
      await Order.findOne({
        _id: orderId,
        userId,
      })
        .select(
          "invoiceNumber invoicePublicToken"
        )
        .lean();

    if (!existingOrder) {
      const error = new Error(
        "Order not found."
      );

      error.statusCode = 404;

      throw error;
    }

    // Get current user's plan
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
      invoicesPerMonth,
    } = getPlanLimits(user);

    const canUsePublicInvoiceLinks =
      hasFeature(
        user,
        "publicInvoiceLinks"
      );

    /*
     * EXISTING INVOICE
     *
     * Viewing/downloading an existing invoice
     * does NOT consume another invoice allowance.
     */
    if (existingOrder.invoiceNumber) {
      /*
       * Free users:
       *
       * They can continue using the invoice normally,
       * but they do NOT receive a public invoice token.
       */
      if (!canUsePublicInvoiceLinks) {
        return {
          invoiceNumber:
            existingOrder.invoiceNumber,
          invoicePublicToken: null,
        };
      }

      /*
       * Pro users:
       *
       * If the invoice already has a public token,
       * keep using it.
       *
       * If it doesn't, create one now.
       */
      const invoicePublicToken =
        existingOrder.invoicePublicToken ||
        generateInvoicePublicToken();

      if (
        !existingOrder.invoicePublicToken
      ) {
        await Order.updateOne(
          {
            _id: orderId,
            userId,
          },
          {
            $set: {
              invoicePublicToken,
            },
          }
        );
      }

      return {
        invoiceNumber:
          existingOrder.invoiceNumber,
        invoicePublicToken,
      };
    }

    /*
     * NO INVOICE EXISTS YET
     *
     * Check the monthly invoice allowance.
     */
    const monthlyInvoiceCount =
      await getMonthlyInvoiceCount(
        userId
      );

    if (
      !checkLimit(
        monthlyInvoiceCount,
        invoicesPerMonth
      )
    ) {
      const error = new Error(
        "You've reached the 5-invoice monthly limit on the Free plan. Upgrade to Pro to create unlimited invoices."
      );

      error.statusCode = 403;
      error.code =
        "INVOICE_LIMIT_REACHED";

      throw error;
    }

    /*
     * Create invoice number.
     */
    const invoiceNumber =
      await generateInvoiceNumber();

    /*
     * Only Pro users receive a public token.
     */
    const invoicePublicToken =
      canUsePublicInvoiceLinks
        ? generateInvoicePublicToken()
        : null;

    const updateData = {
      invoiceNumber,
    };

    if (invoicePublicToken) {
      updateData.invoicePublicToken =
        invoicePublicToken;
    }

    const updatedOrder =
      await Order.findOneAndUpdate(
        {
          _id: orderId,
          userId,
          invoiceNumber: {
            $exists: false,
          },
        },
        {
          $set: updateData,
        },
        {
          new: true,
        }
      ).lean();

    if (!updatedOrder) {
      const error = new Error(
        "Invoice could not be created."
      );

      error.statusCode = 409;

      throw error;
    }

    return {
      invoiceNumber:
        updatedOrder.invoiceNumber,

      invoicePublicToken:
        updatedOrder.invoicePublicToken ||
        null,
    };
  };



const getPaymentSummary = async (
  userId,
  orderId
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const orderObjectId =
    new mongoose.Types.ObjectId(orderId);

  const result =
    await Payment.aggregate([
      {
        $match: {
          userId: userObjectId,
          orderId: orderObjectId,
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: {
            $sum: "$amount",
          },
        },
      },
    ]);

  return {
    totalPaid:
      result[0]?.totalPaid || 0,
  };
};

export const getInvoiceData = async (
  userId,
  orderId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      orderId
    )
  ) {
    const error = new Error(
      "Invalid order ID."
    );

    error.statusCode = 400;

    throw error;
  }

  const order =
    await Order.findOne({
      _id: orderId,
      userId,
      isArchived: false,
    }).lean();

  if (!order) {
    const error = new Error(
      "Order not found."
    );

    error.statusCode = 404;

    throw error;
  }

  if (order.status === "cancelled") {
    const error = new Error(
      "Cannot generate an invoice for a cancelled order."
    );

    error.statusCode = 400;

    throw error;
  }

  const [
    customer,
    user,
    paymentSummary,
  ] = await Promise.all([
    Customer.findOne({
      _id: order.customerId,
      userId,
      isArchived: false,
    })
      .select(
        "name phone email address"
      )
      .lean(),

    User.findById(userId)
      .select(
        "name email phone businessName businessPhone businessAddress currency settings"
      )
      .lean(),

    getPaymentSummary(
      userId,
      order._id
    ),
  ]);

  if (!customer) {
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

  const {
    invoiceNumber,
    invoicePublicToken,
  } =
    await getOrCreateInvoiceAccess(
      order._id,
      userId
    );
  const totalPaid =
      paymentSummary.totalPaid;

  const balance = Math.max(
      order.total - totalPaid,
      0
  );

  let paymentStatus = "unpaid";

  if (totalPaid >= order.total) {
      paymentStatus = "paid";
  } else if (totalPaid > 0) {
      paymentStatus = "partially_paid";
  }

  return {
      invoiceNumber,
      invoicePublicToken,

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
          name: customer.name,
          phone: customer.phone,
          email: customer.email || "",
          address:
              customer.address || "",
      },

      order: {
          orderNumber:
              order.orderNumber,
          date: order.createdAt,
          dueDate:
              order.dueDate || null,
      },

      items: order.items.map(
          (item) => ({
              name: item.name,
              quantity: item.quantity,
              sellingPrice:
                  item.sellingPrice,
              total: item.total,
          })
      ),

      subtotal: order.subtotal,

      discount:
          order.discount || 0,

      total: order.total,
      totalPaid,
      balance,
      paymentStatus,
      currency:
          user.currency || "NGN",

      notes:
          order.notes || "",
      invoiceNotes:
          user.settings?.invoiceNotes || "",
  };
};

export const generateInvoicePDF =
  async (invoiceData) => {
    const html =
      generateInvoiceHTML(
        invoiceData
      );

    const browser =
      await puppeteer.launch({
        headless: true,
      });

    try {
      const page =
        await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle0",
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

export const getInvoices = async (
  userId,
  {
    page = 1,
    limit = 20,
    search = "",
    dateFrom,
    dateTo,
  } = {}
) => {
  const skip =
    (Number(page) - 1) *
    Number(limit);

  const filter = {
    userId,
    isArchived: false,
    invoiceNumber: {
      $exists: true,
      $ne: "",
    },
  };

  if (search?.trim()) {
    filter.$or = [
      {
        invoiceNumber: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        orderNumber: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};

    if (dateFrom) {
      filter.createdAt.$gte =
        new Date(`${dateFrom}T00:00:00.000Z`);
    }

    if (dateTo) {
      filter.createdAt.$lte =
        new Date(`${dateTo}T23:59:59.999Z`);
    }
  }

  const [
    orders,
    total,
  ] = await Promise.all([
    Order.find(filter)
      .populate(
        "customerId",
        "name phone email"
      )
      .select(
        "invoiceNumber orderNumber customerId total paymentStatus createdAt dueDate"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    invoices: orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(
        total / Number(limit)
      ),
      hasNextPage:
        Number(page) <
        Math.ceil(
          total / Number(limit)
        ),
      hasPreviousPage:
        Number(page) > 1,
    },
  };
};


export const getInvoiceAccess = async (
  userId,
  orderId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      orderId
    )
  ) {
    const error = new Error(
      "Invalid order ID."
    );

    error.statusCode = 400;

    throw error;
  }

  const {
    invoiceNumber,
    invoicePublicToken,
  } =
    await getOrCreateInvoiceAccess(
      orderId,
      userId
    );

  return {
    invoiceNumber,
    invoicePublicToken,
  };
};

export const getPublicInvoiceData =
  async (token) => {
    if (!token) {
      const error = new Error(
        "Invoice link is invalid."
      );

      error.statusCode = 400;

      throw error;
    }

    const order =
      await Order.findOne({
        invoicePublicToken: token,
        isArchived: false,
      })
        .select("_id userId")
        .lean();

    if (!order) {
      const error = new Error(
        "Invoice not found or the link is no longer valid."
      );

      error.statusCode = 404;

      throw error;
    }

    const user =
         await User.findById(order.userId)
           .select("subscription")
           .lean();

       if (!user) {
         const error = new Error(
           "Business owner not found."
         );

         error.statusCode = 404;

         throw error;
       }

       if (
         !hasFeature(
           user,
           "publicInvoiceLinks"
         )
       ) {
         const error = new Error(
           "Public invoice links require a Pro plan."
         );

         error.statusCode = 403;
         error.code = "PRO_REQUIRED";

         throw error;
       }

       return getInvoiceData(
         order.userId,
         order._id
    );
  };
