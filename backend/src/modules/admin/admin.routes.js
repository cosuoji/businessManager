import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { requireAdmin } from "./admin.middleware.js";
import { getAdminMe } from "./admin.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/me", getAdminMe);

export default router;
