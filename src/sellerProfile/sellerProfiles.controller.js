import * as sellerProfilesService from "./sellerProfiles.service.js";

export async function createMySellerProfile(req, res, next) {
    try {
        const profile = await sellerProfilesService.createMySellerProfile(req.user._id, req.body);
        return res.status(201).json({ profile });
    } catch (error) {
        next(error);
    }
}

export async function getMySellerProfile(req, res, next) {
    try {
        const profile = await sellerProfilesService.getMySellerProfile(req.user._id);
        return res.status(200).json({ profile });
    } catch (error) {
        next(error);
    }
}

export async function updateMySellerProfile(req, res, next) {
    try {
        const profile = await sellerProfilesService.updateMySellerProfile(req.user._id, req.body);
        return res.status(200).json({ profile });
    } catch (error) {
        next(error);
    }
}