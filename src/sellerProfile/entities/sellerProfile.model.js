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

        // як “назва магазину” (може бути ім’я, а може бренд)
        displayName: {
            type: String,
            default: "",
            trim: true,
            maxlength: 60
        },

        about: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1500
        },

        // публічні контакти (не обовʼязково дублювати з User)
        contacts: {
            phone: { type: String, default: "", trim: true },
            email: { type: String, default: "", trim: true },
            city: { type: String, default: "", trim: true },
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

        // виплати (НЕ номер картки)
        payout: {
            provider: { type: String, enum: ["", "liqpay", "wayforpay", "fondy"], default: "" },
            cardLast4: { type: String, default: "", trim: true },
            externalAccountId: { type: String, default: "", trim: true },
        },

        status: {
            type: String,
            enum: ["pending", "active", "blocked"],
            default: "pending"
        },

        rating: {
            avg: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0, min: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model("SellerProfile", sellerProfileSchema);
