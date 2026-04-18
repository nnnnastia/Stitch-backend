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
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
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

    const uploadedCover = await uploadBufferToCloudinary(coverFile.buffer, {
        folder: "marketplace/products/covers",
        transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    });

    const imagesFiles = files?.images || [];
    const uploadedImages = await Promise.all(
        imagesFiles.map((file) =>
            uploadBufferToCloudinary(file.buffer, {
                folder: "marketplace/products/gallery",
                transformation: [{ width: 1200, height: 1200, crop: "limit" }],
            })
        )
    );

    const product = await sellerProductsRepository.createProduct({
        title,
        price,
        currency,
        coverImage: uploadedCover.secure_url,
        coverImagePublicId: uploadedCover.public_id,
        images: uploadedImages.map((item) => item.secure_url),
        imagePublicIds: uploadedImages.map((item) => item.public_id),
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

export async function updateMyProduct(userId, productId, body, files) {
    if (!isValidObjectId(productId)) {
        const error = new Error("Invalid id");
        error.status = 400;
        throw error;
    }

    const existingProduct = await sellerProductsRepository.findOneBySellerAndId(
        productId,
        userId
    );

    if (!existingProduct) {
        const error = new Error("Not found");
        error.status = 404;
        throw error;
    }

    const patch = {};

    if (body.title !== undefined) {
        patch.title = normalizeTitle(body.title);
    }

    if (body.price !== undefined) {
        patch.price = normalizePrice(body.price);
    }

    if (body.currency !== undefined) {
        if (!ALLOWED_CURRENCY.includes(body.currency)) {
            const error = new Error("Invalid currency");
            error.status = 400;
            throw error;
        }
        patch.currency = body.currency;
    }

    if (body.categoryId !== undefined) {
        patch.categoryId = validateCategoryId(body.categoryId);
    }

    if (body.badges !== undefined) {
        patch.badges = normalizeBadges(body.badges);
    }

    if (body.description !== undefined) {
        patch.description = String(body.description || "");
    }

    const coverFile = files?.coverImage?.[0];
    if (coverFile) {
        if (existingProduct.coverImagePublicId) {
            await deleteFromCloudinary(existingProduct.coverImagePublicId);
        }

        const uploadedCover = await uploadBufferToCloudinary(coverFile.buffer, {
            folder: "marketplace/products/covers",
            transformation: [{ width: 1200, height: 1200, crop: "limit" }],
        });

        patch.coverImage = uploadedCover.secure_url;
        patch.coverImagePublicId = uploadedCover.public_id;
    }

    const imageFiles = files?.images || [];
    if (imageFiles.length > 0) {
        if (
            Array.isArray(existingProduct.imagePublicIds) &&
            existingProduct.imagePublicIds.length
        ) {
            await Promise.all(
                existingProduct.imagePublicIds.map((publicId) =>
                    deleteFromCloudinary(publicId)
                )
            );
        }

        const uploadedImages = await Promise.all(
            imageFiles.map((file) =>
                uploadBufferToCloudinary(file.buffer, {
                    folder: "marketplace/products/gallery",
                    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
                })
            )
        );

        patch.images = uploadedImages.map((item) => item.secure_url);
        patch.imagePublicIds = uploadedImages.map((item) => item.public_id);
    }

    const updated = await sellerProductsRepository.updateOneBySellerAndId(
        productId,
        userId,
        patch
    );

    return toSellerProductDto(updated);
}

export async function deleteMyProduct(userId, productId) {
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

    if (product.coverImagePublicId) {
        await deleteFromCloudinary(product.coverImagePublicId);
    }

    if (Array.isArray(product.imagePublicIds) && product.imagePublicIds.length) {
        await Promise.all(
            product.imagePublicIds.map((publicId) =>
                deleteFromCloudinary(publicId)
            )
        );
    }

    await sellerProductsRepository.deleteOneBySellerAndId(productId, userId);

    return { ok: true };
}