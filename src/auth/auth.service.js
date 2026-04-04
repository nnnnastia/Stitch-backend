import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import * as authRepository from "./auth.repository.js";
import * as tokenRepository from "./tokens/token.repository.js";
import { toAuthUserDto } from "./dto/auth.dto.js";
import { sendVerificationEmail } from "../mail/mail.service.js"

function createAccessToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
}

function createRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

function generateVerificationToken() {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    return {
        rawToken,
        tokenHash,
    };
}

export async function register(body) {
    const {
        userName,
        userSurname,
        email,
        password,
        phoneNumber,
    } = body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await authRepository.findByEmail(normalizedEmail);

    if (existingUser) {
        const error = new Error("User with this email already exists");
        error.status = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { rawToken, tokenHash } = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const user = await authRepository.createUser({
        userName: userName.trim(),
        userSurname: userSurname.trim(),
        email: normalizedEmail,
        passwordHash,
        phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
        verificationTokenHash: tokenHash,
        verificationTokenExpires: verificationExpires,
        verificationSentAt: new Date(),
        verificationAttempts: 1,
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

    await sendVerificationEmail(user.email, verificationLink);

    return {
        message: "Registration successful. Please verify your email.",
        user: toAuthUserDto(user),
    };
}

export async function login(body, meta) {
    const { email, password } = body;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findByEmailWithPassword(normalizedEmail);

    if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    if (!user.isActive) {
        const error = new Error("User account is inactive");
        error.status = 403;
        throw error;
    }

    if (!user.emailVerified) {
        const error = new Error("Email is not verified");
        error.status = 403;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken();

    await tokenRepository.createRefreshSession({
        userId: user._id,
        rawToken: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        userAgent: meta.userAgent,
        ip: meta.ip,
    });

    return {
        accessToken,
        refreshToken,
        user: toAuthUserDto(user),
    };
}

export async function verifyEmail(query) {
    const { token } = query;

    if (!token) {
        const error = new Error("Verification token is required");
        error.status = 400;
        throw error;
    }

    const user = await authRepository.findByVerificationToken(token);

    if (!user) {
        const error = new Error("Invalid or expired verification token");
        error.status = 400;
        throw error;
    }

    const updatedUser = await authRepository.updateById(user._id, {
        emailVerified: true,
        verificationTokenHash: null,
        verificationTokenExpires: null,
    });

    return toAuthUserDto(updatedUser);
}

export async function refresh(refreshToken) {
    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.status = 401;
        throw error;
    }

    const session = await authRepository.findRefreshSession(refreshToken);

    if (!session) {
        const error = new Error("Invalid or expired refresh token");
        error.status = 401;
        throw error;
    }

    const user = await authRepository.findUserById(session.user);

    if (!user || !user.isActive) {
        const error = new Error("User is not available");
        error.status = 401;
        throw error;
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken();

    await authRepository.revokeRefreshSessionByToken(refreshToken);

    await tokenRepository.createRefreshSession({
        userId: user._id,
        rawToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: toAuthUserDto(user),
    };
}

export async function logout(refreshToken) {
    if (refreshToken) {
        await authRepository.revokeRefreshSessionByToken(refreshToken);
    }

    return { message: "Logged out succesfully" };
}
