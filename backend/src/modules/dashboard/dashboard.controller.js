import {
  getDashboardSummary,
  getRecentOrders,
  getRecentPayments,
} from "./dashboard.service.js";

export const getSummary = async (
  req,
  res,
  next
) => {
  try {
    const {
      startDate,
      endDate,
    } = req.query;

    const result =
      await getDashboardSummary(
        req.user.id,
        startDate,
        endDate
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentOrdersController =
  async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 20,
      } = req.query;

      const result =
        await getRecentOrders(
          req.user.id,
          Number(page),
          Number(limit)
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const getRecentPaymentsController =
  async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 20,
      } = req.query;

      const result =
        await getRecentPayments(
          req.user.id,
          Number(page),
          Number(limit)
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
