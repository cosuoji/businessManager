import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    productCost: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      enum: [
        "NGN",
        "USD",
        "GBP",
        "EUR",
      ],
      default: "NGN",
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "partially_paid",
        "paid",
      ],
      default: "unpaid",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    invoicePublicToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

orderSchema.index({
  userId: 1,
  orderNumber: 1,
}, {
  unique: true,
});

orderSchema.index({
  userId: 1,
  customerId: 1,
  createdAt: -1,
});

orderSchema.index({
  userId: 1,
  status: 1,
});

orderSchema.index({
  userId: 1,
  paymentStatus: 1,
});

export default mongoose.model("Order", orderSchema);
