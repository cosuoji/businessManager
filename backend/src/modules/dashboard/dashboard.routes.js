import express from "express";

import {
  getSummary,
  getRecentOrdersController,
  getRecentPaymentsController,
} from "./dashboard.controller.js";

import {
  validateDashboardDateRange,
  validateDashboardPagination,
} from "./dashboard.validation.js";

import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

// GET /api/v1/dashboard
router.get(
  "/",
  validateDashboardDateRange,
  getSummary
);

// GET /api/v1/dashboard/recent-orders
router.get(
  "/recent-orders",
  validateDashboardPagination,
  getRecentOrdersController
);

// GET /api/v1/dashboard/recent-payments
router.get(
  "/recent-payments",
  validateDashboardPagination,
  getRecentPaymentsController
);

export default router;
