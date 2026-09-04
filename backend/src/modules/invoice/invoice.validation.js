import mongoose from "mongoose";

export const validateInvoiceOrderId = (
  req,
  res,
  next
) => {
  const { orderId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(
      orderId
    )
  ) {
    return res.status(400).json({
      success: false,
      errors: {
        orderId:
          "Invalid order ID.",
      },
    });
  }

  next();
};
