import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    verifyEmail,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    completeGoogleRegistration,
    googleLoginCallback,
    googleRegisterCallback,
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

// Google login
router.get(
    "/google/login",
    passport.authenticate("google-login", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/login/callback",
    passport.authenticate("google-login", {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false,
    }),
    googleLoginCallback
);

// Google register
router.get(
    "/google/register",
    passport.authenticate("google-register", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/register/callback",
    passport.authenticate("google-register", {
        failureRedirect: `${process.env.FRONTEND_URL}/register`,
        session: false,
    }),
    googleRegisterCallback
);

router.post("/google/complete-registration", completeGoogleRegistration);

export default router;