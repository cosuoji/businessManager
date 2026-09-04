import api from "./api.js";

export const getPublicInvoice =
  async (token) => {
    return api.get(
      `/public/invoices/${token}`
    );
  };

export const downloadPublicInvoice =
  async (token) => {
    return api.get(
      `/public/invoices/${token}/download`,
      {
        responseType: "blob",
      }
    );
  };
