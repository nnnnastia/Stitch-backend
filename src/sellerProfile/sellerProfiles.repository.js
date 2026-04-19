import SellerProfile from "./entities/sellerProfile.model.js";

export async function createSellerProfile(data) {
    return SellerProfile.create(data);
}

export async function findByUserId(userId) {
    return SellerProfile.findOne({ user: userId }).populate("user", "userName userSurname email avatarUrl");
}

export async function updateByUserId(userId, patch) {
    return SellerProfile.findOneAndUpdate(
        { user: userId },
        { $set: patch },
        { new: true, runValidators: true }
    ).populate("user", "userName userSurname email avatarUrl");
}

export async function findPublicBySlug(slug) {
    return SellerProfile.findOne({
        storeSlug: slug,
        status: "active",
        isPublic: true
    }).populate("user", "userName userSurname avatarUrl");
}

export async function findPublicByUserId(userId) {
    return SellerProfile.findOne({
        user: userId,
        status: "active",
        isPublic: true
    }).populate("user", "userName userSurname avatarUrl");
}

export async function findBySlug(slug) {
    return SellerProfile.findOne({ storeSlug: slug });
}