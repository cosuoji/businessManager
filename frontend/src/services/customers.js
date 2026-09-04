import api from "./api";

export const getCustomers = async (
    params = {}
) => {
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

    if (typeof params.archived === "boolean") {
          searchParams.set(
              "archived",
              params.archived
          );
      }


    const query =
        searchParams.toString();

    return api.get(
        `/customers${
            query
                ? `?${query}`
                : ""
        }`
    );
};

export const getCustomer = async (
    customerId
) => {
    return api.get(
        `/customers/${customerId}`
    );
};

export const createCustomer =
    async (customerData) => {
        return api.post(
            "/customers",
            customerData
        );
    };

export const updateCustomer =
    async (
        customerId,
        customerData
    ) => {
        return api.patch(
            `/customers/${customerId}`,
            customerData
        );
    };

export const archiveCustomer =
    async (customerId) => {
        return api.delete(
            `/customers/${customerId}`
        );
    };

export const restoreCustomer = async (
    customerId
) => {
    return api.patch(
        `/customers/${customerId}/restore`
    );
};
