import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null,
            index: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
        sourceType: {
            type: String,
            enum: ["shop", "product", "order", "system"],
            required: true,
        },

        lastMessageText: {
            type: String,
            default: "",
        },

        lastMessageAt: {
            type: Date,
            default: null,
            index: true,
        },

        lastMessageSender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        buyerUnreadCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        sellerUnreadCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// один чат між buyer-seller-product
conversationSchema.index(
    { buyer: 1, seller: 1, product: 1, sourceType: 1 },
    { unique: true, partialFilterExpression: { sourceType: "product" } }
);

// один загальний чат buyer-seller-shop
conversationSchema.index(
    { buyer: 1, seller: 1, sourceType: 1 },
    { unique: true, partialFilterExpression: { sourceType: "shop" } }
);

export default mongoose.model("Conversation", conversationSchema);