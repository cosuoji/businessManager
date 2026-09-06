import {
  createUser,
  createAuthToken,
  authenticateUser,
  requestPasswordReset,
  resetPassword,
  updateUserSettings,
} from "./user.service.js";

import { validateRegistration, validatePasswordReset } from "./user.validation.js";
import User from "./user.model.js";

const isProduction =
  process.env.NODE_ENV === "production";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction
    ? "none"
    : "lax",
  maxAge:
    7 * 24 * 60 * 60 * 1000,
  path: "/",
});


export const register = async (req, res, next) => {
  try {

    const errors = validateRegistration(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const user = await createUser(req.body);
    const token = createAuthToken(user._id.toString());

    res.cookie(
      process.env.COOKIE_NAME,
      token,
      getCookieOptions()
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await authenticateUser(
      email,
      password
    );


    const token = createAuthToken(user._id.toString());

    res.cookie(
      process.env.COOKIE_NAME,
      token,
      getCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie(
    process.env.COOKIE_NAME,
    getCookieOptions()
  );

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      const error = new Error("User account not found.");
      error.statusCode = 401;
      throw error;
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        businessPhone: user.businessPhone,
        businessAddress: user.businessAddress,
        currency: user.currency,
        settings: user.settings,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    await requestPasswordReset(email);

    /*
     * Always return the same response whether
     * the account exists or not.
     */
    return res.status(200).json({
      success: true,
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }

    const errors = validatePasswordReset(password);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    await resetPassword(token, password);

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};


export const updateCurrentUser =
  async (req, res, next) => {
    try {
      const user =
        await updateUserSettings(
          req.user.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Settings updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          businessName:
            user.businessName,
          businessPhone:
            user.businessPhone,
          businessAddress:
            user.businessAddress,
          currency: user.currency,
          settings:
            user.settings,
        },
      });
    } catch (error) {
      next(error);
    }
  };
