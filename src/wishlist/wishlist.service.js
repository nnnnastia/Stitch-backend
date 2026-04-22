import Wishlist from "./entities/wishlist.model.js";

async function getOrCreateWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            items: [],
        });
    }

    return wishlist;
}

export async function getMyWishlist(userId) {
    const wishlist = await getOrCreateWishlist(userId);

    await wishlist.populate({
        path: "items.product",
        populate: [
            { path: "categoryId", select: "name slug icon" },
            { path: "seller", select: "userName avatarUrl" },
        ],
    });

    return wishlist;
}

export async function addToWishlist(userId, productId) {
    const wishlist = await getOrCreateWishlist(userId);

    const exists = wishlist.items.some(
        (item) => String(item.product) === String(productId)
    );

    if (!exists) {
        wishlist.items.unshift({ product: productId });
        await wishlist.save();
    }

    await wishlist.populate({
        path: "items.product",
        populate: [
            { path: "categoryId", select: "name slug icon" },
            { path: "seller", select: "userName avatarUrl" },
        ],
    });

    return wishlist;
}

export async function removeFromWishlist(userId, productId) {
    const wishlist = await getOrCreateWishlist(userId);

    wishlist.items = wishlist.items.filter(
        (item) => String(item.product) !== String(productId)
    );

    await wishlist.save();

    await wishlist.populate({
        path: "items.product",
        populate: [
            { path: "categoryId", select: "name slug icon" },
            { path: "seller", select: "userName avatarUrl" },
        ],
    });

    return wishlist;
}

export async function toggleWishlistItem(userId, productId) {
    const wishlist = await getOrCreateWishlist(userId);

    const exists = wishlist.items.some(
        (item) => String(item.product) === String(productId)
    );

    if (exists) {
        wishlist.items = wishlist.items.filter(
            (item) => String(item.product) !== String(productId)
        );
    } else {
        wishlist.items.unshift({ product: productId });
    }

    await wishlist.save();

    await wishlist.populate({
        path: "items.product",
        populate: [
            { path: "categoryId", select: "name slug icon" },
            { path: "seller", select: "userName avatarUrl" },
        ],
    });

    return {
        wishlist,
        isInWishlist: !exists,
    };
}