import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        displayName: {
            type: String,
            default: "",
            trim: true,
            maxlength: 60
        },

        storeSlug: {
            type: String,
            default: "",
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true
        },

        avatarUrl: {
            type: String,
            default: "",
            trim: true
        },

        bannerUrl: {
            type: String,
            default: "",
            trim: true
        },

        about: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1500
        },

        contacts: {
            phone: { type: String, default: "", trim: true },
            email: { type: String, default: "", trim: true },
            city: { type: String, default: "", trim: true },
        },

        socials: {
            instagram: { type: String, default: "", trim: true },
            facebook: { type: String, default: "", trim: true },
            telegram: { type: String, default: "", trim: true },
            website: { type: String, default: "", trim: true },
        },

        delivery: {
            ukrposhta: { type: Boolean, default: true },
            novaPoshta: { type: Boolean, default: true },
            meest: { type: Boolean, default: false }
        },

        payment: {
            cardOnline: { type: Boolean, default: true },
            cashOnDelivery: { type: Boolean, default: false },
        },

        payout: {
            provider: {
                type: String,
                enum: ["", "liqpay", "wayforpay", "fondy"],
                default: ""
            },
            cardLast4: { type: String, default: "", trim: true },
            externalAccountId: { type: String, default: "", trim: true },
        },

        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active"
        },

        isPublic: {
            type: Boolean,
            default: true
        },

        rating: {
            avg: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0, min: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model("SellerProfile", sellerProfileSchema);