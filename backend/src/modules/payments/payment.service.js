import Payment from "./payment.model.js";
import Order from "../orders/order.model.js";
import Customer from "../customers/customer.model.js";

import mongoose from "mongoose";

const calculatePaymentSummary = async (
    order,
    userId,
    session
) => {
    const userObjectId =
        new mongoose.Types.ObjectId(userId);

    const result = await Payment.aggregate([
        {
            $match: {
                orderId: order._id,
                userId: userObjectId,
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
    ]).session(session);

    const totalPaid =
        result[0]?.totalPaid || 0;

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
        orderTotal: order.total,
        totalPaid,
        balance,
        paymentStatus,
    };
};

export const recordPayment = async (userId, data) => {
  const session = await mongoose.startSession();
  try {
    let createdPayment;
    let paymentSummary;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: data.orderId,
        userId,
        isArchived: false,
      }).session(session);

      if (!order) {
        const error = new Error(
          "Order not found."
        );

        error.statusCode = 404;
        throw error;
      }

      if (order.status === "cancelled") {
        const error = new Error(
          "Cannot record a payment for a cancelled order."
        );

        error.statusCode = 400;
        throw error;
      }

      const currentSummary =
        await calculatePaymentSummary(
          order,
          userId,
          session
        );

      const amount = Number(data.amount);

      if (
          !Number.isFinite(amount) ||
          amount <= 0
      ) {
          const error = new Error(
              "Payment amount must be greater than zero."
          );

          error.statusCode = 400;

          throw error;
      }


      if (amount > currentSummary.balance) {
        const error = new Error(
          `Payment exceeds the remaining balance of ${currentSummary.balance}.`
        );

        error.statusCode = 400;
        throw error;
      }

      const payments = await Payment.create(
        [
          {
            userId,
            orderId: order._id,
            amount,
            paymentMethod: data.paymentMethod,
            paymentDate:
              data.paymentDate || new Date(),
            reference:
              data.reference?.trim(),
            notes:
              data.notes?.trim(),
          },
        ],
        { session }
      );

      createdPayment = payments[0];

      paymentSummary =
        await calculatePaymentSummary(
          order,
          userId,
          session
        );

      order.paymentStatus =
        paymentSummary.paymentStatus;

      await order.save({ session });
    });


    return {
      payment: createdPayment,
      summary: paymentSummary,
    };
  } finally {
    await session.endSession();
  }
};


