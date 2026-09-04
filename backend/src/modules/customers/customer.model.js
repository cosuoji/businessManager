import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
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

customerSchema.index({
  userId: 1,
  name: 1,
});

customerSchema.index({
  userId: 1,
  phone: 1,
});

export default mongoose.model("Customer", customerSchema);
