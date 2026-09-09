import User from "../users/user.model.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      const error = new Error("User account not found.");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.role !== "admin") {
      const error = new Error("Admin access required.");
      error.statusCode = 403;
      error.code = "ADMIN_ACCESS_REQUIRED";
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
