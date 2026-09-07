import User from "../users/user.model.js";

import {
    BILLING,
} from "../../config/plans.js";

import {
    verifyFlutterwaveTransaction,
    activateOrExtendProSubscription,
} from "./billing.service.js";

export const handleFlutterwaveWebhook = async (
    req,
    res
) => {
    try {
        const signature =
            req.headers["verif-hash"];

        const secretHash =
            process.env.FLUTTERWAVE_WEBHOOK_SECRET;

        if (
            !signature ||
            signature !== secretHash
        ) {
            console.warn(
                "Invalid Flutterwave webhook signature."
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid webhook signature.",
            });
      }

        console.log(
            "FULL FLUTTERWAVE WEBHOOK PAYLOAD:",
            JSON.stringify(req.body, null, 2)
        );

        const event =
            req.body?.event ||
            req.body?.type;

        const webhookData =
            req.body?.data;

        console.log(
            "Valid Flutterwave webhook received."
        );

        console.log(
            "Webhook event:",
            event
        );

        // We only process completed charges here.
        if (event !== "charge.completed") {
            return res.status(200).json({
                success: true,
                message:
                    "Webhook received but not processed.",
            });
        }

        if (!webhookData?.id) {
            console.warn(
                "charge.completed webhook is missing transaction ID."
            );

            return res.status(200).json({
                success: true,
            });
        }

        const transactionId =
            webhookData.id;

        const transaction =
            await verifyFlutterwaveTransaction(
                transactionId
            );

        // Verify the transaction status.
        if (
            transaction.status !==
            "successful"
        ) {
            console.warn(
                "Flutterwave transaction is not successful:",
                transaction.status
            );

            return res.status(200).json({
                success: true,
            });
        }

        // Verify currency.
        if (
            transaction.currency !==
            BILLING.pro.currency
        ) {
            console.warn(
                "Invalid Flutterwave transaction currency:",
                transaction.currency
            );

            return res.status(200).json({
                success: true,
            });
        }

        // Verify amount.
        const paidAmount =
            Number(transaction.amount);

        const expectedAmount =
            Number(BILLING.pro.amount);

        if (
            !Number.isFinite(paidAmount) ||
            paidAmount < expectedAmount
        ) {
            console.warn(
                "Insufficient Flutterwave payment amount:",
                paidAmount
            );

            return res.status(200).json({
                success: true,
            });
        }

        // Verify this is a BizFlow Pro transaction.
        const txRef =
            transaction.tx_ref;

        if (
            !txRef ||
            !txRef.startsWith(
                "BIZFLOW-PRO-"
            )
        ) {
            console.warn(
                "Ignoring non-BizFlow transaction:",
                txRef
            );

            return res.status(200).json({
                success: true,
            });
        }

        // Identify the BizFlow user.
        //
        // Prefer the userId stored in Flutterwave metadata.
        // Fall back to the tx_ref for compatibility with
        // transactions created before metadata was relied upon.
        const userId =
            transaction.meta?.userId ||
            txRef
                .replace(
                    "BIZFLOW-PRO-",
                    ""
                )
                .split("-")[0];

        const user =
            await User.findById(userId);

        if (!user) {
            console.warn(
                "BizFlow user not found for transaction:",
                txRef
            );

            return res.status(200).json({
                success: true,
            });
        }

        // Idempotency check.
        const alreadyProcessed =
            user.subscription
                ?.flutterwaveLastTransactionId ===
            String(transaction.id);

        if (alreadyProcessed) {
            console.log(
                "Flutterwave transaction already processed:",
                transaction.id
            );

            return res.status(200).json({
                success: true,
                message:
                    "Transaction already processed.",
            });
        }

        await activateOrExtendProSubscription(
            user,
            transaction
        );

        console.log(
            "BizFlow Pro subscription activated/extended:",
            {
                userId: user._id.toString(),
                transactionId:
                    transaction.id,
                txRef:
                    transaction.tx_ref,
            }
        );

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Flutterwave webhook processing error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Webhook processing failed.",
        });
    }
};
