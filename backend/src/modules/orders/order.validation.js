const validStatuses = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "completed",
  "cancelled",
];

const validPaymentStatuses = [
  "unpaid",
  "partially_paid",
  "paid",
];

export const validateOrder = ({
  customerId,
  items,
  discount,
  dueDate,
  status,
  paymentStatus,
  notes,
}) => {
  const errors = {};

  if (!customerId) {
    errors.customerId = "Customer is required.";
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "At least one order item is required.";
  }

  if (Array.isArray(items)) {
    items.forEach((item, index) => {
      if (!item.name?.trim()) {
        errors[`items.${index}.name`] =
          "Item name is required.";
      }

      if (
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      ) {
        errors[`items.${index}.quantity`] =
          "Quantity must be greater than 0.";
      }

      if (
        !Number.isFinite(Number(item.sellingPrice)) ||
        Number(item.sellingPrice) < 0
      ) {
        errors[`items.${index}.sellingPrice`] =
          "Selling price cannot be negative.";
      }

      if (
        !Number.isFinite(Number(item.productCost)) ||
        Number(item.productCost) < 0
      ) {
        errors[`items.${index}.productCost`] =
          "Product cost cannot be negative.";
      }
    });
  }

  if (
    discount !== undefined &&
    (!Number.isFinite(Number(discount)) ||
      Number(discount) < 0)
  ) {
    errors.discount = "Discount cannot be negative.";
  }

  if (
    status !== undefined &&
    !validStatuses.includes(status)
  ) {
    errors.status = "Invalid order status.";
  }

  if (
    paymentStatus !== undefined &&
    !validPaymentStatuses.includes(paymentStatus)
  ) {
    errors.paymentStatus =
      "Invalid payment status.";
  }

  if (notes && notes.length > 1000) {
    errors.notes =
      "Notes cannot exceed 1000 characters.";
  }

  return errors;
};

export const validateOrderUpdate = (data) => {
  const errors = {};

  if (
    data.items !== undefined &&
    (!Array.isArray(data.items) ||
      data.items.length === 0)
  ) {
    errors.items =
      "Order must contain at least one item.";
  }

  if (
    data.status !== undefined &&
    !validStatuses.includes(data.status)
  ) {
    errors.status = "Invalid order status.";
  }

  if (
    data.paymentStatus !== undefined &&
    !validPaymentStatuses.includes(
      data.paymentStatus
    )
  ) {
    errors.paymentStatus =
      "Invalid payment status.";
  }

  if (
    data.discount !== undefined &&
    (!Number.isFinite(Number(data.discount)) ||
      Number(data.discount) < 0)
  ) {
    errors.discount = "Discount cannot be negative.";
  }

  return errors;
};
