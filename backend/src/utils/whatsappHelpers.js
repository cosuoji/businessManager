import mongoose from "mongoose";
import User from "../modules/users/user.model.js";
import Order from "../modules/orders/order.model.js";
import Customer from "../modules/customers/customer.model.js";

export const formatCurrency = (
  amount,
  currency = "NGN"
) => {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }
  ).format(amount);
};

export const formatDate = (date) => {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(date));
};

export const getOrderContext = async (
  userId,
  orderId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      orderId
    )
  ) {
    const error = new Error(
      "Invalid order ID."
    );

    error.statusCode = 400;

    throw error;
  }
  const userObjectId =
    new mongoose.Types.ObjectId(userId);


  const order =
    await Order.findOne({
      _id: orderId,
      userId: userObjectId,
    }).lean();

  if (!order) {
    const error = new Error(
      "Order not found."
    );

    error.statusCode = 404;

    throw error;
  }

  const [
    customer,
    user,
  ] = await Promise.all([
    Customer.findOne({
      _id: order.customerId,
      userId: userObjectId,
    }).lean(),

    User.findById(userId)
      .select(
        "businessName businessPhone phone currency"
      )
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

  return {
    order,
    customer,
    user,
  };
};
