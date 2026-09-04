import {
  getOutstandingOrders,
  getTotalOutstanding,
  getCustomerOutstanding,
  getOrdersByPaymentStatus,
  getDueSoonOrders,
  getOverdueOrders,
  getOutstandingCustomers,
} from "./outstanding.service.js";

export const getSummary = async (req, res, next) => {
  try {
    const result = await getTotalOutstanding(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      paymentStatus,
    } = req.query;


    let orders;

    if (paymentStatus) {
      orders = await getOrdersByPaymentStatus(
        req.user.id,
        paymentStatus,
        {
          page: Number(page),
          limit: Number(limit),
        }
      );
    } else {
      orders = await getOutstandingOrders(
        req.user.id,
        {
          page: Number(page),
          limit: Number(limit),
        }
      );
    }



    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getDueSoon = async (
    req,
    res,
    next
) => {
    try {
        const {
            page = 1,
            limit = 20,
        } = req.query;

        const result =
            await getDueSoonOrders(
                req.user.id,
                {
                    page: Number(page),
                    limit: Number(limit),
                }
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getOverdue = async (
    req,
    res,
    next
) => {
    try {
        const {
            page = 1,
            limit = 20,
        } = req.query;

        const result =
            await getOverdueOrders(
                req.user.id,
                {
                    page: Number(page),
                    limit: Number(limit),
                }
            );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomerOutstandingBalance =
    async (req, res, next) => {
        try {
            const {
                customerId,
            } = req.params;

            const {
                page = 1,
                limit = 20,
            } = req.query;

            const result =
                await getCustomerOutstanding(
                    req.user.id,
                    customerId,
                    {
                        page: Number(page),
                        limit: Number(limit),
                    }
                );

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

export const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const result = await getOutstandingCustomers(req.user.id, {
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
