import * as sellerProductsRepository from "./sellerProducts.repository.js";
import {
    isValidObjectId,
    normalizeTitle,
    normalizePrice,
    normalizeCurrency,
    validateCategoryId,
    normalizeBadges,
    normalizeImages,
} from "./sellerProducts.utils.js";
import {
    toSellerProductDto,
    toSellerProductsListDto,
} from "./dto/sellerProducts.dto.js";
import { ALLOWED_CURRENCY } from "./sellerProducts.constants.js";

export async function listMyProducts(userId, query) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 12);
    const q = query.q || "";

    const skip = (page - 1) * limit;

    const { items, total } = await sellerProductsRepository.findManyBySeller({
        sellerId: userId,
        q,
        skip,
        limit,
    });

    return toSellerProductsListDto(items, total, page, limit);
}

export async function createMyProduct(userId, sellerProfile, body, files) {
    if (!sellerProfile) {
        const error = new Error("Seller profile not found");
        error.status = 403;
        throw error;
    }

    if (sellerProfile.status !== "active") {
        const error = new Error("Seller is not active yet");
        error.status = 403;
        throw error;
    }

    const title = normalizeTitle(body.title);
    const price = normalizePrice(body.price);
    const currency = normalizeCurrency(body.currency);
    const categoryId = validateCategoryId(body.categoryId);
    const badges = normalizeBadges(body.badges);

    const coverFile = files?.coverImage?.[0];
    if (!coverFile) {
        const error = new Error("coverImage file is required");
        error.status = 400;
        throw error;
    }

    const coverImage = `/uploads/${coverFile.filename}`;
    const imagesFiles = files?.images || [];
    const images = imagesFiles.map((f) => `/uploads/${f.filename}`);

    const product = await sellerProductsRepository.createProduct({
        title,
        price,
        currency,
        coverImage,
        images,
        badges,
        categoryId,
        description: body.description ? String(body.description) : "",
        seller: userId,
    });

    return toSellerProductDto(product);
}

export async function getMyProductById(userId, productId) {
    if (!isValidObjectId(productId)) {
        const error = new Error("Invalid id");
        error.status = 400;
        throw error;
    }

    const product = await sellerProductsRepository.findOneBySellerAndId(productId, userId);

    if (!product) {
        const error = new Error("Not found");
        error.status = 404;
        throw error;
    }

    return toSellerProductDto(product);
}

export async function updateMyProduct(userId, productId, body) {
    if (!isValidObjectId(productId)) {
        const error = new Error("Invalid id");
        error.status = 400;
        throw error;
    }

    const allowedFields = [
        "title",
        "price",
        "currency",
        "coverImage",
        "images",
        "badges",
        "categoryId",
        "description",
    ];

    const patch = {};

    for (const key of allowedFields) {
        if (body[key] !== undefined) {
            patch[key] = body[key];
        }
    }

    if (patch.title !== undefined) {
        if (!String(patch.title).trim()) {
            const error = new Error("Title can't be empty");
            error.status = 400;
            throw error;
        }
        patch.title = String(patch.title).trim();
    }

    if (patch.price !== undefined) {
        patch.price = normalizePrice(patch.price);
    }

    if (patch.currency !== undefined) {
        if (!ALLOWED_CURRENCY.includes(patch.currency)) {
            const error = new Error("Invalid currency");
            error.status = 400;
            throw error;
        }
    }

    if (patch.categoryId !== undefined) {
        validateCategoryId(patch.categoryId);
    }

    if (patch.coverImage !== undefined) {
        if (!String(patch.coverImage).trim()) {
            const error = new Error("coverImage can't be empty");
            error.status = 400;
            throw error;
        }
        patch.coverImage = String(patch.coverImage).trim();
    }

    if (patch.images !== undefined) {
        patch.images = normalizeImages(patch.images);
    }

    if (patch.badges !== undefined) {
        patch.badges = normalizeBadges(patch.badges);
    }

    const updated = await sellerProductsRepository.updateOneBySellerAndId(
        productId,
        userId,
        patch
    );

    if (!updated) {
        const error = new Error("Not found");
        error.status = 404;
        throw error;
    }

    return toSellerProductDto(updated);
}

export async function deleteMyProduct(userId, productId) {
    if (!isValidObjectId(productId)) {
        const error = new Error("Invalid id");
        error.status = 400;
        throw error;
    }

    const deleted = await sellerProductsRepository.deleteOneBySellerAndId(productId, userId);

    if (!deleted) {
        const error = new Error("Not found");
        error.status = 404;
        throw error;
    }

    return { ok: true };
}