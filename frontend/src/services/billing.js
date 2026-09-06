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
