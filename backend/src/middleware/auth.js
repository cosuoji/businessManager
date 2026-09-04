import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
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
