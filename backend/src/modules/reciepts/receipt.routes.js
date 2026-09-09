import express from "express";

import {
  downloadReceipt,
} from "./receipt.controller.js";

import {
  validateReceiptPaymentId,
} from "./receipt.validation.js";

const router =
  express.Router();

router.get(
  "/payments/:paymentId/download",
  validateReceiptPaymentId,
  downloadReceipt
);

export default router;
