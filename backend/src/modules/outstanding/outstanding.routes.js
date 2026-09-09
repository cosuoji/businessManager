import express from "express";

import {
  getSummary,
  getOrders,
  getDueSoon,
  getOverdue,
  getCustomerOutstandingBalance,
  getCustomers,
} from "./outstanding.controller.js";

import {
  validateOutstandingOrdersQuery,
  validateCustomerOutstanding
} from "./outstanding.validation.js";


const router = express.Router();

router.get("/", getSummary);

router.get(
    "/orders",
    validateOutstandingOrdersQuery,
    getOrders
);

router.get(
    "/due-soon",
    validateOutstandingOrdersQuery,
    getDueSoon
);

router.get(
    "/overdue",
    validateOutstandingOrdersQuery,
    getOverdue
);

router.get(
    "/customers",
    getCustomers
);

router.get(
    "/customers/:customerId",
    validateCustomerOutstanding,
    getCustomerOutstandingBalance
);



export default router;
