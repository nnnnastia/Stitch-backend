import * as cartService from "./cart.service.js";

export async function getMyCart(req, res, next) {
    try {
        const cart = await cartService.getMyCart(req.user._id);
        res.json(cart);
    } catch (error) {
        next(error);
    }
}

export async function addItemToCart(req, res, next) {
    try {
        const cart = await cartService.addItemToCart(req.user._id, req.body);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}

export async function updateItemQuantity(req, res, next) {
    try {
        const cart = await cartService.updateCartItemQuantity(req.user._id, {
            productId: req.params.productId,
            quantity: req.body.quantity,
        });

        res.json(cart);
    } catch (error) {
        next(error);
    }
}

export async function removeItem(req, res, next) {
    try {
        const cart = await cartService.removeItemFromCart(
            req.user._id,
            req.params.productId
        );

        res.json(cart);
    } catch (error) {
        next(error);
    }
}

export async function clearCart(req, res, next) {
    try {
        const cart = await cartService.clearMyCart(req.user._id);
        res.json(cart);
    } catch (error) {
        next(error);
    }
}