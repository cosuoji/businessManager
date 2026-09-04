import express from "express";

import {
  downloadReceipt,
} from "./receipt.controller.js";

import {
  validateReceiptPaymentId,
} from "./receipt.validation.js";

import {
  authenticate,
} from "../../middleware/auth.js";

const router =
  express.Router();

router.use(authenticate);

router.get(
  "/payments/:paymentId/download",
  validateReceiptPaymentId,
  downloadReceipt
);

export default router;
