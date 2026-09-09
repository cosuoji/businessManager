import User from "../users/user.model.js";

import {
    expireSubscriptionIfNeeded,
} from "./billing.service.js";

export const refreshSubscriptionEntitlement = async (
    req,
    res,
    next
) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            const error = new Error(
                "User account not found."
            );

            error.statusCode = 404;
            error.code = "USER_NOT_FOUND";

            throw error;
        }

        await expireSubscriptionIfNeeded(user);

        // Attach the current user to the request.
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
