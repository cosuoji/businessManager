import mongoose from "mongoose";
import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";
import Customer from "../customers/customer.model.js";

const toObjectId = (id) => {
    if (id instanceof mongoose.Types.ObjectId) {
        return id;
    }

    return new mongoose.Types.ObjectId(id);
};

const buildOutstandingOrdersPipeline = ({
    userId,
    customerId,
    dueFilter,
}) => {
    const match = {
        userId: toObjectId(userId),
        isArchived: false,
        status: { $ne: "cancelled" },
    };

    if (customerId) {
        match.customerId = toObjectId(customerId);
    }

    const pipeline = [
        {
            $match: match,
        },

        {
            $lookup: {
                from: "payments",
                let: {
                    orderId: "$_id",
                    userId: "$userId",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$orderId",
                                            "$$orderId",
                                        ],
                                    },
                                    {
                                        $eq: [
                                            "$userId",
                                            "$$userId",
                                        ],
                                    },
                                ],
                            },
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
                ],
                as: "paymentSummary",
            },
        },

        {
            $addFields: {
                totalPaid: {
                    $ifNull: [
                        {
                            $arrayElemAt: [
                                "$paymentSummary.totalPaid",
                                0,
                            ],
                        },
                        0,
                    ],
                },
            },
        },

        {
            $addFields: {
                balance: {
                    $max: [
                        {
                            $subtract: [
                                "$total",
                                "$totalPaid",
                            ],
                        },
                        0,
                    ],
                },
            },
        },

        {
            $match: {
                balance: {
                    $gt: 0,
                },
            },
        },
    ];

    // Due-date filtering
    if (dueFilter) {
        pipeline.push({
            $match: {
                dueDate: dueFilter,
            },
        });
    }

    pipeline.push(
        {
            $lookup: {
                from: "customers",
                localField: "customerId",
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
                paymentSummary: 0,
                "customer.email": 0,
            },
        }
    );

    return pipeline;
};



