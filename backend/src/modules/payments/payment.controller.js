import {
  recordPayment,
  getPaymentHistory,
  getOrderPaymentSummary,
  updateOrderPaymentStatus,
  getPayments,
  getPaymentStats,
  deletePayment,
} from "./payment.service.js";

import {
  validatePayment,
  validatePaymentQuery,
} from "./payment.validation.js";

export const create = async (
  req,
  res,
  next
) => {
  try {
    const errors =
      validatePayment(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const result =
      await recordPayment(
        req.user.id,
        req.body
      );

    return res.status(201).json({
      success: true,
      payment: result.payment,
      summary: result.summary,
    });
  } catch (error) {
    next(error);
  }
};

export const history = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await getPaymentHistory(
        req.user.id,
        req.params.orderId
      );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (
  req,
  res,
  next
) => {
  try {
    const errors =
      validatePaymentQuery({
        method:
          req.query.paymentMethod,
        dateFrom:
          req.query.dateFrom,
        dateTo:
          req.query.dateTo,
      });

    if (
      Object.keys(errors).length > 0
    ) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const result =
      await getPayments({
        userId: req.user.id,
        page: req.query.page,
        limit: req.query.limit,
        search:
          req.query.search || "",
        paymentMethod:
          req.query.paymentMethod,
        dateFrom:
          req.query.dateFrom,
        dateTo:
          req.query.dateTo,
      });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const stats = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await getPaymentStats(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      stats: result,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await deletePayment(
                req.user.id,
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Payment deleted successfully.",
            payment:
                result.payment,
            summary:
                result.summary,
        });
    } catch (error) {
        next(error);
    }
};
