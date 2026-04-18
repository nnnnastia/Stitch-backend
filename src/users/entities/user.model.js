import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true
        },
        userSurname: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true,
            select: false
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            enum: ["user", "seller", "admin"],
            default: "user"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        avatarUrl: {
            type: String,
            default: ""
        },
        avatarPublicId: {
            type: String,
            default: ""
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        verificationTokenHash: {
            type: String
        },
        verificationTokenExpires: {
            type: Date
        },
        verificationSentAt: {
            type: Date
        },
        verificationAttempts: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);
