import Cart from "./entities/cart.model.js";

export async function findCartByUserId(userId) {
    return Cart.findOne({ user: userId }).populate({
        path: "items.product",
        populate: {
            path: "categoryId",
            select: "name slug",
        },
    });
}

export async function createCart(userId) {
    return Cart.create({
        user: userId,
        items: [],
    });
}

export async function saveCart(cart) {
    return cart.save();
}

export async function deleteCartItems(userId) {
    return Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } },
        { new: true }
    ).populate({
        path: "items.product",
        populate: {
            path: "categoryId",
            select: "name slug",
        },
    });
}