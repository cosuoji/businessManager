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

    if (
      user.subscription?.plan === "pro" &&
      user.subscription?.source === "admin"
    ) {
      const error = new Error(
        "Your Pro access is currently managed by an administrator."
      );

      error.statusCode = 400;
      error.code = "ADMIN_MANAGED_PRO";

      throw error;
    }

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
      user.subscription?.plan === "pro" &&
      user.subscription?.source === "admin"
    ) {
      const error = new Error(
        "Your Pro access is currently managed by an administrator."
      );

      error.statusCode = 400;
      error.code = "ADMIN_MANAGED_PRO";

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
    await activateOrExtendProSubscription(
        user,
        transaction
    );

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

    let currentPeriodStart =
        user.subscription?.currentPeriodStart
            ? new Date(
                user.subscription.currentPeriodStart
            )
            : null;

    let currentPeriodEnd =
        user.subscription?.currentPeriodEnd
            ? new Date(
                user.subscription.currentPeriodEnd
            )
            : null;

    const hasActivePeriod =
        currentPeriodEnd &&
        currentPeriodEnd > now;

    /*
     * Existing active subscription with a missing
     * period start date.
     *
     * Infer the start from the current period end.
     */
    if (
        hasActivePeriod &&
        !currentPeriodStart
    ) {
        currentPeriodStart =
            new Date(currentPeriodEnd);

        currentPeriodStart.setMonth(
            currentPeriodStart.getMonth() - 1
        );
    }

    /*
     * No active billing period.
     *
     * This covers:
     * - first Pro payment
     * - expired subscription
     * - previously free user
     */
    if (!hasActivePeriod) {
        currentPeriodStart =
            new Date(now);

        currentPeriodEnd =
            new Date(now);

        currentPeriodEnd.setMonth(
            currentPeriodEnd.getMonth() + 1
        );
    } else {
        /*
         * Existing active billing period.
         *
         * A successful recurring payment extends
         * from the existing period end.
         */
        currentPeriodEnd =
            new Date(currentPeriodEnd);

        currentPeriodEnd.setMonth(
            currentPeriodEnd.getMonth() + 1
        );
    }

    user.subscription.plan = "pro";
  user.subscription.status = "active";
   user.subscription.source = "flutterwave";

    user.subscription.currentPeriodStart =
        currentPeriodStart;

    user.subscription.currentPeriodEnd =
        currentPeriodEnd;

    user.subscription.flutterwavePlanId =
        process.env.FLUTTERWAVE_PRO_PLAN_ID;

    if (transaction.customer?.id) {
        user.subscription.flutterwaveCustomerId =
            String(transaction.customer.id);
    }

    user.subscription.cancelAtPeriodEnd =
        false;

    user.subscription.cancelledAt =
        null;

    user.subscription.lastPaymentAt =
        now;

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

export const cancelProSubscription = async (
    userId
) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;

        throw error;
    }

    const subscription =
        user.subscription;

    if (
      user.subscription?.plan === "pro" &&
      user.subscription?.source === "admin"
    ) {
      const error = new Error(
        "Your Pro access is currently managed by an administrator."
      );

      error.statusCode = 400;
      error.code = "ADMIN_MANAGED_PRO";

      throw error;
    }

  if (
        !subscription ||
        subscription.plan !== "pro"
    ) {
        const error = new Error(
            "You do not have an active Pro subscription."
        );

        error.statusCode = 400;
        error.code = "NOT_PRO";

        throw error;
    }

    if (
        subscription.cancelAtPeriodEnd
    ) {
        return {
            subscription,
            alreadyCancelled: true,
        };
    }

    let subscriptionId =
        subscription
            .flutterwaveSubscriptionId;

    // If we don't have the Flutterwave
    // subscription ID yet, synchronize it first.
    if (!subscriptionId) {
        const synced =
            await syncFlutterwaveSubscription(
                userId
            );

        subscriptionId =
            synced
                .subscription
                .flutterwaveSubscriptionId;
    }

    if (!subscriptionId) {
        const error = new Error(
            "Flutterwave subscription could not be identified."
        );

        error.statusCode = 400;
        error.code =
            "FLUTTERWAVE_SUBSCRIPTION_MISSING";

        throw error;
    }

    const response =
        await fetch(
            `${FLUTTERWAVE_API}/subscriptions/${subscriptionId}/cancel`,
            {
                method: "PUT",
                headers:
                    getFlutterwaveHeaders(),
            }
        );

    const result =
        await response.json();

    if (!response.ok) {
        console.error(
            "Flutterwave subscription cancellation error:",
            result
        );

        const error = new Error(
            "Unable to cancel your Pro subscription."
        );

        error.statusCode = 502;
        error.code =
            "FLUTTERWAVE_CANCELLATION_FAILED";

        throw error;
    }

    user.subscription
        .cancelAtPeriodEnd = true;

    user.subscription
        .cancelledAt = new Date();

    await user.save();

    return {
        subscription:
            user.subscription,

        flutterwave:
            result?.data || null,

        alreadyCancelled: false,
    };
};

