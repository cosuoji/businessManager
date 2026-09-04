import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetUserPassword,
  updateCurrentUser,
} from "./user.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { authRateLimiter, passwordResetRateLimiter } from "../../middleware/rateLimit.middleware.js";
const router = express.Router();

//Auth routes
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);

//User routes
router.get("/me", authenticate, getCurrentUser);
router.post("/forgot-password", passwordResetRateLimiter, forgotPassword);
router.post("/reset-password", passwordResetRateLimiter, resetUserPassword);
router.patch("/me", authenticate, updateCurrentUser);

export default router;
