import User from "../users/user.model.js";
import AuditLog from "./audit.model.js";
import mongoose from "mongoose";
import { AUDIT_ACTIONS } from "./audit.actions.js";
import { createAuditLog } from "./audit.service.js";

export const getAdminUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      plan,
      status,
    } = req.query;

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (parsedPage - 1) * parsedLimit;

    const query = {};

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { businessName: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (plan) {
      query["subscription.plan"] = plan;
    }

    if (status) {
      query["subscription.status"] = status;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select(
          "name email phone businessName role accountStatus subscription createdAt updatedAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPreviousPage: parsedPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        businessName: req.user.businessName,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select(
        "name email phone businessName role accountStatus subscription createdAt updatedAt"
      )
      .lean();

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminAuditLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      action,
      adminId,
      targetType,
      targetId,
    } = req.query;

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (parsedPage - 1) * parsedLimit;

    const query = {};

    if (action) {
      query.action = action;
    }

    if (adminId) {
      query.adminId = adminId;
    }

    if (targetType) {
      query.targetType = targetType;
    }

    if (targetId) {
      query.targetId = targetId;
    }

    if (adminId && !mongoose.isValidObjectId(adminId)) {
      const error = new Error("Invalid adminId.");
      error.statusCode = 400;
      error.code = "INVALID_ADMIN_ID";
      throw error;
    }

    if (targetId && !mongoose.isValidObjectId(targetId)) {
      const error = new Error("Invalid targetId.");
      error.statusCode = 400;
      error.code = "INVALID_TARGET_ID";
      throw error;
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("adminId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),

      AuditLog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPreviousPage: parsedPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const suspendAdminUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    const user = await User.findById(id).session(session);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.accountStatus === "suspended") {
      const error = new Error("User account is already suspended.");
      error.statusCode = 400;
      error.code = "ACCOUNT_ALREADY_SUSPENDED";
      throw error;
    }

    if (user.role === "admin") {
      const error = new Error("Admin accounts cannot be suspended.");
      error.statusCode = 400;
      error.code = "ADMIN_ACCOUNT_PROTECTED";
      throw error;
    }

    const previousStatus = user.accountStatus;

    user.accountStatus = "suspended";

    await user.save({ session });

    await createAuditLog({
      adminId: req.user._id,
      action: AUDIT_ACTIONS.USER_SUSPENDED,
      targetType: "User",
      targetId: user._id,
      description: `Suspended user ${user.email}.`,
      metadata: {
        previousStatus,
        newStatus: user.accountStatus,
      },
      req,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "User account suspended successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};

export const restoreAdminUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    const user = await User.findById(id).session(session);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.accountStatus === "active") {
      const error = new Error("User account is already active.");
      error.statusCode = 400;
      error.code = "ACCOUNT_ALREADY_ACTIVE";
      throw error;
    }

    const previousStatus = user.accountStatus;

    user.accountStatus = "active";

    await user.save({ session });

    await createAuditLog({
      adminId: req.user._id,
      action: AUDIT_ACTIONS.USER_RESTORED,
      targetType: "User",
      targetId: user._id,
      description: `Restored user ${user.email}.`,
      metadata: {
        previousStatus,
        newStatus: user.accountStatus,
      },
      req,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "User account restored successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};

export const grantProToUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;
    const days = Number(req.body.days);


    if (!Number.isInteger(days) || days < 1 || days > 3650) {
      const error = new Error(
        "Days must be an integer between 1 and 3650."
      );
      error.statusCode = 400;
      error.code = "INVALID_GRANT_DURATION";
      throw error;
    }

    const user = await User.findById(id).session(session);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.role === "admin") {
      const error = new Error(
        "Admin accounts cannot have their plan changed through user billing controls."
      );
      error.statusCode = 400;
      error.code = "ADMIN_ACCOUNT_PROTECTED";
      throw error;
    }

    const hasFlutterwaveSubscription =
      Boolean(user.subscription.flutterwaveSubscriptionId) &&
      ["active", "trialing", "past_due"].includes(
        user.subscription.status
      );

    if (hasFlutterwaveSubscription) {
      const error = new Error(
        "Cannot grant Pro plan to a user with a Flutterwave subscription."
      );
      error.statusCode = 400;
      error.code = "FLUTTERWAVE_SUBSCRIPTION_PROTECTED";
      throw error;
    }

    const previousPlan = user.subscription.plan;
    const previousStatus = user.subscription.status;
    const previousSource = user.subscription.source;

    const now = new Date();

    const currentEnd = user.subscription.currentPeriodEnd;

    const startDate =
      currentEnd && currentEnd > now
        ? currentEnd
        : now;

    const periodEnd = new Date(startDate);
    periodEnd.setDate(periodEnd.getDate() + days);

    user.subscription.plan = "pro";
    user.subscription.status = "active";
    user.subscription.source = "admin";
    user.subscription.currentPeriodStart = now;
    user.subscription.currentPeriodEnd = periodEnd;
    user.subscription.cancelAtPeriodEnd = false;
    user.subscription.cancelledAt = null;
    user.subscription.flutterwavePlanId = null;
    user.subscription.flutterwaveSubscriptionId = null;
    user.subscription.flutterwaveCustomerId = null;
    user.subscription.flutterwaveLastTransactionId = null;
    user.subscription.flutterwaveLastTxRef = null;

    await user.save({ session });

    await createAuditLog({
      adminId: req.user._id,
      action: AUDIT_ACTIONS.USER_PLAN_GRANTED,
      targetType: "User",
      targetId: user._id,
      description: `Granted Pro plan to ${user.email} for ${days} days.`,
      metadata: {
        previousPlan,
        previousStatus,
        previousSource,
        newPlan: "pro",
        newStatus: "active",
        newSource: "admin",
        durationDays: days,
        currentPeriodEnd: periodEnd,
      },
      req,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: `Pro plan granted for ${days} days.`,
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        source: user.subscription.source,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};

export const revokeProFromUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    const user = await User.findById(id).session(session);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.role === "admin") {
      const error = new Error(
        "Admin accounts cannot have their plan changed through user billing controls."
      );
      error.statusCode = 400;
      error.code = "ADMIN_ACCOUNT_PROTECTED";
      throw error;
    }

    const hasFlutterwaveSubscription =
      Boolean(user.subscription.flutterwaveSubscriptionId) &&
      ["active", "trialing", "past_due"].includes(
        user.subscription.status
      );

    if (hasFlutterwaveSubscription) {
      const error = new Error(
        "This user has an active Flutterwave subscription. Cancel the Flutterwave subscription before revoking Pro."
      );
      error.statusCode = 400;
      error.code = "FLUTTERWAVE_SUBSCRIPTION_ACTIVE";
      throw error;
    }

    const previousPlan = user.subscription.plan;
    const previousStatus = user.subscription.status;
    const previousSource = user.subscription.source;

    user.subscription.plan = "free";
    user.subscription.status = "active";
    user.subscription.source = "admin";
    user.subscription.currentPeriodStart = null;
    user.subscription.currentPeriodEnd = null;
    user.subscription.cancelAtPeriodEnd = false;
    user.subscription.cancelledAt = null;
    user.subscription.flutterwavePlanId = null;
    user.subscription.flutterwaveSubscriptionId = null;
    user.subscription.flutterwaveCustomerId = null;
    user.subscription.flutterwaveLastTransactionId = null;
    user.subscription.flutterwaveLastTxRef = null;


    await user.save({ session });

    await createAuditLog({
      adminId: req.user._id,
      action: AUDIT_ACTIONS.USER_PLAN_REVOKED,
      targetType: "User",
      targetId: user._id,
      description: `Revoked Pro plan from ${user.email}.`,
      metadata: {
        previousPlan,
        previousStatus,
        previousSource,
        newPlan: "free",
        newStatus: "active",
        newSource: "admin",
      },
      req,
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Pro plan revoked successfully.",
      subscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        source: user.subscription.source,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};
