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
        const result = await authService.login(req.body);
        return res.status(200).json(result);
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