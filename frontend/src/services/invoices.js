import api from "./api";

export const getInvoice = async (orderId) => {
    return api.get(
        `/invoices/orders/${orderId}/preview`
    );
};

export const downloadInvoice = async (orderId) => {
    return api.get(
        `/invoices/orders/${orderId}/download`,
        {
            responseType: "blob",
        }
    );
};


export const getInvoices = async (
  params = {}
) => {
  const query = new URLSearchParams();

  if (params.page) {
    query.set("page", params.page);
  }

  if (params.limit) {
    query.set("limit", params.limit);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.dateFrom) {
    query.set(
      "dateFrom",
      params.dateFrom
    );
  }

  if (params.dateTo) {
    query.set(
      "dateTo",
      params.dateTo
    );
  }

  const queryString =
    query.toString();

  return api.get(
    `/invoices${
      queryString
        ? `?${queryString}`
        : ""
    }`
  );
};
