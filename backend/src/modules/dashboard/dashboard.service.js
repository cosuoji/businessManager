import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";
import Customer from "../customers/customer.model.js";
import {
  getTotalOutstanding,
  getOutstandingBreakdown,
} from "../outstanding/outstanding.service.js";
import mongoose from "mongoose";

const getAverageOrderValue = async (
  userId,
  startDate,
  endDate
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const result =
    await Order.aggregate([
      {
        $match: {
          userId: userObjectId,

          isArchived: false,

          status: {
            $ne: "cancelled",
          },

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
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

      {
        $project: {
          _id: 0,

          totalSales: 1,

          orderCount: 1,

          averageOrderValue: {
            $cond: [
              {
                $gt: [
                  "$orderCount",
                  0,
                ],
              },

              {
                $divide: [
                  "$totalSales",
                  "$orderCount",
                ],
              },

              0,
            ],
          },
        },
      },
    ]);

  return {
    totalSales:
      result[0]?.totalSales || 0,

    orderCount:
      result[0]?.orderCount || 0,

    averageOrderValue:
      result[0]?.averageOrderValue || 0,
  };
};

const getCollectionMetrics = async (
  userId,
  startDate,
  endDate
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const [
    salesResult,
    paymentsResult,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          userId: userObjectId,

          isArchived: false,

          status: {
            $ne: "cancelled",
          },

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: null,

          totalSales: {
            $sum: "$total",
          },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: {
          userId: userObjectId,

          paymentDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: null,

          totalPayments: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  const totalSales =
    salesResult[0]?.totalSales || 0;

  const totalPayments =
    paymentsResult[0]?.totalPayments || 0;

  const collectionRate =
    totalSales > 0
      ? Number(
          (
            (totalPayments /
              totalSales) *
            100
          ).toFixed(2)
        )
      : null;

  return {
    totalSales,
    totalPayments,
    collectionRate,
  };
};

const getTopCustomers = async (
  userId,
  startDate,
  endDate
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const result = await Order.aggregate([
    {
      $match: {
        userId: userObjectId,
        isArchived: false,
        status: {
          $ne: "cancelled",
        },
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $group: {
        _id: "$customerId",

        sales: {
          $sum: "$total",
        },

        orderCount: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        sales: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer",
      },
    },

    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,

        customerId: "$_id",

        name: {
          $ifNull: [
            "$customer.name",
            "Unknown customer",
          ],
        },

        sales: 1,

        orderCount: 1,
      },
    },
  ]);

  return result;
};

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

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return {
    startDate: start,
    endDate: end,
  };
};

const getCustomerGrowth = async (
  userId,
  startDate,
  endDate
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const result =
    await Customer.aggregate([
      {
        $match: {
          userId: userObjectId,

          isArchived: false,

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          count: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,

          date: "$_id",

          count: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

  return result;
};

const fillCustomerGrowthDates = (
  growthData,
  startDate,
  endDate
) => {
  const dataMap = new Map(
    growthData.map((item) => [
      item.date,
      item.count,
    ])
  );

  const result = [];

  const current = new Date(
    startDate
  );

  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);

  end.setHours(
    0,
    0,
    0,
    0
  );

  while (current <= end) {
    const date =
      current.toISOString().slice(0, 10);

    result.push({
      date,

      count:
        dataMap.get(date) || 0,
    });

    current.setDate(
      current.getDate() + 1
    );
  }

  return result;
};

/**
 * Calculate the previous comparison period.
 *
 * Example:
 * Aug 1 → Aug 20
 * becomes:
 * Jul 12 → Jul 31
 */
const getPreviousPeriod = (
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // Number of calendar days in current period
  const durationMs =
    end.getTime() -
    start.getTime() +
    24 * 60 * 60 * 1000;

  const previousEnd = new Date(start);
  previousEnd.setDate(
    previousEnd.getDate() - 1
  );
  previousEnd.setHours(
    23,
    59,
    59,
    999
  );

  const previousStart = new Date(
    previousEnd
  );

  previousStart.setTime(
    previousEnd.getTime() -
      durationMs +
      1
  );

  previousStart.setHours(
    0,
    0,
    0,
    0
  );

  return {
    startDate: previousStart,
    endDate: previousEnd,
  };
};

/**
 * Calculate percentage change.
 *
 * Returns null when previous value is zero
 * and current value is non-zero because
 * percentage growth from zero is undefined.
 */
const calculateChangePercent = (
  current,
  previous
) => {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return null;
  }

  return Number(
    (
      ((current - previous) /
        previous) *
      100
    ).toFixed(2)
  );
};

/**
 * Get dashboard metrics for a specific period.
 *
 * This is shared by the current period
 * and the previous comparison period.
 */
const getPeriodMetrics = async (
  userId,
  startDate,
  endDate
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(
      userId
    );

  const orderDateFilter = {
    userId: userObjectId,
    isArchived: false,
    status: {
      $ne: "cancelled",
    },
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const paymentDateFilter = {
    userId: userObjectId,
    paymentDate: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  // -----------------------------------------
  // SALES
  // -----------------------------------------

  const salesResult =
    await Order.aggregate([
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
    amount:
      salesResult[0]?.totalSales ||
      0,

    orderCount:
      salesResult[0]?.orderCount ||
      0,
  };

  // -----------------------------------------
  // PAYMENTS
  // -----------------------------------------

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
    amount:
      paymentsResult[0]?.totalPayments ||
      0,

    count:
      paymentsResult[0]?.paymentCount ||
      0,
  };

  // -----------------------------------------
  // ESTIMATED PROFIT
  // -----------------------------------------

  const profitResult =
    await Order.aggregate([
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
    profitResult[0]
      ?.estimatedProfit || 0;

  return {
    sales,
    payments,
    estimatedProfit,
  };
};

/**
 * Main dashboard summary.
 */
export const getDashboardSummary = async (
  userId,
  startDate,
  endDate,
  includeComparison = false
) => {
  const {
    startDate: rangeStart,
    endDate: rangeEnd,
  } = getDateRange(
    startDate,
    endDate
  );

  // -----------------------------------------
  // CURRENT PERIOD
  // -----------------------------------------

  const currentMetrics =
    await getPeriodMetrics(
      userId,
      rangeStart,
      rangeEnd
    );

  let trends = null;

  if (includeComparison) {
    const rawTrendData =
      await getTrendData(
        userId,
        rangeStart,
        rangeEnd
      );

    trends = fillTrendDates(
      rawTrendData,
      rangeStart,
      rangeEnd
    );
  }

  // -----------------------------------------
  // TOTAL OUTSTANDING
  // -----------------------------------------
  //
  // Outstanding is intentionally NOT tied
  // to the selected reporting period.
  //
  // It represents what the business currently
  // has outstanding.

  const outstanding =
    await getTotalOutstanding(
      userId
    );

  let outstandingBreakdown =
    null;

  if (includeComparison) {
    outstandingBreakdown =
      await getOutstandingBreakdown(
        userId
      );
  }
  // -----------------------------------------
  // CUSTOMER COUNT
  // -----------------------------------------

  const userObjectId =
    new mongoose.Types.ObjectId(
      userId
    );

  const customerCount =
    await Customer.countDocuments({
      userId: userObjectId,
      isArchived: false,
    });

  let topCustomers = null;

  if (includeComparison) {
    topCustomers =
      await getTopCustomers(
        userId,
        rangeStart,
        rangeEnd
      );
  }

  // -----------------------------------------
  // CUSTOMER GROWTH
  // -----------------------------------------

  let customerGrowth = null;

  if (includeComparison) {
    const rawCustomerGrowth =
      await getCustomerGrowth(
        userId,
        rangeStart,
        rangeEnd
      );

    customerGrowth =
      fillCustomerGrowthDates(
        rawCustomerGrowth,
        rangeStart,
        rangeEnd
      );
  }

  // -----------------------------------------
  // RECENT ORDERS
  // -----------------------------------------

  const recentOrders =
    await Order.find({
      userId: userObjectId,
      isArchived: false,
      status: {
        $ne: "cancelled",
      },
    })
      .populate(
        "customerId",
        "name"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

  // -----------------------------------------
  // RECENT PAYMENTS
  // -----------------------------------------

  const recentPayments =
    await Payment.find({
      userId: userObjectId,
    })
      .populate({
        path: "orderId",
        select:
          "orderNumber customerId",
        populate: {
          path: "customerId",
          select: "name",
        },
      })
      .sort({
        paymentDate: -1,
      })
      .limit(5)
      .lean();


  // -----------------------------------------
  // COLLECTION METRICS
  // -----------------------------------------

  let collectionMetrics = null;
  let averageOrderValue = null;

  if (includeComparison) {
    const [
      collectionResult,
      averageOrderResult,
    ] = await Promise.all([
      getCollectionMetrics(
        userId,
        rangeStart,
        rangeEnd
      ),

      getAverageOrderValue(
        userId,
        rangeStart,
        rangeEnd
      ),
    ]);

    collectionMetrics =
      collectionResult;

    averageOrderValue =
      averageOrderResult;
  }
  // -----------------------------------------
  // BUILD RESULT
  // -----------------------------------------

  const result = {
    dateRange: {
      startDate: rangeStart,
      endDate: rangeEnd,
    },

    sales:
      currentMetrics.sales,

    payments:
      currentMetrics.payments,

    estimatedProfit:
      currentMetrics.estimatedProfit,

    totalOutstanding:
      outstanding.totalOutstanding,

    recentOrders,

    recentPayments,

    customerCount,

    ...(trends
      ? { trends }
      : {}),

    ...(outstandingBreakdown
      ? {
          outstandingBreakdown,
        }
      : {}),

    ...(topCustomers
      ? {
          topCustomers,
        }
      : {}),
    ...(collectionMetrics
      ? {
          collectionMetrics,
        }
      : {}),

    ...(averageOrderValue
      ? {
          averageOrderValue,
        }
      : {}),
    ...(customerGrowth
      ? {
          customerGrowth,
        }
      : {}),
  };

  // -----------------------------------------
  // PRO COMPARISON
  // -----------------------------------------

  if (includeComparison) {
    const {
      startDate: previousStartDate,
      endDate: previousEndDate,
    } = getPreviousPeriod(
      rangeStart,
      rangeEnd
    );

    const previousMetrics =
      await getPeriodMetrics(
        userId,
        previousStartDate,
        previousEndDate
      );

    result.comparison = {
      sales: {
        current:
          currentMetrics.sales
            .amount,

        previous:
          previousMetrics.sales
            .amount,

        changePercent:
          calculateChangePercent(
            currentMetrics.sales
              .amount,
            previousMetrics.sales
              .amount
          ),
      },

      orders: {
        current:
          currentMetrics.sales
            .orderCount,

        previous:
          previousMetrics.sales
            .orderCount,

        changePercent:
          calculateChangePercent(
            currentMetrics.sales
              .orderCount,
            previousMetrics.sales
              .orderCount
          ),
      },

      payments: {
        current:
          currentMetrics.payments
            .amount,

        previous:
          previousMetrics.payments
            .amount,

        changePercent:
          calculateChangePercent(
            currentMetrics.payments
              .amount,
            previousMetrics.payments
              .amount
          ),
      },

      estimatedProfit: {
        current:
          currentMetrics.estimatedProfit,

        previous:
          previousMetrics.estimatedProfit,

        changePercent:
          calculateChangePercent(
            currentMetrics
              .estimatedProfit,
            previousMetrics
              .estimatedProfit
          ),
      },

      period: {
        current: {
          startDate:
            rangeStart,

          endDate:
            rangeEnd,
        },

        previous: {
          startDate:
            previousStartDate,

          endDate:
            previousEndDate,
        },
      },
    };
  }

  return result;
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
        Math.ceil(
          total / limit
        ),
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
            select:
              "name phone",
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
        Math.ceil(
          total / limit
        ),
    },
  };
};

const getTrendData = async (
  userId,
  startDate,
  endDate
) => {
  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const result =
    await Order.aggregate([
      {
        $match: {
          userId: userObjectId,
          isArchived: false,
          status: {
            $ne: "cancelled",
          },
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $project: {
          createdAt: 1,
          discount: {
            $ifNull: [
              "$discount",
              0,
            ],
          },

          items: 1,
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$_id",

          date: {
            $first: "$createdAt",
          },

          discount: {
            $first: "$discount",
          },

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
        },
      },

      {
        $project: {
          date: 1,

          sales: "$revenue",

          estimatedProfit: {
            $subtract: [
              {
                $subtract: [
                  "$revenue",
                  "$cost",
                ],
              },
              "$discount",
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },

          sales: {
            $sum: "$sales",
          },

          estimatedProfit: {
            $sum: "$estimatedProfit",
          },
        },
      },

      {
        $project: {
          _id: 0,

          date: "$_id",

          sales: 1,

          estimatedProfit: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

  return result;
};

const fillTrendDates = (
  trendData,
  startDate,
  endDate
) => {
  const dataMap = new Map(
    trendData.map((item) => [
      item.date,
      item,
    ])
  );

  const result = [];

  const current = new Date(
    startDate
  );

  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);

  end.setHours(
    0,
    0,
    0,
    0
  );

  while (current <= end) {
    const date =
      current.toISOString().slice(0, 10);

    const existing =
      dataMap.get(date);

    result.push({
      date,

      sales:
        existing?.sales || 0,

      estimatedProfit:
        existing?.estimatedProfit || 0,
    });

    current.setDate(
      current.getDate() + 1
    );
  }

  return result;
};
