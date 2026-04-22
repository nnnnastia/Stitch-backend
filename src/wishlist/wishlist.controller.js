import * as wishlistService from "./wishlist.service.js";

export async function getMyWishlistController(req, res, next) {
    try {
        const wishlist = await wishlistService.getMyWishlist(req.user.id);
        res.json({ wishlist });
    } catch (error) {
        next(error);
    }
}

export async function addToWishlistController(req, res, next) {
    try {
        const { productId } = req.body;

        if (!productId) {
            const error = new Error("Product ID is required");
            error.status = 400;
            throw error;
        }

        const wishlist = await wishlistService.addToWishlist(req.user.id, productId);
        res.json({ wishlist });
    } catch (error) {
        next(error);
    }
}

export async function removeFromWishlistController(req, res, next) {
    try {
        const { productId } = req.params;

        const wishlist = await wishlistService.removeFromWishlist(req.user.id, productId);
        res.json({ wishlist });
    } catch (error) {
        next(error);
    }
}

export async function toggleWishlistItemController(req, res, next) {
    try {
        const { productId } = req.body;

        if (!productId) {
            const error = new Error("Product ID is required");
            error.status = 400;
            throw error;
        }

        const result = await wishlistService.toggleWishlistItem(req.user.id, productId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}