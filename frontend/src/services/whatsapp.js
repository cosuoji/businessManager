import api from "./api";

export const getInvoiceMessage = async (orderId) => {
  return api.get(`/whatsapp/invoice/${orderId}`);
};

export const getReceiptMessage = async (paymentId) => {
  return api.get(`/whatsapp/receipt/${paymentId}`);
};

export const getPaymentReminder = async (orderId) => {
  return api.get(
    `/whatsapp/payment-reminder/${orderId}`
  );
};

export const getOutstandingBalanceMessage = async (
  customerId
) => {
  return api.get(
    `/whatsapp/outstanding/${customerId}`
  );
};
