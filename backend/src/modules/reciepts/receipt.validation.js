import mongoose from "mongoose";

export const validateReceiptPaymentId =
  (req, res, next) => {
    const { paymentId } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        paymentId
      )
    ) {
      return res.status(400).json({
        success: false,
        errors: {
          paymentId:
            "Invalid payment ID.",
        },
      });
    }

    next();
  };
