import User from "../users/user.model.js";

import {
    BILLING,
} from "../../config/plans.js";

import {
    verifyFlutterwaveTransaction,
    activateOrExtendProSubscription,
    markSubscriptionPastDue,
} from "./billing.service.js";


export const handleFlutterwaveWebhook = async (
    req,
    res
) => {
    try {
        /*
         * --------------------------------------------------
         * 1. Verify Flutterwave webhook signature
         * --------------------------------------------------
         */

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

        /*
         * --------------------------------------------------
         * 2. Read webhook event
         * --------------------------------------------------
         */

        const event =
            req.body?.event ||
            req.body?.type;

        const webhookData =
            req.body?.data;



        /*
         * --------------------------------------------------
         * 3. Handle charge.completed
         * --------------------------------------------------
         */

        if (
            event === "charge.completed"
        ) {
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

            /*
             * Always verify the transaction
             * directly with Flutterwave.
             */
            const transaction =
                await verifyFlutterwaveTransaction(
                    transactionId
                );

            /*
             * Verify transaction status.
             */
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

            /*
             * Verify currency.
             */
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

            /*
             * Verify amount.
             */
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

            /*
             * Verify this is a BizFlow Pro transaction.
             */
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

            /*
             * Identify the BizFlow user.
             *
             * Metadata is preferred because it contains
             * our actual BizFlow user ID.
             *
             * tx_ref remains as a compatibility fallback.
             */
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

            /*
             * Idempotency check.
             */
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

            /*
             * Successful payment:
             *
             * - activate Pro
             * - recover past_due subscriptions
             * - extend billing period
             */
            await activateOrExtendProSubscription(
                user,
                transaction
            );

            console.log(
                "BizFlow Pro subscription activated/extended:",
                {
                    userId:
                        user._id.toString(),

                    transactionId:
                        transaction.id,

                    txRef:
                        transaction.tx_ref,
                }
            );

            return res.status(200).json({
                success: true,
            });
        }


        /*
         * --------------------------------------------------
         * 4. Handle charge.failed
         * --------------------------------------------------
         */

        if (
            event === "charge.failed"
        ) {
            if (!webhookData?.id) {
                console.warn(
                    "charge.failed webhook is missing transaction ID."
                );

                return res.status(200).json({
                    success: true,
                });
            }

            const transactionId =
                webhookData.id;

            /*
             * Verify the transaction with Flutterwave.
             */
            const transaction =
                await verifyFlutterwaveTransaction(
                    transactionId
                );

            /*
             * We expect this transaction to be failed.
             *
             * If Flutterwave's verification endpoint
             * returns another state, don't modify the
             * subscription.
             */
            if (
                transaction.status ===
                "successful"
            ) {
                console.warn(
                    "charge.failed webhook returned a successful transaction:",
                    transaction.id
                );

                return res.status(200).json({
                    success: true,
                });
            }

            /*
             * Verify this is a BizFlow transaction.
             */
            const txRef =
                transaction.tx_ref;

            if (
                !txRef ||
                !txRef.startsWith(
                    "BIZFLOW-PRO-"
                )
            ) {
                console.warn(
                    "Ignoring non-BizFlow failed transaction:",
                    txRef
                );

                return res.status(200).json({
                    success: true,
                });
            }

            /*
             * Identify the BizFlow user.
             */
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
                    "BizFlow user not found for failed transaction:",
                    txRef
                );

                return res.status(200).json({
                    success: true,
                });
            }

            /*
             * Ignore failed payments for users who
             * are no longer on Pro.
             */
            if (
                user.subscription?.plan !==
                "pro"
            ) {
                console.log(
                    "Ignoring failed payment for non-Pro user:",
                    user._id.toString()
                );

                return res.status(200).json({
                    success: true,
                });
            }

            /*
             * Idempotency check for failed payments.
             */
            const alreadyProcessed =
                user.subscription
                    ?.flutterwaveLastFailedTransactionId ===
                String(transaction.id);

            if (alreadyProcessed) {
                console.log(
                    "Flutterwave failed transaction already processed:",
                    transaction.id
                );

                return res.status(200).json({
                    success: true,
                    message:
                        "Failed transaction already processed.",
                });
            }

            /*
             * Mark the subscription past due.
             *
             * IMPORTANT:
             *
             * We do NOT downgrade the user here.
             *
             * Flutterwave can retry the recurring charge.
             */
            await markSubscriptionPastDue(
                user,
                transaction
            );

            console.log(
                "BizFlow Pro subscription marked past due:",
                {
                    userId:
                        user._id.toString(),

                    transactionId:
                        transaction.id,

                    txRef:
                        transaction.tx_ref,
                }
            );

            return res.status(200).json({
                success: true,
            });
        }


        /*
         * --------------------------------------------------
         * 5. Handle subscription.cancelled
         * --------------------------------------------------
         */

        if (
            event ===
            "subscription.cancelled"
        ) {
            /*
             * Flutterwave's subscription ID is the
             * important identifier for this event.
             */
            const flutterwaveSubscriptionId =
                webhookData?.id;

            if (
                !flutterwaveSubscriptionId
            ) {
                console.warn(
                    "subscription.cancelled webhook is missing subscription ID."
                );

                return res.status(200).json({
                    success: true,
                });
            }

            /*
             * Find the BizFlow user using the
             * Flutterwave subscription ID we previously
             * synchronized.
             */
            const user =
                await User.findOne({
                    "subscription.flutterwaveSubscriptionId":
                        String(
                            flutterwaveSubscriptionId
                        ),
                });

            if (!user) {
                console.warn(
                    "BizFlow user not found for cancelled Flutterwave subscription:",
                    flutterwaveSubscriptionId
                );

                return res.status(200).json({
                    success: true,
                });
            }

            /*
             * Record the cancellation locally.
             *
             * IMPORTANT:
             *
             * Do NOT immediately change:
             *
             * plan → free
             *
             * The user may still have paid access until
             * currentPeriodEnd.
             *
             * C4.6 will handle the final downgrade.
             */
            user.subscription.cancelAtPeriodEnd =
                true;

            user.subscription.cancelledAt =
                user.subscription.cancelledAt ||
                new Date();

            await user.save();

            console.log(
                "BizFlow Pro subscription cancellation recorded:",
                {
                    userId:
                        user._id.toString(),

                    flutterwaveSubscriptionId:
                        String(
                            flutterwaveSubscriptionId
                        ),

                    currentPeriodEnd:
                        user.subscription
                            .currentPeriodEnd,
                }
            );

            return res.status(200).json({
                success: true,
            });
        }


        /*
         * --------------------------------------------------
         * 6. Ignore other webhook events
         * --------------------------------------------------
         */

        console.log(
            "Webhook received but not processed:",
            event
        );

        return res.status(200).json({
            success: true,
            message:
                "Webhook received but not processed.",
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
