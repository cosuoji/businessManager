import api from "./api";

export const getOrders = async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.page) {
        searchParams.set("page", params.page);
    }

    if (params.limit) {
        searchParams.set("limit", params.limit);
    }

    if (params.search) {
        searchParams.set("search", params.search);
    }

    if (params.customerId) {
        searchParams.set(
            "customerId",
            params.customerId
        );
    }

    if (params.status) {
        searchParams.set(
            "status",
            params.status
        );
    }

    if (params.paymentStatus) {
        searchParams.set(
            "paymentStatus",
            params.paymentStatus
        );
    }

    if (params.archived !== undefined) {
        searchParams.set(
            "archived",
            params.archived
        );
    }

    const query = searchParams.toString();

    return api.get(
        `/orders${query ? `?${query}` : ""}`
    );
};

export const getOrder = async (orderId) => {
    return api.get(`/orders/${orderId}`);
};

export const createOrder = async (orderData) => {
    return api.post(
        "/orders",
        orderData
    );
};

export const updateOrder = async (
    orderId,
    orderData
) => {
    return api.patch(
        `/orders/${orderId}`,
        orderData
    );
};

export const archiveOrder = async (
    orderId
) => {
    return api.delete(
        `/orders/${orderId}`
    );
};

export const restoreOrder = async (
    orderId
) => {
    return api.patch(
        `/orders/${orderId}/restore`
    );
};
