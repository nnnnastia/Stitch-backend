import mongoose from "mongoose";
import * as cartRepository from "./cart.repository.js";
import Product from "../products/entities/products.model.js";
import { toCartResponseDto } from "./dto/cart.dto.js";

async function getOrCreateCart(userId) {
    let cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
        cart = await cartRepository.createCart(userId);
        cart = await cartRepository.findCartByUserId(userId);
    }

    return cart;
}

function validateObjectId(id, fieldName = "ID") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`${fieldName} is invalid`);
        error.statusCode = 400;
        throw error;
    }
}

async function getValidProduct(productId) {
    validateObjectId(productId, "Product ID");

    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    if (product.isActive === false) {
        const error = new Error("Product is inactive");
        error.statusCode = 400;
        throw error;
    }

    return product;
}

export async function getMyCart(userId) {
    const cart = await getOrCreateCart(userId);
    return toCartResponseDto(cart);
}

export async function addItemToCart(userId, { productId, quantity = 1 }) {
    validateObjectId(userId, "User ID");

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        const error = new Error("Quantity must be a positive integer");
        error.statusCode = 400;
        throw error;
    }

    await getValidProduct(productId);

    const cart = await getOrCreateCart(userId);

    const existingItem = cart.items.find(
        (item) => String(item.product?._id || item.product) === String(productId)
    );

    if (existingItem) {
        existingItem.quantity += parsedQuantity;
    } else {
        cart.items.push({
            product: productId,
            quantity: parsedQuantity,
        });
    }

    await cartRepository.saveCart(cart);

    const updatedCart = await cartRepository.findCartByUserId(userId);
    return toCartResponseDto(updatedCart);
}

export async function updateCartItemQuantity(userId, { productId, quantity }) {
    validateObjectId(userId, "User ID");

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        const error = new Error("Quantity must be a positive integer");
        error.statusCode = 400;
        throw error;
    }

    await getValidProduct(productId);

    const cart = await getOrCreateCart(userId);

    const item = cart.items.find(
        (item) => String(item.product?._id || item.product) === String(productId)
    );

    if (!item) {
        const error = new Error("Product is not in cart");
        error.statusCode = 404;
        throw error;
    }

    item.quantity = parsedQuantity;

    await cartRepository.saveCart(cart);

    const updatedCart = await cartRepository.findCartByUserId(userId);
    return toCartResponseDto(updatedCart);
}

export async function removeItemFromCart(userId, productId) {
    validateObjectId(userId, "User ID");
    validateObjectId(productId, "Product ID");

    const cart = await getOrCreateCart(userId);

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
        (item) => String(item.product?._id || item.product) !== String(productId)
    );

    if (cart.items.length === initialLength) {
        const error = new Error("Product is not in cart");
        error.statusCode = 404;
        throw error;
    }

    await cartRepository.saveCart(cart);

    const updatedCart = await cartRepository.findCartByUserId(userId);
    return toCartResponseDto(updatedCart);
}

export async function clearMyCart(userId) {
    validateObjectId(userId, "User ID");

    let cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
        cart = await cartRepository.createCart(userId);
    }

    cart.items = [];
    await cartRepository.saveCart(cart);

    const updatedCart = await cartRepository.findCartByUserId(userId);
    return toCartResponseDto(updatedCart);
}