import {
    getAccessCookieOptions,
    getRefreshCookieOptions,
} from "../config/cookie.config.js";
import * as authService from "./auth.service.js";
import PendingOAuth from "./entities/pendingOAuth.model.js";

export async function register(req, res, next) {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const result = await authService.login(req.body, {
            userAgent: req.get("user-agent"),
            ip: req.ip,
        });

        res.cookie("accessToken", result.accessToken, getAccessCookieOptions());
        res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

        return res.status(200).json({
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
}

export async function verifyEmail(req, res, next) {
    try {
        const user = await authService.verifyEmail(req.query);

        return res.status(200).json({
            message: "Email verified successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const result = await authService.refresh(refreshToken);

        res.cookie("accessToken", result.accessToken, getAccessCookieOptions());
        res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

        return res.status(200).json({
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        await authService.logout(refreshToken);

        const isProd = process.env.NODE_ENV === "production";

        const clearCookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
        };

        res.clearCookie("accessToken", clearCookieOptions);
        res.clearCookie("refreshToken", clearCookieOptions);

        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function forgotPassword(req, res, next) {
    try {
        const result = await authService.forgotPassword(req.body);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const result = await authService.resetPassword(req.body);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function googleLoginCallback(req, res, next) {
    try {
        if (!req.user || req.user.mode !== "login") {
            return res.redirect(`${process.env.FRONTEND_URL}/login`);
        }
        if (req.user.mode === "login_not_found") {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_not_found`);
        }
        const result = await authService.loginWithGoogle(req.user.user, {
            userAgent: req.get("user-agent"),
            ip: req.ip,
        });

        res.cookie("accessToken", result.accessToken, getAccessCookieOptions());
        res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

        return res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        next(error);
    }
}

export async function googleRegisterCallback(req, res, next) {
    try {
        if (!req.user || req.user.mode !== "register") {
            return res.redirect(`${process.env.FRONTEND_URL}/register`);
        }
        if (req.user.mode === "register_exists") {
            return res.redirect(`${process.env.FRONTEND_URL}/register?error=google_exists`);
        }
        const pending = await PendingOAuth.create({
            ...req.user.googleProfile,
            expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        });

        return res.redirect(
            `${process.env.FRONTEND_URL}/complete-google-signup?token=${pending._id}`
        );
    } catch (error) {
        next(error);
    }
}

export async function completeGoogleRegistration(req, res, next) {
    try {
        const result = await authService.completeGoogleRegistration(req.body, {
            userAgent: req.get("user-agent"),
            ip: req.ip,
        });

        res.cookie("accessToken", result.accessToken, getAccessCookieOptions());
        res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

        return res.status(201).json({
            user: result.user,
            message: "Google registration completed successfully",
        });
    } catch (error) {
        next(error);
    }
}