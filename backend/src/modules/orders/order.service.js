import OrderCounter from "./orderCounter.model.js";
import Order from "./order.model.js";
import Customer from "../customers/customer.model.js";
import { getMonthlyOrderCount } from "../../services/plan-usage.service.js";
import { getPlanLimits, checkLimit } from "../../utils/plan.js";
import User from "../users/user.model.js";


export const generateOrderNumber = async (userId) => {
  const counter = await OrderCounter.findOneAndUpdate(
    {
      userId,
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  const year = new Date().getFullYear();

  const sequence = counter.sequence
    .toString()
    .padStart(6, "0");

  return `ORD-${year}-${sequence}`;
};

export const calculateOrder = ({
  items,
  discount = 0,
}) => {
  const calculatedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const sellingPrice = Number(item.sellingPrice);
    const productCost = Number(item.productCost);

    const total = quantity * sellingPrice;

    return {
      name: item.name.trim(),
      quantity,
      sellingPrice,
      productCost,
      total,
    };
  });

  const subtotal = calculatedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const normalizedDiscount = Math.min(
    Math.max(Number(discount) || 0, 0),
    subtotal
  );

  const total = subtotal - normalizedDiscount;

  return {
    items: calculatedItems,
    subtotal,
    discount: normalizedDiscount,
    total,
  };
};

export const createOrder = async (
  userId,
  data
) => {
  const customer = await Customer.findOne({
    _id: data.customerId,
    userId,
    isArchived: false,
  });

  if (!customer) {
    const error = new Error(
      "Customer not found."
    );

    error.statusCode = 404;

    throw error;
  }

  // Check monthly order limit
  const userObject = await User.findById(userId);

  const { ordersPerMonth } =
    getPlanLimits(userObject);

  const monthlyOrderCount =
    await getMonthlyOrderCount(userId);

  if (
    !checkLimit(
      monthlyOrderCount,
      ordersPerMonth
    )
  ) {
    const error = new Error(
      "You've reached the 10-order monthly limit on the Free plan. Upgrade to Pro to create unlimited orders."
    );

    error.statusCode = 403;
    error.code = "ORDER_LIMIT_REACHED";

    throw error;
  }

  // Only generate an order number after
  // confirming the user can create the order
  const orderNumber =
    await generateOrderNumber(userId);

  const calculated = calculateOrder({
    items: data.items,
    discount: data.discount,
  });

  const order = await Order.create({
    userId,
    customerId: customer._id,
    orderNumber,

    items: calculated.items,

    subtotal: calculated.subtotal,
    discount: calculated.discount,
    total: calculated.total,

    dueDate: data.dueDate,
    status: data.status || "pending",
    paymentStatus:
      data.paymentStatus || "unpaid",

    notes: data.notes?.trim(),
  });

  return order;
};

export const getOrders = async ({
  userId,
  page = 1,
  limit = 20,
  search = "",
  customerId,
  status,
  paymentStatus,
  archived = false,
}) => {
  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const perPage = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const skip = (currentPage - 1) * perPage;

  const filter = {
    userId,
    isArchived: archived,
  };

  if (search.trim()) {
    filter.orderNumber = new RegExp(
      search.trim(),
      "i"
    );
  }

  if (customerId) {
    filter.customerId = customerId;
  }

  if (status) {
    filter.status = status;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate(
        "customerId",
        "name phone email"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(
        total / perPage
      ),
      hasNextPage:
        currentPage <
        Math.ceil(total / perPage),
      hasPreviousPage:
        currentPage > 1,
    },
  };
};

export const getOrderById = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    userId,
    isArchived: false,
  })
    .populate(
      "customerId",
      "name phone email address"
    )
    .lean();

  if (!order) {
    const error = new Error(
      "Order not found or is Archived. If this order is archived, it cannot be viewed or updated."
    );

    error.statusCode = 404;

    throw error;
  }

  return order;
};

export const updateOrder = async (
  userId,
  orderId,
  data
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

  if (
    data.customerId !== undefined
  ) {
    const customer =
      await Customer.findOne({
        _id: data.customerId,
        userId,
        isArchived: false,
      });

    if (!customer) {
      const error = new Error(
        "Customer not found."
      );

      error.statusCode = 404;

      throw error;
    }

    order.customerId = customer._id;
  }

  if (
    data.items !== undefined ||
    data.discount !== undefined
  ) {
    const calculated =
      calculateOrder({
        items:
          data.items ?? order.items,
        discount:
          data.discount ?? order.discount,
      });

    order.items = calculated.items;
    order.subtotal =
      calculated.subtotal;
    order.discount =
      calculated.discount;
    order.total =
      calculated.total;
  }

  if (data.dueDate !== undefined) {
    order.dueDate = data.dueDate;
  }

  if (data.status !== undefined) {
    order.status = data.status;
  }

  if (
    data.paymentStatus !== undefined
  ) {
    order.paymentStatus =
      data.paymentStatus;
  }

  if (data.notes !== undefined) {
    order.notes = data.notes.trim();
  }

  await order.save();

  return order;
};

export const archiveOrder = async (
  userId,
  orderId
) => {
  const order =
    await Order.findOneAndUpdate(
      {
        _id: orderId,
        userId,
        isArchived: false,
      },
      {
        $set: {
          isArchived: true,
        },
      },
      {
        new: true,
      }
    );

  if (!order) {
    const error = new Error(
      "Order not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return order;
};


export const restoreOrder = async (
  userId,
  orderId
) => {
  const order =
    await Order.findOneAndUpdate(
      {
        _id: orderId,
        userId,
        isArchived: true,
      },
      {
        $set: {
          isArchived: false,
        },
      },
      {
        new: true,
      }
    );

  if (!order) {
    const error = new Error(
      "Archived order not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return order;
};