export const getFlutterwaveSubscriptions = async ({
    transactionId,
    planId,
    status,
    page = 1,
} = {}) => {
    const params = new URLSearchParams();

    if (transactionId) {
        params.set(
            "transaction_id",
            String(transactionId)
        );
    }

    if (planId) {
        params.set(
            "plan",
            String(planId)
        );
    }

    if (status) {
        params.set(
            "status",
            status
        );
    }

    params.set(
        "page",
        String(page)
    );

    const query =
        params.toString();

    const response = await fetch(
        `${FLUTTERWAVE_API}/subscriptions?${query}`,
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
            "Flutterwave subscriptions lookup error:",
            result
        );

        const error = new Error(
            "Unable to retrieve Flutterwave subscription."
        );

        error.statusCode = 502;
        error.code =
            "FLUTTERWAVE_SUBSCRIPTIONS_LOOKUP_FAILED";

        throw error;
    }

    return result;
};

export const syncFlutterwaveSubscription = async (
    userId
) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;

        throw error;
  }

    if (
      user.subscription?.plan === "pro" &&
      user.subscription?.source === "admin"
    ) {
      const error = new Error(
        "Your Pro access is currently managed by an administrator."
      );

      error.statusCode = 400;
      error.code = "ADMIN_MANAGED_PRO";

      throw error;
    }

    if (
        user.subscription?.plan !== "pro"
    ) {
        const error = new Error(
            "Only Pro subscriptions can be synchronized."
        );

        error.statusCode = 400;
        error.code = "NOT_PRO";

        throw error;
    }

    const transactionId =
        user.subscription
            ?.flutterwaveLastTransactionId;

    if (!transactionId) {
        const error = new Error(
            "No Flutterwave transaction is associated with this subscription."
        );

        error.statusCode = 400;
        error.code =
            "FLUTTERWAVE_TRANSACTION_MISSING";

        throw error;
    }

    const result =
        await getFlutterwaveSubscriptions({
            transactionId,
        });

    const subscriptions =
        Array.isArray(result?.data)
            ? result.data
            : [];

    if (!subscriptions.length) {
        const error = new Error(
            "No Flutterwave subscription was found for this transaction."
        );

        error.statusCode = 404;
        error.code =
            "FLUTTERWAVE_SUBSCRIPTION_NOT_FOUND";

        throw error;
    }

    const planId = Number(
        process.env.FLUTTERWAVE_PRO_PLAN_ID
    );

    const matchingSubscription =
        subscriptions.find(
            (subscription) =>
                Number(subscription.plan) ===
                planId
        ) || subscriptions[0];

    user.subscription
        .flutterwaveSubscriptionId =
        String(
            matchingSubscription.id
        );

    user.subscription
        .flutterwavePlanId =
        String(
            matchingSubscription.plan
        );

    await user.save();

    return {
        subscription:
            user.subscription,
        flutterwaveSubscription:
            matchingSubscription,
    };
};

export const getProSubscription = async (
    userId
) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;

        throw error;
    }

    const subscription =
        user.subscription;

    if (
        !subscription ||
        subscription.plan !== "pro"
    ) {
        return {
            plan: "free",
            status: "active",
            flutterwave: null,
        };
    }

    let flutterwaveSubscription =
        null;

    if (
        subscription
            .flutterwaveSubscriptionId
    ) {
        const result =
            await getFlutterwaveSubscriptions({
                planId:
                    process.env
                        .FLUTTERWAVE_PRO_PLAN_ID,
                page: 1,
            });

        const subscriptions =
            Array.isArray(result?.data)
                ? result.data
                : [];

        flutterwaveSubscription =
            subscriptions.find(
                (item) =>
                    String(item.id) ===
                    String(
                        subscription
                            .flutterwaveSubscriptionId
                    )
            ) || null;
    }

    return {
        plan:
            subscription.plan,

        status:
            subscription.status,

        currentPeriodStart:
            subscription.currentPeriodStart,

        currentPeriodEnd:
            subscription.currentPeriodEnd,

        cancelAtPeriodEnd:
            Boolean(
                subscription.cancelAtPeriodEnd
            ),

        cancelledAt:
            subscription.cancelledAt,

        lastPaymentAt:
            subscription.lastPaymentAt,

        flutterwaveSubscriptionId:
            subscription
                .flutterwaveSubscriptionId,

        flutterwavePlanId:
            subscription
                .flutterwavePlanId,

        flutterwave:
            flutterwaveSubscription,
    };
};

