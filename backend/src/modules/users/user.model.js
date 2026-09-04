import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    businessPhone: {
      type: String,
      trim: true,
    },
    businessAddress: {
      type: String,
      trim: true,
      maxlength: 300,
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
    settings: {
      invoiceNotes: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
      },

      receiptNotes: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
      },

      paymentReminderEnabled: {
        type: Boolean,
        default: true,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetPasswordTokenHash: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
