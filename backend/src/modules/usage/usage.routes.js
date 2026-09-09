import express from "express";

import {
  getCurrentUsage,
} from "./usage.controller.js";

const router =
  express.Router();

router.get(
  "/",
  getCurrentUsage
);

export default router;