const getPaymentTotals = async (userId) => {
  const paymentTotals = await Payment.aggregate([
    {
      $match: {
        userId,
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

  return paymentTotals;
};


export const getOutstandingOrders = async (
    userId,
    { page = 1, limit = 20 }
) => {
    const skip = (page - 1) * limit;

    const pipeline = buildOutstandingOrdersPipeline({
        userId,
    });

    pipeline.push({
        $facet: {
            metadata: [
                {
                    $count: "total",
                },
            ],

            data: [
                {
                    $sort: {
                        dueDate: 1,
                        createdAt: -1,
                    },
                },

                {
                    $skip: skip,
                },

                {
                    $limit: limit,
                },
            ],
        },
    });

    const [result] = await Order.aggregate(pipeline);

    const total = result?.metadata?.[0]?.total || 0;

    return {
        orders: result?.data || [],

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};


export const getTotalOutstanding = async (userId) => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfDueSoon = new Date(startOfToday);
    endOfDueSoon.setDate(
        endOfDueSoon.getDate() + 7
    );
    endOfDueSoon.setHours(23, 59, 59, 999);

    const pipeline = buildOutstandingOrdersPipeline({
        userId,
    });

    pipeline.push({
        $facet: {
            total: [
                {
                    $group: {
                        _id: null,
                        amount: {
                            $sum: "$balance",
                        },
                    },
                },
            ],

            dueSoon: [
                {
                    $match: {
                        dueDate: {
                            $gte: startOfToday,
                            $lte: endOfDueSoon,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        amount: {
                            $sum: "$balance",
                        },
                    },
                },
            ],

            overdue: [
                {
                    $match: {
                        dueDate: {
                            $lt: startOfToday,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        amount: {
                            $sum: "$balance",
                        },
                    },
                },
            ],
        },
    });

    const [result] = await Order.aggregate(pipeline);

    return {
        totalOutstanding:
            result?.total?.[0]?.amount || 0,

        dueSoon:
            result?.dueSoon?.[0]?.amount || 0,

        overdue:
            result?.overdue?.[0]?.amount || 0,
    };
};

export const getCustomerOutstanding = async (
    userId,
    customerId,
    { page = 1, limit = 20 }
) => {
    const userObjectId = toObjectId(userId);
  const customerObjectId = toObjectId(customerId);

  const now = new Date();

  const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);


    const customer = await Customer.findOne({
        _id: customerObjectId,
        userId: userObjectId,
        isArchived: false,
    }).lean();

    if (!customer) {
        const error = new Error("Customer not found.");
        error.statusCode = 404;
        throw error;
    }

    const skip = (page - 1) * limit;

    const pipeline = buildOutstandingOrdersPipeline({
        userId: userObjectId,
        customerId: customerObjectId,
    });

    pipeline.push({
        $facet: {
            metadata: [
                {
                    $count: "total",
                },
            ],

            totals: [
                {
                    $group: {
                        _id: null,
                        totalOutstanding: {
                            $sum: "$balance",
                        },
                    },
                },
            ],

            data: [
                {
                    $sort: {
                        dueDate: 1,
                        createdAt: -1,
                    },
                },

                {
                    $skip: skip,
                },

                {
                    $limit: limit,
                },
        ],
        overdue: [
          {
            $match: {
              dueDate: {
                $lt: startOfToday,
              },
            },
          },
          {
            $group: {
              _id: null,
              overdueAmount: {
                $sum: "$balance",
              },
              overdueOrderCount: {
                $sum: 1,
              },
            },
          },
        ],
        },
    });


    const [result] = await Order.aggregate(pipeline);

    const total = result?.metadata?.[0]?.total || 0;

    const totalOutstanding =
        result?.totals?.[0]?.totalOutstanding || 0;

  const overdueAmount =
      result?.overdue?.[0]?.overdueAmount || 0;

    const overdueOrderCount =
      result?.overdue?.[0]?.overdueOrderCount || 0;

  return {
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },

        customerId: customer._id,

    totalOutstanding,
    overdueAmount,
     overdueOrderCount,

        orders: result?.data || [],

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};


const addPaymentStatus = (
  order,
  totalPaid
) => {
  let paymentStatus = "unpaid";

  if (totalPaid >= order.total) {
    paymentStatus = "paid";
  } else if (totalPaid > 0) {
    paymentStatus = "partially_paid";
  }

  return {
    ...order,
    totalPaid,
    balance: Math.max(
      order.total - totalPaid,
      0
    ),
    paymentStatus,
  };
};

export const getOrdersByPaymentStatus = async (
  userId,
  paymentStatus
) => {


  const orders = await Order.find({
    userId,
    isArchived: false,
    status: {
      $ne: "cancelled",
    },
  })
    .populate(
      "customerId",
      "name phone"
    )
    .lean();

  const paymentTotals =
    await getPaymentTotals(userId);

  const paymentMap = new Map(
    paymentTotals.map((payment) => [
      payment._id.toString(),
      payment.totalPaid,
    ])
  );

  return orders
    .map((order) => {
      const totalPaid =
        paymentMap.get(
          order._id.toString()
        ) || 0;

      return addPaymentStatus(
        order,
        totalPaid
      );
    })
    .filter(
      (order) =>
        order.paymentStatus ===
        paymentStatus
    );
};

export const getDueSoonOrders = async (
    userId,
    { page = 1, limit = 20 }
) => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfDueSoon = new Date(startOfToday);
    endOfDueSoon.setDate(endOfDueSoon.getDate() + 7);
    endOfDueSoon.setHours(23, 59, 59, 999);

    const pipeline = buildOutstandingOrdersPipeline({
        userId,
        dueFilter: {
            $gte: startOfToday,
            $lte: endOfDueSoon,
        },
    });

    const skip = (page - 1) * limit;

    pipeline.push({
        $facet: {
            metadata: [
                {
                    $count: "total",
                },
            ],

            data: [
                {
                    $sort: {
                        dueDate: 1,
                        createdAt: -1,
                    },
                },

                {
                    $skip: skip,
                },

                {
                    $limit: limit,
                },
            ],
        },
    });

    const [result] = await Order.aggregate(pipeline);

    const total = result?.metadata?.[0]?.total || 0;

    return {
        orders: result?.data || [],

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};


export const getOverdueOrders = async (
    userId,
    { page = 1, limit = 20 }
) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const pipeline = buildOutstandingOrdersPipeline({
        userId,
        dueFilter: {
            $lt: startOfToday,
        },
    });

    const skip = (page - 1) * limit;

    pipeline.push({
        $facet: {
            metadata: [
                {
                    $count: "total",
                },
            ],

            data: [
                {
                    $sort: {
                        dueDate: 1,
                        createdAt: -1,
                    },
                },

                {
                    $skip: skip,
                },

                {
                    $limit: limit,
                },
            ],
        },
    });

    const [result] = await Order.aggregate(pipeline);

    const total = result?.metadata?.[0]?.total || 0;

    return {
        orders: result?.data || [],

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        },
    };
};

// outstanding.service.js

export const getOutstandingCustomers = async (
  userId,
  { page = 1, limit = 20 }
) => {
  const skip = (page - 1) * limit;

  const userObjectId = toObjectId(userId);

  const pipeline = buildOutstandingOrdersPipeline({
    userId: userObjectId,
  });

  pipeline.push(
    {
      $group: {
        _id: "$customerId",
        orderCount: { $sum: 1 },
        totalOutstanding: { $sum: "$balance" },

        overdueAmount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$dueDate", null] },
                  { $lt: ["$dueDate", new Date()] },
                ],
              },
              "$balance",
              0,
            ],
          },
        },
      },
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
      $match: {
        "customer.isArchived": false,
      },
    },
    {
      $project: {
        _id: 1,
        name: "$customer.name",
        phone: "$customer.phone",
        orderCount: 1,
        totalOutstanding: 1,
        overdueAmount: 1,
      },
    },
    {
      $facet: {
        metadata: [
          { $count: "total" },
        ],
        data: [
          {
            $sort: {
              totalOutstanding: -1,
              name: 1,
            },
          },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    }
  );

  const [result] = await Order.aggregate(pipeline);

  const total = result?.metadata?.[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    customers: result?.data || [],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
