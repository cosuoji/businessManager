export const validPaymentMethods = [
  "cash",
  "bank_transfer",
  "pos",
  "card",
  "mobile_money",
  "other",
];

export const validatePayment = ({
  orderId,
  amount,
  paymentMethod,
  paymentDate,
}) => {
  const errors = {};

  if (!orderId) {
    errors.orderId = "Order is required.";
  }

  if (
    amount === undefined ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    errors.amount =
      "Payment amount must be greater than zero.";
  }

  if (
    !paymentMethod ||
    !validPaymentMethods.includes(paymentMethod)
  ) {
    errors.paymentMethod =
      "Invalid payment method.";
  }

  if (paymentDate) {
    const date = new Date(paymentDate);

    if (Number.isNaN(date.getTime())) {
      errors.paymentDate =
        "Invalid payment date.";
    }
  }

  return errors;
};

export const validatePaymentQuery = ({
  method,
  dateFrom,
  dateTo,
}) => {
  const errors = {};

  if (
    method &&
    !validPaymentMethods.includes(method)
  ) {
    errors.method = "Invalid payment method.";
  }

  if (dateFrom) {
    const date = new Date(dateFrom);

    if (Number.isNaN(date.getTime())) {
      errors.dateFrom = "Invalid start date.";
    }
  }

  if (dateTo) {
    const date = new Date(dateTo);

    if (Number.isNaN(date.getTime())) {
      errors.dateTo = "Invalid end date.";
    }
  }

  if (
    dateFrom &&
    dateTo &&
    new Date(dateFrom) > new Date(dateTo)
  ) {
    errors.dateTo =
      "End date cannot be before start date.";
  }

  return errors;
};
