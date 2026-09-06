import express from "express";
import { apiRateLimiter } from "../middleware/rateLimit.middleware.js";

import userRoutes from "../modules/users/user.routes.js";
import customerRoutes from "../modules/customers/customer.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";
import outstandingRoutes from "../modules/outstanding/outstanding.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import invoiceRoutes from "../modules/invoice/invoice.routes.js";
import whatsappRoutes from "../modules/whatsapp/whatsapp.routes.js";
import receiptRoutes from "../modules/reciepts/receipt.routes.js";
import invoicePublicRoutes from "../modules/invoice/invoice.routes.public.js";
import usageRoutes from "../modules/usage/usage.routes.js";
import billingRoutes from "../modules/billing/billing.routes.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Business Manager API v1",
  });
});

router.use("/auth", userRoutes);
router.use("/customers", apiRateLimiter, customerRoutes);
router.use("/billing", apiRateLimiter, billingRoutes);
router.use("/usage", apiRateLimiter, usageRoutes);
router.use("/public/invoices", apiRateLimiter, invoicePublicRoutes);
router.use("/orders", apiRateLimiter, orderRoutes);
router.use("/payments", apiRateLimiter, paymentRoutes);
router.use("/receipts", apiRateLimiter, receiptRoutes);
router.use("/outstanding", apiRateLimiter, outstandingRoutes);
router.use("/dashboard", apiRateLimiter, dashboardRoutes);
router.use("/invoices", apiRateLimiter, invoiceRoutes);
router.use("/whatsapp", apiRateLimiter, whatsappRoutes);

export default router;
