import express from "express";

import {
  getCurrentUsage,
} from "./usage.controller.js";

import { authenticate } from "../../middleware/auth.js";
const router =
  express.Router();
router.use(authenticate);

router.get(
  "/",
  getCurrentUsage
);

export default router;
