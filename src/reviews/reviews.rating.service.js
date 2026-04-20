import mongoose from "mongoose";
import Review from "./entities/review.model.js";
import Product from "../products/entities/products.model.js";
import SellerProfile from "../sellerProfile/entities/sellerProfile.model.js";

function roundRating(value) {
    return Math.round(value * 10) / 10;
}

export async function recalculateProductRating(productId) {
    const stats = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    await Product.findByIdAndUpdate(productId, {
        ratingAverage: stats[0]?.avgRating ? roundRating(stats[0].avgRating) : 0,
        ratingCount: stats[0]?.count || 0,
    });
}

export async function recalculateSellerRating(sellerId) {
    const stats = await Review.aggregate([
        {
            $match: {
                seller: new mongoose.Types.ObjectId(sellerId),
            },
        },
        {
            $group: {
                _id: "$seller",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    const avg = stats[0]?.avgRating ? roundRating(stats[0].avgRating) : 0;
    const count = stats[0]?.count || 0;

    await SellerProfile.findOneAndUpdate(
        { user: sellerId },
        {
            rating: {
                avg,
                count,
            },
        }
    );
}