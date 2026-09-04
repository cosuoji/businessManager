import {
  generateInvoiceMessage,
  generateReceiptMessage,
  generatePaymentReminder,
  generateOutstandingBalanceMessage,
} from "./whatsapp.service.js";


export const getInvoiceMessage =
  async (req, res, next) => {
    try {
      const result =
        await generateInvoiceMessage(
          req.user.id,
          req.params.orderId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const getReceiptMessage =
  async (req, res, next) => {
    try {
      const result =
        await generateReceiptMessage(
          req.user.id,
          req.params.paymentId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const getPaymentReminder =
  async (req, res, next) => {
    try {
      const result =
        await generatePaymentReminder(
          req.user.id,
          req.params.orderId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

export const getOutstandingBalanceMessage =
  async (req, res, next) => {
    try {
      const result =
        await generateOutstandingBalanceMessage(
          req.user.id,
          req.params.customerId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
