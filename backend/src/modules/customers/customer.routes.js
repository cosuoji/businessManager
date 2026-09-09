import express from "express";

import {
  create,
  list,
  getOne,
  update,
  archive,
  restoreCustomer,
} from "./customer.controller.js";
import { getCustomerOutstandingBalance } from "../outstanding/outstanding.controller.js";
import { validateCustomerOutstanding } from "../outstanding/outstanding.validation.js";

const router = express.Router();

router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", archive);
router.patch(
    "/:id/restore",
    restoreCustomer
);
router.get("/:customerId/outstanding", validateCustomerOutstanding, getCustomerOutstandingBalance);


export default router;
