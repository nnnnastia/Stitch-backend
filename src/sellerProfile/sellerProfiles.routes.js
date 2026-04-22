import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireSeller } from "../middleware/requireSeller.js";
import {
    createMySellerProfile,
    getMySellerProfile,
    updateMySellerProfile,
    getPublicSellerProfileBySlug,
    getPublicSellerProfileByUserId,
    getPublicSellerProductsBySlug,
    uploadMySellerAvatar,
    uploadMySellerBanner,
} from "./sellerProfiles.controller.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// private
router.post("/me", requireAuth, requireSeller, createMySellerProfile);
router.get("/me", requireAuth, requireSeller, getMySellerProfile);
router.patch("/me", requireAuth, requireSeller, updateMySellerProfile);

// public
router.get("/public/slug/:slug", getPublicSellerProfileBySlug);
router.get("/public/user/:userId", getPublicSellerProfileByUserId);
router.get("/public/slug/:slug/products", getPublicSellerProductsBySlug);

router.patch(
    "/me/avatar",
    requireAuth,
    upload.single("avatar"),
    uploadMySellerAvatar
);

router.patch(
    "/me/banner",
    requireAuth,
    upload.single("banner"),
    uploadMySellerBanner
);


export default router;