import api from "./api";

export const recordPayment =
    async (paymentData) => {
        return api.post(
            "/payments",
            paymentData
        );
    };

export const getOrderPayments =
    async (orderId) => {
        return api.get(
            `/payments/order/${orderId}`
        );
    };

export const getPayments =
    async (params = {}) => {
        const searchParams =
            new URLSearchParams();

        if (params.page) {
            searchParams.set(
                "page",
                params.page
            );
        }

        if (params.limit) {
            searchParams.set(
                "limit",
                params.limit
            );
        }

        if (params.search) {
            searchParams.set(
                "search",
                params.search
            );
        }

        if (params.paymentMethod) {
            searchParams.set(
                "paymentMethod",
                params.paymentMethod
            );
        }

        if (params.dateFrom) {
            searchParams.set(
                "dateFrom",
                params.dateFrom
            );
        }

        if (params.dateTo) {
            searchParams.set(
                "dateTo",
                params.dateTo
            );
        }

        const query =
            searchParams.toString();

        return api.get(
            `/payments${
                query
                    ? `?${query}`
                    : ""
            }`
        );
    };

export const getPaymentStats = async (
    params = {}
) => {
    const searchParams =
        new URLSearchParams();

    if (params.search) {
        searchParams.set(
            "search",
            params.search
        );
    }

    if (params.paymentMethod) {
        searchParams.set(
            "paymentMethod",
            params.paymentMethod
        );
    }

    if (params.dateFrom) {
        searchParams.set(
            "dateFrom",
            params.dateFrom
        );
    }

    if (params.dateTo) {
        searchParams.set(
            "dateTo",
            params.dateTo
        );
    }

    const query =
        searchParams.toString();

    return api.get(
        `/payments/stats${
            query
                ? `?${query}`
                : ""
        }`
    );
};


export const deletePayment =
    async (paymentId) => {
        return api.delete(
            `/payments/${paymentId}`
        );
    };
