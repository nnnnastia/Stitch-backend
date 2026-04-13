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