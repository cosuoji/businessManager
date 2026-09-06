import crypto from "crypto";

export const handleFlutterwaveWebhook = async (
    req,
    res
) => {
    try {
        const signature =
            req.headers["flutterwave-signature"];
        console.log("Flutterwave signature:", signature);
        console.log("Webhook headers:", req.headers);
        console.log("Raw body exists:", Boolean(req.rawBody));

      if (!signature) {
            return res.status(401).json({
                success: false,
                message: "Missing webhook signature.",
            });
        }

        const secretHash =
            process.env.FLUTTERWAVE_WEBHOOK_SECRET;

        if (!secretHash) {
            console.error(
                "FLUTTERWAVE_WEBHOOK_SECRET is not configured."
            );

            return res.status(500).json({
                success: false,
                message: "Webhook configuration error.",
            });
        }

        if (!req.rawBody) {
            console.error(
                "Flutterwave webhook raw body is missing."
            );

            return res.status(400).json({
                success: false,
                message: "Invalid webhook body.",
            });
        }

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    secretHash
                )
                .update(req.rawBody)
                .digest("base64");

        const receivedBuffer =
            Buffer.from(signature);

        const expectedBuffer =
            Buffer.from(
                expectedSignature
            );

        const signaturesMatch =
            receivedBuffer.length ===
                expectedBuffer.length &&
            crypto.timingSafeEqual(
                receivedBuffer,
                expectedBuffer
            );

        if (!signaturesMatch) {
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
