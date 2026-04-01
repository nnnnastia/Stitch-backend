// utils/emailVerification.js
import crypto from "crypto";

export function generateEmailVerifyToken() {
    const token = crypto.randomBytes(32).toString("hex"); // 64 hex chars
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    return { token, tokenHash };
}
