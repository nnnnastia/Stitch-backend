import SellerProfile from "./entities/sellerProfile.model.js";

export async function findByUserId(userId) {
    return SellerProfile.findOne({ user: userId });
}

export async function createSellerProfile(data) {
    return SellerProfile.create(data);
}

export async function updateByUserId(userId, updateData) {
    return SellerProfile.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );
}