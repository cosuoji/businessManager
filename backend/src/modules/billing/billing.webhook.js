import crypto from "crypto";

export const handleFlutterwaveWebhook = async (
    req,
    res
) => {
    try {
        const signature =
            req.headers["verif-hash"];



        const secretHash =
            process.env.FLUTTERWAVE_WEBHOOK_SECRET;

        if (!signature || signature !== secretHash) {
            console.error(
                "FLUTTERWAVE_WEBHOOK_SECRET is not configured."
            );

            return res.status(500).json({
                success: false,
                message: "Webhook configuration error.",
            });
        }

        if (!signature) {
            console.warn(
                "Flutterwave webhook missing verif-hash."
            );

            return res.status(401).json({
                success: false,
                message: "Missing webhook signature.",
            });
        }

        if (signature !== secretHash) {
            console.warn(
                "Invalid Flutterwave webhook signature."
            );

            return res.status(401).json({
                success: false,
                message: "Invalid webhook signature.",
            });
        }

        console.log(
            "Valid Flutterwave webhook received."
        );

        console.log(
            "Webhook event:",
            req.body?.event ||
                req.body?.type
        );

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Flutterwave webhook error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed.",
        });
    }
};
