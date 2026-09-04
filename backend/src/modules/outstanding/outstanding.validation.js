import mongoose from "mongoose";

export const validateOutstandingOrdersQuery = (
  req,
  res,
  next
) => {
  const {
    page = 1,
    limit = 20,
    paymentStatus,
  } = req.query;

  const errors = {};

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  // Validate page
  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    errors.page =
      "Page must be a positive integer.";
  }

  // Validate limit
  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    errors.limit =
      "Limit must be an integer between 1 and 100.";
  }

  // Validate payment status
  if (
    paymentStatus &&
    !["paid", "partially_paid", "unpaid"].includes(
      paymentStatus
    )
  ) {
    errors.paymentStatus =
      "Payment status must be paid, partially_paid, or unpaid.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

export const validateCustomerOutstanding = (
  req,
  res,
  next
) => {
  const { customerId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      customerId
    )
  ) {
    return res.status(400).json({
      success: false,
      errors: {
        customerId:
          "Invalid customer ID.",
      },
    });
  }

  const {
    page = 1,
    limit = 20,
  } = req.query;

  const errors = {};

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    errors.page =
      "Page must be a positive integer.";
  }

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    errors.limit =
      "Limit must be an integer between 1 and 100.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
