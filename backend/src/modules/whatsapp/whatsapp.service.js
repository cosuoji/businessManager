
import {
  formatCurrency,
  formatDate,
  getOrderContext,
} from "../../utils/whatsappHelpers.js";
import mongoose from "mongoose";

import User from "../users/user.model.js";
import Customer from "../customers/customer.model.js";
import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";

import { getInvoiceAccess } from "../invoice/invoice.service.js";

export const generateInvoiceMessage =
  async (
    userId,
    orderId
  ) => {
    const {
      order,
      customer,
      user,
    } = await getOrderContext(
      userId,
      orderId
    );

    const {
      invoiceNumber,
      invoicePublicToken,
    } =
      await getInvoiceAccess(
        userId,
        orderId
      );

    const currency =
      user.currency || "NGN";

    const dueDate =
      formatDate(order.dueDate);

    const invoiceUrl =
      `${process.env.CLIENT_URL}/invoice/${invoicePublicToken}`;

    const message = [
      `Hello ${customer.name},`,
      "",
      `Please find the details of your order ${order.orderNumber}.`,
      "",
      `Invoice: ${invoiceNumber}`,
      `Amount: ${formatCurrency(
        order.total,
        currency
      )}`,
      dueDate
        ? `Due date: ${dueDate}`
        : null,
      "",
      `View or download your invoice:`,
      invoiceUrl,
      "",
      `Thank you for your business.`,
      user.businessName
        ? `- ${user.businessName}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      type: "invoice",
      phone: customer.phone,
      customerName:
        customer.name,
      message,
      invoiceUrl,
    };
  };


export const generateReceiptMessage =
  async (
    userId,
    paymentId
  ) => {
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

    const {
      order,
      customer,
      user,
    } = await getOrderContext(
      userId,
      payment.orderId
    );

    const currency =
      user.currency || "NGN";

    const message = [
      `Hello ${customer.name},`,
      "",
      `Thank you for your payment.`,
      "",
      `Receipt: ${
        payment.receiptNumber ||
        "Payment receipt"
      }`,
      `Amount received: ${formatCurrency(
        payment.amount,
        currency
      )}`,
      `Payment method: ${payment.paymentMethod}`,
      `Order: ${order.orderNumber}`,
      "",
      `Thank you for your business.`,
      user.businessName
        ? `- ${user.businessName}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      type: "receipt",
      phone: customer.phone,
      customerName:
        customer.name,
      message,
    };
  };

const getOrderPaymentSummary =
  async (
    userId,
    order
  ) => {

    const userObjectId =
      new mongoose.Types.ObjectId(userId);
    const result =
      await Payment.aggregate([
        {
          $match: {
            userId: userObjectId,
            orderId:
              order._id,
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

    const totalPaid =
      result[0]?.totalPaid || 0;

    const balance = Math.max(
      order.total - totalPaid,
      0
    );

    return {
      totalPaid,
      balance,
    };
  };

export const generatePaymentReminder =
  async (
    userId,
    orderId
  ) => {

    const {
      order,
      customer,
      user,
    } = await getOrderContext(
      userId,
      orderId
    );

    const {
      balance,
    } =
      await getOrderPaymentSummary(
        userId,
        order
      );

    if (balance <= 0) {
      const error = new Error(
        "This order has no outstanding balance."
      );

      error.statusCode = 400;

      throw error;
    }

    const currency =
      user.currency || "NGN";

    const dueDate =
      formatDate(order.dueDate);

    const message = [
      `Hello ${customer.name},`,
      "",
      `This is a friendly reminder that ${formatCurrency(
        balance,
        currency
      )} remains outstanding on order ${order.orderNumber}.`,
      dueDate
        ? `Payment was due on ${dueDate}.`
        : null,
      "",
      `Thank you.`,
      user.businessName
        ? `- ${user.businessName}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      type: "payment_reminder",
      phone: customer.phone,
      customerName:
        customer.name,
      message,
      balance,
    };
  };

export const generateOutstandingBalanceMessage =
  async (
    userId,
    customerId
  ) => {
    const userObjectId =
      new mongoose.Types.ObjectId(userId);

    if (
      !mongoose.Types.ObjectId.isValid(
        customerId
      )
    ) {
      const error = new Error(
        "Invalid customer ID."
      );

      error.statusCode = 400;

      throw error;
    }

    const [
      customer,
      user,
      orders,
    ] = await Promise.all([
      Customer.findOne({
        _id: customerId,
        userId: userObjectId,
        isArchived: false,
      }).lean(),

      User.findById(userId)
        .select(
          "businessName currency"
        )
        .lean(),

      Order.find({
        userId: userObjectId,
        customerId,
        isArchived: false,
        status: {
          $ne: "cancelled",
        },
      })
        .sort({
          createdAt: -1,
        })
        .lean(),
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

    const currency =
      user.currency || "NGN";

    const orderIds =
      orders.map(
        (order) => order._id
      );

    const paymentTotals =
      await Payment.aggregate([
        {
          $match: {
            userId: userObjectId,
            orderId: {
              $in: orderIds,
            },
          },
        },

        {
          $group: {
            _id: "$orderId",

            totalPaid: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const paymentMap =
      new Map(
        paymentTotals.map(
          (payment) => [
            payment._id.toString(),
            payment.totalPaid,
          ]
        )
      );

    const outstandingOrders =
      orders
        .map((order) => {
          const totalPaid =
            paymentMap.get(
              order._id.toString()
            ) || 0;

          const balance =
            Math.max(
              order.total -
                totalPaid,
              0
            );

          return {
            ...order,
            balance,
          };
        })
        .filter(
          (order) =>
            order.balance > 0
        );

    if (
      outstandingOrders.length === 0
    ) {
      const error = new Error(
        "This customer has no outstanding balance."
      );

      error.statusCode = 400;

      throw error;
    }

    const totalOutstanding =
      outstandingOrders.reduce(
        (total, order) =>
          total + order.balance,
        0
      );

    const orderLines =
      outstandingOrders.map(
        (order) => {
          const dueDate =
            formatDate(
              order.dueDate
            );

          return `• ${
            order.orderNumber
          }: ${formatCurrency(
            order.balance,
            currency
          )}${
            dueDate
              ? ` (Due ${dueDate})`
              : ""
          }`;
        }
      );

    const message = [
      `Hello ${customer.name},`,
      "",
      `Your current outstanding balance is ${formatCurrency(
        totalOutstanding,
        currency
      )}.`,
      "",
      "Outstanding orders:",
      ...orderLines,
      "",
      `Thank you.`,
      user.businessName
        ? `- ${user.businessName}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      type: "outstanding_balance",
      phone: customer.phone,
      customerName:
        customer.name,
      message,
      totalOutstanding,
      outstandingOrders:
        outstandingOrders.length,
    };
  };
