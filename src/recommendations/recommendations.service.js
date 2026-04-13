import Product from "../products/entities/products.model.js";
import { ensureUserProfile } from "../userProfile/userProfile.service.js";

function updatePricePreference(profile, price) {
    if (price == null) return;

    const currentMin = profile.pricePref?.min;
    const currentMax = profile.pricePref?.max;

    if (currentMin == null || price < currentMin) {
        profile.pricePref.min = price;
    }

    if (currentMax == null || price > currentMax) {
        profile.pricePref.max = price;
    }
}

export async function trackProductView(userId, productId) {
    const profile = await ensureUserProfile(userId);

    const product = await Product.findById(productId).lean();
    if (!product) {
        throw new Error("Product not found");
    }

    const currentViewed = (profile.recentlyViewed || []).map(id => id.toString());
    const cleanViewed = currentViewed.filter(id => id !== productId.toString());

    profile.recentlyViewed = [productId, ...cleanViewed].slice(0, 20);

    if (product.categoryId) {
        const categoryKey = product.categoryId.toString();
        const currentScore = profile.categoryScores.get(categoryKey) || 0;
        profile.categoryScores.set(categoryKey, currentScore + 1);
    }

    if (Array.isArray(product.tags)) {
        for (const tag of product.tags) {
            const normalizedTag = String(tag).trim().toLowerCase();
            if (!normalizedTag) continue;

            const currentScore = profile.tagScores.get(normalizedTag) || 0;
            profile.tagScores.set(normalizedTag, currentScore + 1);
        }
    }

    if (typeof product.price === "number") {
        updatePricePreference(profile, product.price);
    }

    await profile.save();

    return profile;
}

export async function getRecommendedProducts(userId, limit = 8) {
    const profile = await ensureUserProfile(userId);

    const viewedIds = new Set(
        (profile.recentlyViewed || []).map(id => id.toString())
    );

    const products = await Product.find({ isActive: true }).lean();

    const scoredProducts = products
        .filter(product => !viewedIds.has(product._id.toString()))
        .map(product => {
            let score = 0;

            if (product.categoryId) {
                const categoryKey = product.categoryId.toString();
                score += profile.categoryScores.get(categoryKey) || 0;
            }

            if (Array.isArray(product.tags)) {
                for (const tag of product.tags) {
                    const normalizedTag = String(tag).trim().toLowerCase();
                    score += profile.tagScores.get(normalizedTag) || 0;
                }
            }

            if (
                typeof product.price === "number" &&
                profile.pricePref?.min != null &&
                profile.pricePref?.max != null &&
                product.price >= profile.pricePref.min &&
                product.price <= profile.pricePref.max
            ) {
                score += 2;
            }

            return {
                ...product,
                recommendationScore: score
            };
        })
        .filter(product => product.recommendationScore > 0)
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);

    if (scoredProducts.length > 0) {
        return scoredProducts;
    }

    return Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}