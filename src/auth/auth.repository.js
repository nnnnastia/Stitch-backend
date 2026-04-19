import crypto from "crypto";
import User from "../users/entities/user.model.js";

export async function findByEmail(email) {
    return User.findOne({ email });
}

export async function findByEmailWithPassword(email) {
    return User.findOne({ email }).select("+passwordHash");
}

export async function createUser(data) {
    return User.create(data);
}

export async function findByVerificationToken(token) {
    const verificationTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    return User.findOne({
        verificationTokenHash,
        verificationTokenExpires: { $gt: new Date() },
    });
}

export async function updateById(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });
}

export async function findUserById(userId) {
    return User.findById(userId);
}

export async function findUserByResetTokenHash(tokenHash) {
    return User.findOne({
        resetPasswordTokenHash: tokenHash,
        resetPasswordTokenExpires: { $gt: new Date() },
    }).select("+passwordHash");
}

export async function saveResetPasswordToken(user, tokenHash, expiresAt) {
    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordTokenExpires = expiresAt;
    return user.save();
}

export function updateUserPassword(user, passwordHash) {
    user.passwordHash = passwordHash;
    user.resetPasswordTokenHash = null;
    user.resetPasswordTokenExpires = null;
    return user.save();
}
