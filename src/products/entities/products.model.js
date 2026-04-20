import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            enum: ["UAH", "USD", "EUR"],
            default: "UAH",
        },
        coverImage: {
            type: String,
            required: true,
        },
        coverImagePublicId: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        imagePublicIds: {
            type: [String],
            default: [],
        },
        badges: {
            type: [String],
            enum: ["Новинка", "Розпродаж", "Хіт"],
            default: [],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },
        description: {
            type: String,
            default: "",
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        ratingAverage: {
            type: Number,
            default: 0,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);