export const getOrderPaymentSummary = async (
    userId,
    orderId
) => {
    const order = await Order.findOne({
        _id: orderId,
        userId,
        isArchived: false,
    });

    if (!order) {
        const error = new Error(
            "Order not found."
        );

        error.statusCode = 404;

        throw error;
    }

    const userObjectId =
        new mongoose.Types.ObjectId(userId);

    const result = await Payment.aggregate([
        {
            $match: {
                orderId: order._id,
                userId: userObjectId,
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

    let paymentStatus = "unpaid";

    if (totalPaid >= order.total) {
        paymentStatus = "paid";
    } else if (totalPaid > 0) {
        paymentStatus = "partially_paid";
    }

    return {
        orderTotal: order.total,
        totalPaid,
        balance,
        paymentStatus,
    };
};

export const updateOrderPaymentStatus = async (
  userId,
  orderId
) => {
  const summary =
    await getOrderPaymentSummary(
      userId,
      orderId
    );

  await Order.findOneAndUpdate(
    {
      _id: orderId,
      userId,
    },
    {
      paymentStatus:
        summary.paymentStatus,
    }
  );

  return summary;
};

export const getPaymentHistory = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    userId,
    isArchived: false,
  });

  if (!order) {
    const error = new Error(
      "Order not found."
    );

    error.statusCode = 404;

    throw error;
  }

  const payments = await Payment.find({
    orderId: order._id,
    userId,
  })
    .sort({ paymentDate: -1 })
    .lean();

  const summary =
    await getOrderPaymentSummary(
      userId,
      orderId
    );

  return {
    payments,
    summary,
  };
};

export const getPayments = async ({
  userId,
  page = 1,
  limit = 20,
  search = "",
  paymentMethod,
  dateFrom,
  dateTo,
}) => {
  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const perPage = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const skip =
    (currentPage - 1) * perPage;

  const filter = {
    userId,
  };

  if (paymentMethod) {
    filter.paymentMethod =
      paymentMethod;
  }

  if (dateFrom || dateTo) {
    filter.paymentDate = {};

    if (dateFrom) {
      const start = new Date(dateFrom);
      start.setHours(0, 0, 0, 0);

      filter.paymentDate.$gte = start;
    }

    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);

      filter.paymentDate.$lte = end;
    }
  }

  /*
   * Search across:
   * - payment reference
   * - order number
   * - customer name
   */

  if (search.trim()) {
    const searchRegex = new RegExp(
      search.trim(),
      "i"
    );

    const matchingOrders =
      await Order.find({
        userId,
        $or: [
          {
            orderNumber: searchRegex,
          },
        ],
      })
        .select("_id")
        .lean();

    const matchingOrderIds =
      matchingOrders.map(
        (order) => order._id
      );

    filter.$or = [
      {
        reference: searchRegex,
      },
      {
        orderId: {
          $in: matchingOrderIds,
        },
      },
    ];
  }

  const [payments, total] =
    await Promise.all([
      Payment.find(filter)
        .populate(
          "orderId",
          "orderNumber total status customerId isArchived"
        )
        .sort({
          paymentDate: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Payment.countDocuments(filter),
    ]);

  /*
   * Attach customer information through
   * the populated order.
   */

  const customerIds = payments
    .map(
      (payment) =>
        payment.orderId?.customerId
    )
    .filter(Boolean);

  const customers =
    await Customer.find({
      _id: {
        $in: customerIds,
      },
      userId,
    })
      .select("name phone")
      .lean();

  const customerMap =
    new Map(
      customers.map((customer) => [
        customer._id.toString(),
        customer,
      ])
    );

  const normalizedPayments =
    payments.map((payment) => {
      const customerId =
        payment.orderId?.customerId
          ?.toString();

      return {
        ...payment,
        customer:
          customerMap.get(customerId) ||
          null,
      };
    });

  const totalPages = Math.ceil(
    total / perPage
  );

  return {
    payments: normalizedPayments,

    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
      hasNextPage:
        currentPage < totalPages,
      hasPreviousPage:
        currentPage > 1,
    },
  };
};

export const getPaymentStats = async (
    userId
) => {
    const result =
        await Payment.aggregate([
            {
                $match: {
                    userId:
                        new mongoose.Types.ObjectId(
                            userId
                        ),
                },
            },
            {
                $group: {
                    _id: null,

                    totalCollected: {
                        $sum: "$amount",
                    },

                    paymentCount: {
                        $sum: 1,
                    },

                    averagePayment: {
                        $avg: "$amount",
                    },
                },
            },
        ]);

    const stats = result[0];

    return {
        totalCollected:
            stats?.totalCollected || 0,

        paymentCount:
            stats?.paymentCount || 0,

        averagePayment:
            stats?.averagePayment || 0,
    };
};


export const deletePayment = async (
    userId,
    paymentId
) => {
    const session =
        await mongoose.startSession();

    try {
        let deletedPayment;
        let paymentSummary;

        await session.withTransaction(
            async () => {
                /*
                 * Find the payment and make sure it
                 * belongs to the authenticated user.
                 */
                const payment =
                    await Payment.findOne({
                        _id: paymentId,
                        userId,
                    }).session(session);

                if (!payment) {
                    const error =
                        new Error(
                            "Payment not found."
                        );

                    error.statusCode = 404;

                    throw error;
                }

                /*
                 * Make sure the associated order still
                 * exists and belongs to the user.
                 */
                const order =
                    await Order.findOne({
                        _id: payment.orderId,
                        userId,
                        isArchived: false,
                    }).session(session);

                if (!order) {
                    const error =
                        new Error(
                            "Order not found."
                        );

                    error.statusCode = 404;

                    throw error;
                }

                /*
                 * Delete the payment.
                 */
                deletedPayment =
                    payment;

                await Payment.deleteOne(
                    {
                        _id: payment._id,
                    },
                    { session }
                );

                /*
                 * Recalculate the payment summary
                 * after deleting the payment.
                 */
                paymentSummary =
                    await calculatePaymentSummary(
                        order,
                        userId,
                        session
                    );

                /*
                 * Keep the order's payment status
                 * synchronized with its payments.
                 */
                order.paymentStatus =
                    paymentSummary.paymentStatus;

                await order.save({
                    session,
                });
            }
        );

        return {
            payment: deletedPayment,
            summary: paymentSummary,
        };
    } finally {
        await session.endSession();
    }
};
