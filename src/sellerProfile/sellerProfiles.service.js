import * as sellerProfilesRepository from "./sellerProfiles.repository.js";
import { toSellerProfileResponseDto } from "./dto/sellerProfiles.dto.js";

export async function createMySellerProfile(userId, body) {
    const exists = await sellerProfilesRepository.findByUserId(userId);

    if (exists) {
        const error = new Error("Seller profile already exists");
        error.status = 400;
        throw error;
    }

    const profile = await sellerProfilesRepository.createSellerProfile({
        user: userId,
        displayName: body.displayName || "",
        about: body.about || "",
        contacts: body.contacts || {},
        delivery: body.delivery || {},
        payment: body.payment || {},
    });

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

export async function updateMySellerProfile(userId, body) {
    const allowedFields = ["displayName", "about", "contacts", "delivery", "payment", "payout"];
    const patch = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            patch[field] = body[field];
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