import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { requireAdmin } from "./admin.middleware.js";
import { getAdminMe, getAdminUsers, getAdminUser, getAdminAuditLogs, suspendAdminUser, restoreAdminUser, grantProToUser, revokeProFromUser } from "./admin.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get("/me", getAdminMe);

router.get("/users", getAdminUsers);
router.get("/users/:id", getAdminUser);


router.post("/users/:id/suspend", suspendAdminUser);
router.post("/users/:id/restore", restoreAdminUser);

router.post("/users/:id/grant-pro", grantProToUser);
router.post("/users/:id/revoke-pro", revokeProFromUser);

router.get("/audit-logs", getAdminAuditLogs);

export default router;
