import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireSeller } from "../middleware/requireSeller.js";
import { loadSellerProfile } from "../middleware/loadSellerProfile.js";
import { upload } from "../middleware/upload.js";
import {
    listMyProducts,
    createMyProduct,
    getMyProductById,
    updateMyProduct,
    deleteMyProduct,
} from "./sellerProducts.controller.js";

const router = Router();

router.get("/", requireAuth, requireSeller, listMyProducts);

router.post(
    "/",
    requireAuth,
    requireSeller,
    loadSellerProfile,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 8 },
    ]),
    createMyProduct
);

router.get("/:id", requireAuth, requireSeller, getMyProductById);

router.put("/:id", requireAuth, requireSeller, updateMyProduct);

router.delete("/:id", requireAuth, requireSeller, deleteMyProduct);

export default router;