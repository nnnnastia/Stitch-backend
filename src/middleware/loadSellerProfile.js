import * as sellerProfilesRepository from "../sellerProfile/sellerProfiles.repository.js";

export async function loadSellerProfile(req, res, next) {
    try {
        const sellerProfile = await sellerProfilesRepository.findByUserId(req.user._id);
        req.sellerProfile = sellerProfile;
        next();
    } catch (error) {
        next(error);
    }
}