import express from "express";

import {
  viewPublicInvoice,
  downloadPublicInvoice,
} from "./invoice.controller.js";

const router = express.Router();

router.get(
  "/:token",
  viewPublicInvoice
);

router.get(
  "/:token/download",
  downloadPublicInvoice
);

export default router;
