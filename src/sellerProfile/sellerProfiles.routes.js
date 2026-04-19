import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireSeller } from "../middleware/requireSeller.js";
import {
    createMySellerProfile,
    getMySellerProfile,
    updateMySellerProfile,
    getPublicSellerProfileBySlug,
    getPublicSellerProfileByUserId,
    getPublicSellerProductsBySlug
} from "./sellerProfiles.controller.js";

const router = Router();

// private
router.post("/me", requireAuth, requireSeller, createMySellerProfile);
router.get("/me", requireAuth, requireSeller, getMySellerProfile);
router.patch("/me", requireAuth, requireSeller, updateMySellerProfile);

// public
router.get("/public/slug/:slug", getPublicSellerProfileBySlug);
router.get("/public/user/:userId", getPublicSellerProfileByUserId);
router.get("/public/slug/:slug/products", getPublicSellerProductsBySlug);

export default router;