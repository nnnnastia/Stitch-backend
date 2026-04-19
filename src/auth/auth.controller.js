import {
    getAccessCookieOptions,
    getRefreshCookieOptions,
} from "../config/cookie.config.js";
import * as authService from "./auth.service.js";

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

        const clearCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
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