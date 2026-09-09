import api from "./api";

export const initializeProCheckout =
    async () => {
        return api.post(
            "/billing/checkout"
        );
    };

export const verifyProPayment =
    async ({ transactionId, txRef }) => {
        return api.post(
            "/billing/verify",
            { transactionId,txRef }
        );
    };

export const getSubscription =
    async () => {
        return api.get(
            "/billing/subscription"
        );
    };

export const syncSubscription =
    async () => {
        return api.post(
            "/billing/subscription/sync"
        );
    };

export const cancelSubscription =
    async () => {
        return api.post(
            "/billing/subscription/cancel"
        );
    };

export const resumeSubscription =
    async () => {
        return api.post(
            "/billing/subscription/resume"
        );
    };
