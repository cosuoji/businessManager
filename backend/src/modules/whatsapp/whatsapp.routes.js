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
  requirePro,
} from "../../middleware/subscription.js";


const router =
  express.Router();


router.get(
  "/invoice/:orderId",
  validateOrderId,
  requirePro,
  getInvoiceMessage
);

router.get(
  "/receipt/:paymentId",
  validatePaymentId,
  requirePro,
  getReceiptMessage
);

router.get(
  "/payment-reminder/:orderId",
  validateOrderId,
  requirePro,
  getPaymentReminder
);

router.get(
  "/outstanding/:customerId",
  validateCustomerId,
  requirePro,
  getOutstandingBalanceMessage
);

export default router;
