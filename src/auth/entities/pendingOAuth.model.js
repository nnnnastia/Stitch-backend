import mongoose from "mongoose";

const pendingOAuthSchema = new mongoose.Schema(
    {
        provider: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        userName: {
            type: String,
            default: "",
        },
        userSurname: {
            type: String,
            default: "",
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model("PendingOAuth", pendingOAuthSchema);