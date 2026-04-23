import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        provider: {
            type: String,
            enum: ["nova_poshta"],
            required: true,
        },
        cityId: {
            type: String,
            required: true,
        },
        cityName: {
            type: String,
            required: true,
        },
        warehouseId: {
            type: String,
            required: true,
        },
        warehouseName: {
            type: String,
            required: true,
        },
        recipientFullName: {
            type: String,
            required: true,
        },
        recipientPhone: {
            type: String,
            required: true,
        },
        recipientEmail: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            default: null,
        },
        addressLine: {
            type: String,
            default: null,
        },
    },
    { _id: false }
);

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        coverImage: {
            type: String,
            default: null,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            default: [],
        },
        subtotal: {
            type: Number,
            required: true,
        },
        deliveryCost: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
            default: "pending",
            index: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "card"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
            index: true,
        },
        paymentProvider: {
            type: String,
            enum: ["stripe", null],
            default: null,
        },
        paymentSessionId: {
            type: String,
            default: null,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        delivery: {
            type: deliverySchema,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);