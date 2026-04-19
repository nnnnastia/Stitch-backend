import { Router } from "express";
import {
    register,
    login,
    verifyEmail,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
} from "./auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.js";
const router = Router();
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", logout);

router.get("/verify-email", authLimiter, verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;