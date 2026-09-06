import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "bank_transfer",
        "pos",
        "mobile_money",
        "card",
        "other",
      ],
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    reference: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    receiptCreatedAt: {
      type: Date,
    }

  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  userId: 1,
  orderId: 1,
  paymentDate: -1,
});

export default mongoose.model(
  "Payment",
  paymentSchema
);
