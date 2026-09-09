import express from "express";

import {
  previewInvoice,
  downloadInvoice,
  listInvoices,
} from "./invoice.controller.js";

import {
  validateInvoiceOrderId,
} from "./invoice.validation.js";

const router = express.Router();

router.get(
  "/",
  listInvoices
);

router.get(
  "/orders/:orderId/preview",
  validateInvoiceOrderId,
  previewInvoice
);

router.get(
  "/orders/:orderId/download",
  validateInvoiceOrderId,
  downloadInvoice
);



export default router;
