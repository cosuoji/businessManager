import api from "./api";

export const downloadReceipt = async (
    paymentId
) => {
    return api.get(
        `/receipts/payments/${paymentId}/download`,
        {
            responseType: "blob",
        }
    );
};
