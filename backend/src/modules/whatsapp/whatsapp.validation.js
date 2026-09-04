import mongoose from "mongoose";

const validateObjectId =
  (
    paramName
  ) => {
    return (req, res, next) => {
      const id =
        req.params[paramName];

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${paramName}.`,
        });
      }

      next();
    };
  };

export const validateOrderId =
  validateObjectId("orderId");

export const validatePaymentId =
  validateObjectId("paymentId");

export const validateCustomerId =
  validateObjectId("customerId");
