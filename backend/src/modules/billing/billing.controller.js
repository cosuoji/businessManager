import {
    createBillingCheckout,
    verifyProPayment,
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
