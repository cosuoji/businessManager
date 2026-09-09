import {
    createBillingCheckout,
    verifyProPayment,
    getProSubscription,
    cancelProSubscription,
    syncFlutterwaveSubscription,
    resumeProSubscription,
} from "./billing.service.js";

export const initializeProCheckout = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await createBillingCheckout(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            checkoutUrl:
                result.checkoutUrl,
            txRef:
                result.txRef,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyPayment = async (
    req,
    res,
    next
) => {
    try {
        const {
            transactionId,
            txRef,
        } = req.body;

        const result =
            await verifyProPayment(
                req.user.id,
                transactionId,
                txRef
            );

        return res.status(200).json({
                  success: true,
                  message:
                      "Payment verified successfully. Your Pro subscription is now active.",
                  subscription:
                      result.subscription,
              });
    } catch (error) {
        next(error);
    }
};

export const getSubscription = async (
    req,
    res,
    next
) => {
    try {
        const subscription =
            await getProSubscription(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const syncSubscription = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await syncFlutterwaveSubscription(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Flutterwave subscription synchronized successfully.",
            subscription:
                result.subscription,
            flutterwaveSubscription:
                result.flutterwaveSubscription,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await cancelProSubscription(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message: result.alreadyCancelled
                ? "Your Pro subscription is already scheduled for cancellation."
                : "Your Pro subscription has been cancelled. You will keep Pro access until the end of your current billing period.",
            subscription:
                result.subscription,
            flutterwave:
                result.flutterwave,
        });
    } catch (error) {
        next(error);
    }
};
export const resumeSubscription = async (req, res, next) => {
    try {
        const subscription = await resumeProSubscription(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Subscription resumed successfully.",
            subscription,
        });
    } catch (error) {
        next(error);
    }
};
