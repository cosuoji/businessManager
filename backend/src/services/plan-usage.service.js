import Order from "../modules/orders/order.model.js";
import Payment from "../modules/payments/payment.model.js";
import User from "../modules/users/user.model.js";
import { getPlanLimits } from "../utils/plan.js";
import Customer from "../modules/customers/customer.model.js";

export const getMonthlyOrderCount = async (userId) => {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const count = await Order.countDocuments({
    userId,
    createdAt: {
      $gte: startOfMonth,
      $lt: startOfNextMonth,
    },
  });

  return count;
};

export const getMonthlyInvoiceCount = async (
  userId
) => {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const count = await Order.countDocuments({
    userId,
    invoiceNumber: {
      $exists: true,
      $ne: "",
    },
    createdAt: {
      $gte: startOfMonth,
      $lt: startOfNextMonth,
    },
  });

  return count;
};

export const getMonthlyReceiptCount = async (
  userId
) => {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const count =
    await Payment.countDocuments({
      userId,
      receiptNumber: {
        $exists: true,
        $ne: "",
      },
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    });

  return count;
};

export const getUsage =
  async (userId) => {
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

    const limits =
      getPlanLimits(user);

    const [
      customerCount,
      orderCount,
      invoiceCount,
      receiptCount,
    ] = await Promise.all([
      Customer.countDocuments({
        userId,
        isArchived: false,
      }),

      getMonthlyOrderCount(userId),

      getMonthlyInvoiceCount(userId),

      getMonthlyReceiptCount(userId),
    ]);

    return {
      customers: {
        used: customerCount,
        limit:
          limits.customers === Infinity
            ? null
            : limits.customers,
      },

      orders: {
        used: orderCount,
        limit:
          limits.ordersPerMonth === Infinity
            ? null
            : limits.ordersPerMonth,
      },

      invoices: {
        used: invoiceCount,
        limit:
          limits.invoicesPerMonth === Infinity
            ? null
            : limits.invoicesPerMonth,
      },

      receipts: {
        used: receiptCount,
        limit:
          limits.receiptsPerMonth === Infinity
            ? null
            : limits.receiptsPerMonth,
      },
    };
  };
