import * as sellerProfilesRepository from "./sellerProfiles.repository.js";
import { toPublicSellerProfileDto, toSellerProfileResponseDto } from "./dto/sellerProfiles.dto.js";
import Product from "../products/entities/products.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

function normalizeSlug(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(slug, userId = null) {
    if (!slug) return;

    const existing = await sellerProfilesRepository.findBySlug(slug);

    if (!existing) return;

    const sameOwner = userId && String(existing.user) === String(userId);
    if (sameOwner) return;

    const error = new Error("Store slug is already taken");
    error.status = 400;
    throw error;
}

export async function createMySellerProfile(userId, body = {}) {
    const exists = await sellerProfilesRepository.findByUserId(userId);

    if (exists) {
        const error = new Error("Seller profile already exists");
        error.status = 400;
        throw error;
    }

    const storeSlug = normalizeSlug(body.storeSlug || "");

    if (storeSlug) {
        await ensureUniqueSlug(storeSlug, userId);
    }

    const profile = await sellerProfilesRepository.createSellerProfile({
        user: userId,
        displayName: body.displayName || "",
        storeSlug,
        avatarUrl: body.avatarUrl || "",
        bannerUrl: body.bannerUrl || "",
        about: body.about || "",
        contacts: body.contacts || {},
        socials: body.socials || {},
        delivery: body.delivery || {},
        payment: body.payment || {},
        payout: body.payout || {},
        isPublic: body.isPublic ?? true,
    });

    return toSellerProfileResponseDto(profile);
}

export async function getOrCreateMySellerProfile(userId) {
    let profile = await sellerProfilesRepository.findByUserId(userId);

    if (!profile) {
        profile = await sellerProfilesRepository.createSellerProfile({
            user: userId
        });

        profile = await sellerProfilesRepository.findByUserId(userId);
    }

    return toSellerProfileResponseDto(profile);
}

export async function getMySellerProfile(userId) {
    const profile = await sellerProfilesRepository.findByUserId(userId);

    if (!profile) {
        const error = new Error("Seller profile not found");
        error.status = 404;
        throw error;
    }

    return toSellerProfileResponseDto(profile);
}

export async function updateMySellerProfile(userId, body = {}) {
    const allowedFields = [
        "displayName",
        "storeSlug",
        "avatarUrl",
        "bannerUrl",
        "about",
        "contacts",
        "socials",
        "delivery",
        "payment",
        "payout",
        "isPublic"
    ];

    const patch = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            patch[field] = body[field];
        }
    }

    if (patch.storeSlug !== undefined) {
        patch.storeSlug = normalizeSlug(patch.storeSlug);

        if (patch.storeSlug) {
            await ensureUniqueSlug(patch.storeSlug, userId);
        }
    }

    const updated = await sellerProfilesRepository.updateByUserId(userId, patch);

    if (!updated) {
        const error = new Error("Seller profile not found");
        error.status = 404;
        throw error;
    }

    return toSellerProfileResponseDto(updated);
}

export async function getPublicSellerProfileBySlug(slug) {
    const normalizedSlug = normalizeSlug(slug);
    const profile = await sellerProfilesRepository.findPublicBySlug(normalizedSlug);

    if (!profile) {
        const error = new Error("Seller not found");
        error.status = 404;
        throw error;
    }

    const productsCount = await Product.countDocuments({
        seller: profile.user._id,
        status: "active"
    });

    return toPublicSellerProfileDto(profile, { productsCount });
}

export async function getPublicSellerProfileByUserId(userId) {
    const profile = await sellerProfilesRepository.findPublicByUserId(userId);

    if (!profile) {
        const error = new Error("Seller not found");
        error.status = 404;
        throw error;
    }

    const productsCount = await Product.countDocuments({
        seller: profile.user._id,
        status: "active"
    });

    return toPublicSellerProfileDto(profile, { productsCount });
}

export async function getPublicSellerProductsBySlug(slug) {
    const normalizedSlug = normalizeSlug(slug);
    const profile = await sellerProfilesRepository.findPublicBySlug(normalizedSlug);

    if (!profile) {
        const error = new Error("Seller not found");
        error.status = 404;
        throw error;
    }

    const products = await Product.find({
        seller: profile.user._id,
        status: "active"
    })
        .sort({ createdAt: -1 })
        .populate("categoryId", "name slug icon");

    return products;
}

export async function uploadMySellerAvatar(userId, file) {
    if (!file) {
        const error = new Error("Avatar file is required");
        error.status = 400;
        throw error;
    }

    const profile = await sellerProfilesRepository.findByUserId(userId);

    if (!profile) {
        const error = new Error("Seller profile not found");
        error.status = 404;
        throw error;
    }

    const uploaded = await uploadBufferToCloudinary(file.buffer, {
        folder: "seller-profiles/avatars",
        transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "auto" }
        ],
    });

    if (profile.avatarPublicId) {
        await deleteFromCloudinary(profile.avatarPublicId);
    }

    const updated = await sellerProfilesRepository.updateByUserId(userId, {
        avatarUrl: uploaded.secure_url,
        avatarPublicId: uploaded.public_id,
    });

    return toSellerProfileResponseDto(updated);
}

export async function uploadMySellerBanner(userId, file) {
    if (!file) {
        const error = new Error("Banner file is required");
        error.status = 400;
        throw error;
    }

    const profile = await sellerProfilesRepository.findByUserId(userId);

    if (!profile) {
        const error = new Error("Seller profile not found");
        error.status = 404;
        throw error;
    }

    const uploaded = await uploadBufferToCloudinary(file.buffer, {
        folder: "seller-profiles/banners",
        transformation: [
            { width: 1400, height: 500, crop: "fill", gravity: "auto" }
        ],
    });

    if (profile.bannerPublicId) {
        await deleteFromCloudinary(profile.bannerPublicId);
    }

    const updated = await sellerProfilesRepository.updateByUserId(userId, {
        bannerUrl: uploaded.secure_url,
        bannerPublicId: uploaded.public_id,
    });

    return toSellerProfileResponseDto(updated);
}