import Product from "../products/entities/products.model.js";
import User from "../users/entities/user.model.js";

function updatePricePreference(user, price) {
    if (price == null) return;

    if (!user.pricePref) {
        user.pricePref = { min: null, max: null };
    }

    const currentMin = user.pricePref.min;
    const currentMax = user.pricePref.max;

    if (currentMin == null || price < currentMin) {
        user.pricePref.min = price;
    }

    if (currentMax == null || price > currentMax) {
        user.pricePref.max = price;
    }
}

export async function trackProductView(userId, productId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
        throw new Error("Product not found");
    }

    await Product.findByIdAndUpdate(productId, {
        $inc: { viewsCount: 1 }
    });

    if (!user.categoryScores) {
        user.categoryScores = new Map();
    }

    if (!user.tagScores) {
        user.tagScores = new Map();
    }

    const currentViewed = (user.recentlyViewed || []).map((item) => ({
        product: item.product.toString(),
        viewedAt: item.viewedAt,
    }));

    const cleanViewed = currentViewed.filter(
        (item) => item.product !== productId.toString()
    );

    user.recentlyViewed = [
        {
            product: productId,
            viewedAt: new Date(),
        },
        ...cleanViewed,
    ].slice(0, 20);

    if (product.categoryId) {
        const categoryKey = product.categoryId.toString();
        const currentScore = user.categoryScores.get(categoryKey) || 0;
        user.categoryScores.set(categoryKey, currentScore + 1);
    }

    if (Array.isArray(product.tags)) {
        for (const tag of product.tags) {
            const normalizedTag = String(tag).trim().toLowerCase();
            if (!normalizedTag) continue;

            const currentScore = user.tagScores.get(normalizedTag) || 0;
            user.tagScores.set(normalizedTag, currentScore + 1);
        }
    }

    if (typeof product.price === "number") {
        updatePricePreference(user, product.price);
    }

    await user.save();

    return user;
}

export async function getRecommendedProducts(userId, limit = 8) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const viewedIds = new Set(
        (user.recentlyViewed || []).map((item) => item.product.toString())
    );

    const products = await Product.find({})
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon")
        .lean();

    const scoredProducts = products
        .filter((product) => !viewedIds.has(product._id.toString()))
        .map((product) => {
            let score = 0;

            if (product.categoryId?._id) {
                const categoryKey = product.categoryId._id.toString();
                score += user.categoryScores?.get(categoryKey) || 0;
            } else if (product.categoryId) {
                const categoryKey = product.categoryId.toString();
                score += user.categoryScores?.get(categoryKey) || 0;
            }

            if (Array.isArray(product.tags)) {
                for (const tag of product.tags) {
                    const normalizedTag = String(tag).trim().toLowerCase();
                    score += user.tagScores?.get(normalizedTag) || 0;
                }
            }

            if (
                typeof product.price === "number" &&
                user.pricePref?.min != null &&
                user.pricePref?.max != null &&
                product.price >= user.pricePref.min &&
                product.price <= user.pricePref.max
            ) {
                score += 2;
            }

            return {
                ...product,
                recommendationScore: score,
            };
        })
        .filter((product) => product.recommendationScore > 0)
        .sort((a, b) => {
            if (b.recommendationScore !== a.recommendationScore) {
                return b.recommendationScore - a.recommendationScore;
            }

            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, limit);

    if (scoredProducts.length > 0) {
        return scoredProducts;
    }

    return Product.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon")
        .lean();
}

export async function getPopularProducts(limit = 8) {
    return Product.find({})
        .sort({ viewsCount: -1, createdAt: -1 })
        .limit(limit)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon")
        .lean();
}

export async function trackPublicProductView(productId) {
    const product = await Product.findByIdAndUpdate(
        productId,
        { $inc: { viewsCount: 1 } },
        { new: true }
    );

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
}