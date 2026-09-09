import "dotenv/config";
import mongoose from "mongoose";

import User from "../modules/users/user.model.js";

import {
    markSubscriptionPastDue,
    activateOrExtendProSubscription,
    expireSubscriptionIfNeeded,
} from "../modules/billing/billing.service.js";

const TEST_USER_ID = process.env.BILLING_TEST_USER_ID;

const run = async () => {
    if (!TEST_USER_ID) {
        throw new Error(
            "Missing BILLING_TEST_USER_ID in environment."
        );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB.");

    const user = await User.findById(TEST_USER_ID);

    if (!user) {
        throw new Error("Test user not found.");
    }

    console.log("\nInitial subscription:");
    console.log(user.subscription);

    // --------------------------------------------------
    // C4.5 — FAILED PAYMENT
    // --------------------------------------------------

    console.log("\n--- C4.5: Mark subscription past_due ---");

    user.subscription.plan = "pro";
    user.subscription.status = "active";

    const futureEnd = new Date();
    futureEnd.setDate(futureEnd.getDate() + 20);

    user.subscription.currentPeriodEnd = futureEnd;

    await user.save();

    const failedTransaction = {
        id: `TEST-FAILED-${Date.now()}`,
        tx_ref: `BIZFLOW-PRO-${user._id}-FAILED-TEST`,
    };

    await markSubscriptionPastDue(
        user,
        failedTransaction
    );

    console.log("After failed payment:");
    console.log({
        plan: user.subscription.plan,
        status: user.subscription.status,
        currentPeriodEnd:
            user.subscription.currentPeriodEnd,
        lastFailedPaymentAt:
            user.subscription.lastFailedPaymentAt,
        flutterwaveLastFailedTransactionId:
            user.subscription.flutterwaveLastFailedTransactionId,
        flutterwaveLastFailedTxRef:
            user.subscription.flutterwaveLastFailedTxRef,
    });

    // --------------------------------------------------
    // C4.5 — SUCCESSFUL RETRY
    // --------------------------------------------------

    console.log("\n--- C4.5: Successful retry ---");

    const successfulTransaction = {
        id: `TEST-SUCCESS-${Date.now()}`,
        tx_ref: `BIZFLOW-PRO-${user._id}-SUCCESS-TEST`,
        customer: {},
    };

    await activateOrExtendProSubscription(
        user,
        successfulTransaction
    );

    console.log("After successful retry:");
    console.log({
        plan: user.subscription.plan,
        status: user.subscription.status,
        currentPeriodStart:
            user.subscription.currentPeriodStart,
        currentPeriodEnd:
            user.subscription.currentPeriodEnd,
        lastPaymentAt:
            user.subscription.lastPaymentAt,
    });

    // --------------------------------------------------
    // C4.6 — EXPIRY
    // --------------------------------------------------

    console.log("\n--- C4.6: Subscription expiry ---");

    user.subscription.plan = "pro";
    user.subscription.status = "active";
    user.subscription.cancelAtPeriodEnd = true;

    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1);

    user.subscription.currentPeriodEnd = expiredDate;

    await user.save();

    await expireSubscriptionIfNeeded(user);

    console.log("After expiry:");
    console.log({
        plan: user.subscription.plan,
        status: user.subscription.status,
        cancelAtPeriodEnd:
            user.subscription.cancelAtPeriodEnd,
        cancelledAt:
            user.subscription.cancelledAt,
        currentPeriodEnd:
            user.subscription.currentPeriodEnd,
    });

    // --------------------------------------------------
    // CLEAN UP
    // --------------------------------------------------

    console.log("\nBilling lifecycle tests completed.");

    await mongoose.disconnect();
};

run().catch(async (error) => {
    console.error("\nBilling lifecycle test failed:");
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
});