export const markSubscriptionPastDue = async (
    user,
    transaction
) => {
    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;
        error.code = "USER_NOT_FOUND";

        throw error;
    }

    /*
     * Only Pro subscriptions can become past due.
     */
    if (
        user.subscription?.plan !==
        "pro"
    ) {
        return user.subscription;
    }

    const now = new Date();

    user.subscription.status =
        "past_due";

    /*
     * Keep the existing paid period intact.
     *
     * We do NOT change:
     * - currentPeriodStart
     * - currentPeriodEnd
     * - plan
     */
    user.subscription.lastFailedPaymentAt =
        now;

    user.subscription
        .flutterwaveLastFailedTransactionId =
        String(transaction.id);

    user.subscription
        .flutterwaveLastFailedTxRef =
        transaction.tx_ref || null;

    await user.save();

    return user.subscription;
};

export const expireSubscriptionIfNeeded = async (user) => {
    if (!user) {
        const error = new Error(
            "User account not found."
        );

        error.statusCode = 404;
        error.code = "USER_NOT_FOUND";

        throw error;
    }

    const subscription = user.subscription;

    if (subscription?.plan !== "pro") {
        return {
            expired: false,
            subscription,
        };
    }

    if (!subscription.currentPeriodEnd) {
        return {
            expired: false,
            subscription,
        };
    }

    const now = new Date();

    const currentPeriodEnd = new Date(
        subscription.currentPeriodEnd
    );

    if (currentPeriodEnd > now) {
        return {
            expired: false,
            subscription,
        };
    }

    subscription.plan = "free";
    subscription.status = "expired";
    subscription.cancelAtPeriodEnd = false;

    if (!subscription.cancelledAt) {
        subscription.cancelledAt = now;
    }

    await user.save();

    return {
        expired: true,
        subscription: user.subscription,
    };
};

export const resumeProSubscription = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User account not found.");
        error.statusCode = 404;
        error.code = "USER_NOT_FOUND";
        throw error;
    }

  const subscription = user.subscription;

  if (
    user.subscription?.plan === "pro" &&
    user.subscription?.source === "admin"
  ) {
    const error = new Error(
      "Your Pro access is currently managed by an administrator."
    );

    error.statusCode = 400;
    error.code = "ADMIN_MANAGED_PRO";

    throw error;
  }

    if (subscription?.plan !== "pro") {
        const error = new Error(
            "Only Pro subscriptions can be resumed."
        );
        error.statusCode = 400;
        error.code = "NOT_PRO";
        throw error;
    }

    if (!subscription?.cancelAtPeriodEnd) {
        const error = new Error(
            "This subscription is not scheduled for cancellation."
        );
        error.statusCode = 400;
        error.code = "SUBSCRIPTION_NOT_CANCELLED";
        throw error;
    }

    if (!subscription?.flutterwaveSubscriptionId) {
        const error = new Error(
            "Flutterwave subscription ID is missing."
        );
        error.statusCode = 400;
        error.code = "FLUTTERWAVE_SUBSCRIPTION_ID_MISSING";
        throw error;
    }

    const response = await fetch(
        `${FLUTTERWAVE_API}/subscriptions/${subscription.flutterwaveSubscriptionId}/activate`,
        {
            method: "PUT",
            headers: getFlutterwaveHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok || data?.status !== "success") {
        console.error(
            "Flutterwave subscription resume failed:",
            data
        );

        const error = new Error(
            data?.message ||
            "Unable to resume Flutterwave subscription."
        );

        error.statusCode = 400;
        error.code = "FLUTTERWAVE_RESUME_FAILED";

        throw error;
    }

    // Resume local subscription state.
    user.subscription.status = "active";
    user.subscription.cancelAtPeriodEnd = false;
    user.subscription.cancelledAt = null;

    await user.save();

    return user.subscription;
};
