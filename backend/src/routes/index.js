import express from "express";

import { apiRateLimiter } from "../middleware/rateLimit.middleware.js";
import { authenticate } from "../middleware/auth.js";
import { refreshSubscriptionEntitlement } from "../modules/billing/subscription.middleware.js";
import adminRoutes from "../modules/admin/admin.routes.js";

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

// --------------------------------------------------
// Public routes
// --------------------------------------------------


router.use("/auth", userRoutes);
router.use("/public/invoices", apiRateLimiter, invoicePublicRoutes);

router.use("/admin", adminRoutes);

const protectedRouter = express.Router();
protectedRouter.use(authenticate);
protectedRouter.use(refreshSubscriptionEntitlement);


protectedRouter.use("/customers", apiRateLimiter, customerRoutes);
protectedRouter.use("/billing", apiRateLimiter, billingRoutes);
protectedRouter.use("/usage", apiRateLimiter, usageRoutes);
protectedRouter.use("/orders", apiRateLimiter, orderRoutes);
protectedRouter.use("/payments", apiRateLimiter, paymentRoutes);
protectedRouter.use("/receipts", apiRateLimiter, receiptRoutes);
protectedRouter.use("/outstanding", apiRateLimiter, outstandingRoutes);
protectedRouter.use("/dashboard", apiRateLimiter, dashboardRoutes);
protectedRouter.use("/invoices", apiRateLimiter, invoiceRoutes);
protectedRouter.use("/whatsapp", apiRateLimiter, whatsappRoutes);

router.use(protectedRouter);

export default router;
