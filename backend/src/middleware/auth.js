import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";


export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME];

    if (!token) {
      const error = new Error("Authentication required.");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.userId,
    };

    const user = await User.findById(decoded.userId);

    if (user && user.accountStatus === "suspended") {
      const error = new Error("Your account has been suspended.");
      error.statusCode = 403;
      error.code = "ACCOUNT_SUSPENDED";
      throw error;

    }
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = "Invalid authentication token.";
    }

    if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = "Authentication token has expired.";
    }

    next(error);
  }
};
