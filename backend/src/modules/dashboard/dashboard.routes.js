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

const router = express.Router();

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
