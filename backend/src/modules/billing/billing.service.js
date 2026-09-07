import User from "../users/user.model.js";

import {
    BILLING,
} from "../../config/plans.js";

const FLUTTERWAVE_API =
    "https://api.flutterwave.com/v3";

const getFlutterwaveHeaders = () => {
    return {
        Authorization:
            `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,

        "Content-Type":
            "application/json",
    };
};

export const createBillingCheckout = async (
    userId
) => {
    const user = await User.findById(
        userId
    );

    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;

        throw error;
  }

    const currentPlan =
        user.subscription?.plan || "free";

    if (currentPlan === "pro") {
        const error = new Error(
            "Your account is already on the Pro plan."
        );

        error.statusCode = 400;
        error.code = "ALREADY_PRO";

        throw error;
    }

    const planId = Number(
        process.env
            .FLUTTERWAVE_PRO_PLAN_ID
    );

    if (!planId) {
        const error = new Error(
            "Flutterwave Pro payment plan is not configured."
        );

        error.statusCode = 500;
        error.code =
            "FLUTTERWAVE_PLAN_NOT_CONFIGURED";

        throw error;
    }

    const txRef =
        `BIZFLOW-PRO-${user._id}-${Date.now()}`;

    const response = await fetch(
        `${FLUTTERWAVE_API}/payments`,
        {
            method: "POST",

            headers:
                getFlutterwaveHeaders(),

            body: JSON.stringify({
                tx_ref: txRef,

                amount:
                    BILLING.pro.amount,

                currency:
                    BILLING.pro.currency,

                redirect_url:
                    process.env
                        .FLUTTERWAVE_REDIRECT_URL,

                payment_plan:
                    planId,

                customer: {
                    email: user.email,
                    name: user.name,
                    phonenumber:
                        user.phone,
                },

                customizations: {
                    title:
                        "BizFlow Pro",

                    description:
                        "Unlimited customers, orders, invoices, receipts and more.",

                    // Add your logo URL later if desired.
                    // logo: "https://yourdomain.com/logo.png",
                },

                meta: {
                    userId:
                        user._id.toString(),

                    plan: "pro",
                },
            }),
        }
    );

    const data =
        await response.json();

    if (
        !response.ok ||
        data.status !== "success" ||
        !data.data?.link
    ) {
        console.error(
            "Flutterwave checkout error:",
            data
        );

        const error = new Error(
            "Unable to initialize Flutterwave checkout."
        );

        error.statusCode = 502;
        error.code =
            "FLUTTERWAVE_CHECKOUT_FAILED";

        throw error;
    }

    return {
      txRef,
      email: user.email,
      checkoutUrl:
        data.data.link,

    };
};

export const verifyProPayment = async (
    userId,
    transactionId,
    txRef
) => {
    const user = await User.findById(
        userId
    );

    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;

        throw error;
    }

    if (
        user.subscription?.plan ===
            "pro" &&
        user.subscription
            ?.flutterwaveSubscriptionId
    ) {
        return {
            transaction: null,
            subscription:
                user.subscription,
            alreadyActive: true,
        };
    }

    if (
        !transactionId ||
        !txRef
    ) {
        const error = new Error(
            "Transaction information is incomplete."
        );

        error.statusCode = 400;
        error.code =
            "INVALID_TRANSACTION_DATA";

        throw error;
    }

    if (
        user.subscription?.flutterwaveLastTransactionId ===
        String(transactionId)
    ) {
        return {
            alreadyProcessed: true,
            subscription: user.subscription,
        };
    }

    const response = await fetch(
        `${FLUTTERWAVE_API}/transactions/${transactionId}/verify`,
        {
            method: "GET",

            headers:
                getFlutterwaveHeaders(),
        }
    );

    const result =
        await response.json();

    if (!response.ok) {
        console.error(
            "Flutterwave verification error:",
            result
        );

        const error = new Error(
            "Unable to verify payment with Flutterwave."
        );

        error.statusCode = 502;
        error.code =
            "FLUTTERWAVE_VERIFICATION_FAILED";

        throw error;
    }

    const transaction =
        result?.data;

    if (!transaction) {
        const error = new Error(
            "Flutterwave returned an invalid transaction response."
        );

        error.statusCode = 502;

        throw error;
    }

    // --------------------------------------------------
    // 1. Verify transaction reference
    // --------------------------------------------------

    if (
        transaction.tx_ref !==
        txRef
    ) {
        const error = new Error(
            "Transaction reference does not match."
        );

        error.statusCode = 400;
        error.code =
            "TRANSACTION_REFERENCE_MISMATCH";

        throw error;
    }

    // --------------------------------------------------
    // 2. Verify payment status
    // --------------------------------------------------

    if (
        transaction.status !==
        "successful"
    ) {
        const error = new Error(
            "Payment was not successful."
        );

        error.statusCode = 400;
        error.code =
            "PAYMENT_NOT_SUCCESSFUL";

        throw error;
    }

    // --------------------------------------------------
    // 3. Verify currency
    // --------------------------------------------------

    if (
        transaction.currency !==
        BILLING.pro.currency
    ) {
        const error = new Error(
            "Payment currency is invalid."
        );

        error.statusCode = 400;
        error.code =
            "INVALID_PAYMENT_CURRENCY";

        throw error;
    }

    // --------------------------------------------------
    // 4. Verify amount
    // --------------------------------------------------

    const expectedAmount =
        Number(
            BILLING.pro.amount
        );

    const paidAmount =
        Number(
            transaction.amount
        );

    if (
        !Number.isFinite(
            paidAmount
        ) ||
        paidAmount <
            expectedAmount
    ) {
        const error = new Error(
            "Payment amount is insufficient."
        );

        error.statusCode = 400;
        error.code =
            "INSUFFICIENT_PAYMENT";

        throw error;
    }



    // --------------------------------------------------
    // 5. Activate Pro
    // --------------------------------------------------

    const now = new Date();

    const currentPeriodEnd =
        new Date(now);

    currentPeriodEnd.setMonth(
        currentPeriodEnd.getMonth() + 1
    );

    user.subscription.plan =
        "pro";

    user.subscription.status =
        "active";

    user.subscription.flutterwavePlanId =
        process.env
            .FLUTTERWAVE_PRO_PLAN_ID;

    user.subscription.flutterwaveCustomerId =
        transaction.customer?.id
            ? String(
                  transaction.customer.id
              )
            : null;

    user.subscription.currentPeriodStart =
        now;

    user.subscription.currentPeriodEnd =
        currentPeriodEnd;

    user.subscription.cancelAtPeriodEnd =
        false;

    user.subscription.cancelledAt =
        null;

    user.subscription.lastPaymentAt =
        now;

    await user.save();

    return {
        transaction,
        subscription:
            user.subscription,
    };
};

export const processFlutterwaveWebhook = async (
    payload
) => {
    console.log(
        "Flutterwave webhook received:",
        payload
    );

    const event =
        payload?.type ||
        payload?.event;

    const data =
        payload?.data;

    if (!event || !data) {
        return;
    }

    switch (event) {
        case "charge.completed":
            await handleChargeCompleted(data);
            break;

        case "subscription.cancelled":
            await handleSubscriptionCancelled(
                data
            );
            break;

        default:
            console.log(
                `Ignoring Flutterwave event: ${event}`
            );
    }
};

const handleChargeCompleted = async (
    webhookData
) => {
    if (
        webhookData?.status !==
        "successful"
    ) {
        return;
    }

    const transactionId =
        webhookData?.id;

    const txRef =
        webhookData?.tx_ref;

    if (!transactionId || !txRef) {
        console.warn(
            "Flutterwave webhook missing transaction ID or tx_ref."
        );

        return;
    }

    console.log(
        `Processing successful Flutterwave transaction ${transactionId}`
    );

    // We'll verify the transaction
    // server-to-server before granting Pro.
};

export const activateOrExtendProSubscription = async (
    user,
    transaction
) => {
    const now = new Date();

    let currentPeriodEnd =
        user.subscription?.currentPeriodEnd
            ? new Date(
                user.subscription.currentPeriodEnd
            )
            : null;

    if (
        !currentPeriodEnd ||
        currentPeriodEnd <= now
    ) {
        currentPeriodEnd = new Date(now);
    }

    currentPeriodEnd.setMonth(
        currentPeriodEnd.getMonth() + 1
    );

    user.subscription.plan = "pro";
    user.subscription.status = "active";
    user.subscription.flutterwavePlanId =
        process.env.FLUTTERWAVE_PRO_PLAN_ID;

    user.subscription.flutterwaveCustomerId =
        transaction.customer?.id
            ? String(transaction.customer.id)
            : user.subscription.flutterwaveCustomerId;

    user.subscription.currentPeriodEnd =
        currentPeriodEnd;

    user.subscription.cancelAtPeriodEnd = false;
    user.subscription.cancelledAt = null;
    user.subscription.lastPaymentAt = now;

    user.subscription.flutterwaveLastTransactionId =
        String(transaction.id);

    user.subscription.flutterwaveLastTxRef =
        transaction.tx_ref;

    await user.save();

    return user.subscription;
};

export const verifyFlutterwaveTransaction =
    async (transactionId) => {
        const response = await fetch(
            `${FLUTTERWAVE_API}/transactions/${transactionId}/verify`,
            {
                method: "GET",
                headers: getFlutterwaveHeaders(),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error(
                "Flutterwave transaction verification failed:",
                result
            );

            const error = new Error(
                "Unable to verify Flutterwave transaction."
            );

            error.statusCode = 502;
            error.code =
                "FLUTTERWAVE_VERIFICATION_FAILED";

            throw error;
        }

        if (
            result?.status !== "success" ||
            !result?.data
        ) {
            const error = new Error(
                "Flutterwave transaction could not be verified."
            );

            error.statusCode = 400;
            error.code =
                "INVALID_FLUTTERWAVE_TRANSACTION";

            throw error;
        }

        return result.data;
  };
