import express from "express";

import {
  getInvoiceMessage,
  getReceiptMessage,
  getPaymentReminder,
  getOutstandingBalanceMessage,
} from "./whatsapp.controller.js";

import {
  validateOrderId,
  validatePaymentId,
  validateCustomerId,
} from "./whatsapp.validation.js";

import {
  authenticate,
} from "../../middleware/auth.js";

const router =
  express.Router();

router.use(authenticate);

router.get(
  "/invoice/:orderId",
  validateOrderId,
  getInvoiceMessage
);

router.get(
  "/receipt/:paymentId",
  validatePaymentId,
  getReceiptMessage
);

router.get(
  "/payment-reminder/:orderId",
  validateOrderId,
  getPaymentReminder
);

router.get(
  "/outstanding/:customerId",
  validateCustomerId,
  getOutstandingBalanceMessage
);

export default router;
