import Product from "../products/entities/products.model.js";

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

    if (categoryIds.length > 0) {
        filter.categoryId = { $in: categoryIds };
    }

    if (priceMin !== null || priceMax !== null) {
        filter.price = {};

        if (priceMin !== null) {
            filter.price.$gte = priceMin;
        }

        if (priceMax !== null) {
            filter.price.$lte = priceMax;
        }
    }

    return Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}

export async function findFallbackProducts(limit = 12) {
    return Product.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}

export async function findPopularProducts(limit = 12) {
    return Product.find({})
        .sort({ viewsCount: -1, createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}