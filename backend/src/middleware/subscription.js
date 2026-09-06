import { isPro } from "../utils/plan.js";
import User from "../modules/users/user.model.js";

export const requirePro = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found.",
      });
    }


    if (!isPro(user)) {
      return res.status(403).json({
        success: false,
        code: "PRO_REQUIRED",
        message: "This feature requires a Pro plan.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
