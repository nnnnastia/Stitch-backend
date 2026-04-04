import { Router } from "express";
import { register, login, verifyEmail, refresh, logout } from "./auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.js";
const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/verify-email", authLimiter, verifyEmail);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", logout);

export default router;