import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  archiveOrder,
  restoreOrder,
} from "./order.service.js";

import {
  validateOrder, validateOrderUpdate
} from "./order.validation.js";


export const create = async (
  req,
  res,
  next
) => {
  try {
    const errors = validateOrder(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const order = await createOrder(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      order,
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
    const result = await getOrders({
      userId: req.user.id,
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search || "",
      customerId: req.query.customerId,
      status: req.query.status,
      paymentStatus:
        req.query.paymentStatus,
      archived: req.query.archived === "true",

    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};



export const update = async (
  req,
  res,
  next
) => {
  try {
    const errors =
      validateOrderUpdate(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const order = await updateOrder(
      req.user.id,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const archive = async (
  req,
  res,
  next
) => {
  try {
    await archiveOrder(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req,
  res,
  next
) => {
  try {
    const order = await getOrderById(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};


export const restore = async (
  req,
  res,
  next
) => {
  try {
    const order = await restoreOrder(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
