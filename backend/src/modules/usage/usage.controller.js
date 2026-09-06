import {
  getUsage,
} from "../../services/plan-usage.service.js";


import User from "../users/user.model.js";

export const getCurrentUsage =
  async (req, res, next) => {
    try {
      const usage =
        await getUsage(
          req.user.id
        );

      const user =
        await User.findById(
          req.user.id
        )
          .select(
            "subscription"
          )
          .lean();

      const plan =
        user?.subscription?.plan ||
        "free";

      return res.status(200).json({
        success: true,

        usage,

        plan: {
          id: plan,

          name:
            plan === "pro"
              ? "Pro"
              : "Free",
        },
      });
    } catch (error) {
      next(error);
    }
  };
