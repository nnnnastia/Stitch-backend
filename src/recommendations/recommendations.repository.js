import UserProfile from "../userProfile/entities/userProfile.model.js";
import Product from "../products/entities/products.model.js";

export async function findOrCreateUserProfile(userId) {
    let profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
        profile = await UserProfile.create({ user: userId });
    }

    return profile;
}

export async function findUserProfileByUserId(userId) {
    return UserProfile.findOne({ user: userId });
}

export async function saveUserProfile(profile) {
    return profile.save();
}

export async function findProductById(productId) {
    return Product.findById(productId);
}

export async function findRecommendedProducts({
    excludedIds = [],
    categoryIds = [],
    priceMin = null,
    priceMax = null,
    limit = 12,
}) {
    const filter = {
        _id: { $nin: excludedIds },
    };

    // Якщо додаси status у Product, розкоментуй:
    // filter.status = "active";

    if (categoryIds.length) {
        filter.categoryId = { $in: categoryIds };
    }

    if (priceMin !== null || priceMax !== null) {
        filter.price = {};
        if (priceMin !== null) filter.price.$gte = priceMin;
        if (priceMax !== null) filter.price.$lte = priceMax;
    }

    return Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}

export async function findFallbackProducts(limit = 12) {
    const filter = {};

    // Якщо додаси status у Product, розкоментуй:
    // filter.status = "active";

    return Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}