import crypto from "crypto";
import RefreshSession from "./token.model.js";

export function hashToken(rawToken) {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function createRefreshSession({ userId, rawToken, expiresAt, userAgent, ip }) {
    return RefreshSession.create({
        user: userId,
        tokenHash: hashToken(rawToken),
        expiresAt,
        userAgent,
        ip,
    });
}

export async function findRefreshSession(rawToken) {
    return RefreshSession.findOne({
        tokenHash: hashToken(rawToken),
        expiresAt: { $gt: new Date() },
        revokedAt: null,
    });
}

export async function revokeRefreshSessionByToken(rawToken) {
    return RefreshSession.findOneAndUpdate(
        { tokenHash: hashToken(rawToken), revokedAt: null },
        { revokedAt: new Date() },
        { new: true }
    );
}

export async function revokeAllUserSessions(userId) {
    return RefreshSession.updateMany(
        {
            user: userId,
            revokedAt: null,
        },
        {
            revokedAt: new Date(),
        }
    );
}