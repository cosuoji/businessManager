import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import { generateSecureToken, hashToken } from "../../utils/token.js";
import { sendPasswordResetEmail } from "../../services/email.service.js";


export const createUser = async ({
  name,
  email,
  phone,
  businessName,
  businessPhone,
  businessAddress,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    businessName: businessName.trim(),
    businessPhone: businessPhone?.trim(),
    businessAddress: businessAddress?.trim(),
    password: passwordHash,
  });

  return user;
};

export const authenticateUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const createAuthToken = (user) => {

  return jwt.sign(
    {
      userId: user,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

export const requestPasswordReset = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  /*
   * We intentionally don't throw if the email
   * doesn't exist.
   *
   * This prevents account enumeration.
   */
  if (!user) {
    return;
  }

  const resetToken = generateSecureToken();
  const resetTokenHash = hashToken(resetToken);

  const resetPasswordExpires =
    new Date(Date.now() + 60 * 60 * 1000);

  await User.findByIdAndUpdate(user._id, {
    resetPasswordTokenHash: resetTokenHash,
    resetPasswordExpires,
  });

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    resetToken,
  });
};

export const resetPassword = async (
  token,
  newPassword
) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: {
      $gt: new Date(),
    },
  }).select(
    "+password +resetPasswordTokenHash +resetPasswordExpires"
  );

  if (!user) {
    const error = new Error(
      "Invalid or expired password reset link."
    );

    error.statusCode = 400;

    throw error;
  }

  const passwordHash = await bcrypt.hash(
    newPassword,
    12
  );

  user.password = passwordHash;
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpires = undefined;
  user.tokenVersion += 1;

  await user.save();
};


export const updateUserSettings = async (
  userId,
  data
) => {
  const allowedUpdates = {};

  if (data.name !== undefined) {
    allowedUpdates.name =
      data.name.trim();
  }

  if (data.phone !== undefined) {
    allowedUpdates.phone =
      data.phone.trim();
  }

  if (data.businessName !== undefined) {
    allowedUpdates.businessName =
      data.businessName.trim();
  }

  if (data.businessPhone !== undefined) {
    allowedUpdates.businessPhone =
      data.businessPhone.trim();
  }

  if (data.businessAddress !== undefined) {
    allowedUpdates.businessAddress =
      data.businessAddress.trim();
  }

  if (data.currency !== undefined) {
    allowedUpdates.currency =
      data.currency;
  }

  if (data.settings !== undefined) {
    if (
      data.settings.invoiceNotes !==
      undefined
    ) {
      allowedUpdates[
        "settings.invoiceNotes"
      ] =
        data.settings.invoiceNotes
          .trim();
    }

    if (
      data.settings.receiptNotes !==
      undefined
    ) {
      allowedUpdates[
        "settings.receiptNotes"
      ] =
        data.settings.receiptNotes
          .trim();
    }

    if (
      data.settings
        .paymentReminderEnabled !==
      undefined
    ) {
      allowedUpdates[
        "settings.paymentReminderEnabled"
      ] =
        Boolean(
          data.settings
            .paymentReminderEnabled
        );
    }
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: allowedUpdates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!user) {
    const error = new Error(
      "User account not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return user;
};
