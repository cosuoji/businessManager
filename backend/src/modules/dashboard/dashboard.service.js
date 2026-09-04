import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";
import Customer from "../customers/customer.model.js";
import {
  getTotalOutstanding,
} from "../outstanding/outstanding.service.js";
import mongoose from "mongoose";

const getDateRange = (
  startDate,
  endDate
) => {
  if (!startDate && !endDate) {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      startDate: startOfDay,
      endDate: endOfDay,
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  end.setHours(23, 59, 59, 999);

  return {
    startDate: start,
    endDate: end,
  };
};

export const getDashboardSummary = async (
  userId,
  startDate,
  endDate
) => {
  const {
    startDate: rangeStart,
    endDate: rangeEnd,
  } = getDateRange(startDate, endDate);

  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const orderDateFilter = {
    userId: userObjectId,
    isArchived: false,
    status: {
      $ne: "cancelled",
    },
    createdAt: {
      $gte: rangeStart,
      $lte: rangeEnd,
    },
  };

  const paymentDateFilter = {
    userId: userObjectId,
    paymentDate: {
      $gte: rangeStart,
      $lte: rangeEnd,
    },
  };

  // SALES
  const salesResult = await Order.aggregate([
    {
      $match: orderDateFilter,
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$total",
        },
        orderCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const sales = {
    amount: salesResult[0]?.totalSales || 0,
    orderCount: salesResult[0]?.orderCount || 0,
  };

  // PAYMENTS
  const paymentsResult =
    await Payment.aggregate([
      {
        $match: paymentDateFilter,
      },
      {
        $group: {
          _id: null,
          totalPayments: {
            $sum: "$amount",
          },
          paymentCount: {
            $sum: 1,
          },
        },
      },
    ]);

  const payments = {
    amount: paymentsResult[0]?.totalPayments || 0,
    count: paymentsResult[0]?.paymentCount || 0,
  };

  // ESTIMATED PROFIT
  const profitResult = await Order.aggregate([
    {
      $match: orderDateFilter,
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$_id",

        revenue: {
          $sum: {
            $multiply: [
              "$items.quantity",
              "$items.sellingPrice",
            ],
          },
        },

        cost: {
          $sum: {
            $multiply: [
              "$items.quantity",
              "$items.productCost",
            ],
          },
        },

        discount: {
          $first: "$discount",
        },
      },
    },
    {
      $group: {
        _id: null,

        totalRevenue: {
          $sum: "$revenue",
        },

        totalCost: {
          $sum: "$cost",
        },

        totalDiscount: {
          $sum: "$discount",
        },
      },
    },
    {
      $project: {
        _id: 0,

        estimatedProfit: {
          $subtract: [
            {
              $subtract: [
                "$totalRevenue",
                "$totalCost",
              ],
            },
            "$totalDiscount",
          ],
        },
      },
    },
  ]);

  const estimatedProfit =
    profitResult[0]?.estimatedProfit || 0;

  // TOTAL OUTSTANDING
  const outstanding =
    await getTotalOutstanding(userId);

  // CUSTOMER COUNT
  const customerCount =
    await Customer.countDocuments({
      userId: userObjectId,
      isArchived: false,
    });

  // RECENT ORDERS
  const recentOrders = await Order.find({
    userId: userObjectId,
    isArchived: false,
    status: { $ne: "cancelled" },
  })
    .populate("customerId", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // RECENT PAYMENTS
  const recentPayments = await Payment.find({
    userId: userObjectId,
  })
    .populate({
      path: "orderId",
      select: "orderNumber customerId",
      populate: {
        path: "customerId",
        select: "name",
      },
    })
    .sort({ paymentDate: -1 })
    .limit(5)
    .lean();

  return {
    dateRange: {
      startDate: rangeStart,
      endDate: rangeEnd,
    },

    sales,

    payments,

    estimatedProfit,

    totalOutstanding:
      outstanding.totalOutstanding,

    recentOrders,

    recentPayments,

    customerCount,
  };
};

export const getRecentOrders = async (
  userId,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const filter = {
    userId,
    isArchived: false,
    status: {
      $ne: "cancelled",
    },
  };

  const [orders, total] =
    await Promise.all([
      Order.find(filter)
        .populate(
          "customerId",
          "name phone"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

  return {
    orders,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

export const getRecentPayments = async (
  userId,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const filter = {
    userId,
  };

  const [payments, total] =
    await Promise.all([
      Payment.find(filter)
        .populate({
          path: "orderId",
          select:
            "orderNumber customerId total",
          populate: {
            path: "customerId",
            select: "name phone",
          },
        })
        .sort({
          paymentDate: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Payment.countDocuments(filter),
    ]);

  return {
    payments,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};
