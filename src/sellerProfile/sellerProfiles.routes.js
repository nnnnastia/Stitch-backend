import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireSeller } from "../middleware/requireSeller.js";
import {
    createMySellerProfile,
    getMySellerProfile,
    updateMySellerProfile
} from "./sellerProfiles.controller.js";

const router = Router();

router.post("/me", requireAuth, createMySellerProfile);
router.get("/me", requireAuth, requireSeller, getMySellerProfile);
router.patch("/me", requireAuth, requireSeller, updateMySellerProfile);

export default router;