import mongoose from "mongoose";
import { ALLOWED_BADGES, ALLOWED_CURRENCY } from "./sellerProducts.constants.js";

export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

export function normalizeTitle(title) {
    if (!title || !String(title).trim()) {
        const error = new Error("Title is required");
        error.status = 400;
        throw error;
    }

    return String(title).trim();
}

export function normalizePrice(price) {
    const numPrice = Number(price);

    if (!Number.isFinite(numPrice) || numPrice < 0) {
        const error = new Error("Price must be a number >= 0");
        error.status = 400;
        throw error;
    }

    return numPrice;
}

export function normalizeCurrency(currency) {
    if (!currency || !ALLOWED_CURRENCY.includes(currency)) {
        return "UAH";
    }

    return currency;
}

export function validateCategoryId(categoryId) {
    if (!categoryId || !isValidObjectId(categoryId)) {
        const error = new Error("Invalid categoryId");
        error.status = 400;
        throw error;
    }

    return categoryId;
}

export function normalizeBadges(badges) {
    const badgesArr = Array.isArray(badges) ? badges : (badges ? [badges] : []);
    return badgesArr.filter((b) => ALLOWED_BADGES.includes(b));
}

export function normalizeImages(images) {
    const imagesArr = Array.isArray(images) ? images : (images ? [images] : []);
    return imagesArr.map(String).map((s) => s.trim()).filter(Boolean);
}