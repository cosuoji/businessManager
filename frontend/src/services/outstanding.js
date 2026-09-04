import api from "./api";

export const getOutstandingSummary = async () => {
    return api.get("/outstanding");
};

export const getOutstandingOrders = async ({
    page = 1,
    limit = 20,
    paymentStatus,
} = {}) => {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (paymentStatus) {
        params.set("paymentStatus", paymentStatus);
    }

    return api.get(`/outstanding/orders?${params.toString()}`);
};

export const getDueSoonOrders = async ({
    page = 1,
    limit = 20,
} = {}) => {
    return api.get(
        `/outstanding/due-soon?page=${page}&limit=${limit}`
    );
};

export const getOverdueOrders = async ({
    page = 1,
    limit = 20,
} = {}) => {
    return api.get(
        `/outstanding/overdue?page=${page}&limit=${limit}`
    );
};

export const getCustomerOutstanding = async (
    customerId,
    {
        page = 1,
        limit = 20,
    } = {}
) => {
    return api.get(
        `/outstanding/customers/${customerId}?page=${page}&limit=${limit}`
    );
};

export const getOutstandingCustomers = async ({
  page = 1,
  limit = 20,
} = {}) => {
  return api.get(
    `/outstanding/customers?page=${page}&limit=${limit}`
  );
};
