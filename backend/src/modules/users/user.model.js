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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
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
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
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
    subscription: {
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
        },

        status: {
            type: String,
            enum: [
                "active",
                "trialing",
                "past_due",
                "cancelled",
                "expired",
            ],
            default: "active",
      },
      source: {
        type: String,
        enum: ["flutterwave", "admin"],
        default: "flutterwave",
      },

        flutterwavePlanId: {
            type: String,
            default: null,
        },

        flutterwaveSubscriptionId: {
            type: String,
            default: null,
        },

        flutterwaveCustomerId: {
            type: String,
            default: null,
        },

        flutterwaveLastTransactionId: {
            type: String,
            default: null,
        },

        flutterwaveLastTxRef: {
            type: String,
            default: null,
        },

        currentPeriodStart: {
            type: Date,
            default: null,
        },
        flutterwaveLastFailedTransactionId: {
            type: String,
            default: null,
        },

        flutterwaveLastFailedTxRef: {
            type: String,
            default: null,
        },

        lastFailedPaymentAt: {
            type: Date,
            default: null,
        },
        currentPeriodEnd: {
            type: Date,
            default: null,
        },

        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        lastPaymentAt: {
            type: Date,
            default: null,
        },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
