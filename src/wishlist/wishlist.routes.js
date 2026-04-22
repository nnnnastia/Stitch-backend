import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    getMyWishlistController,
    addToWishlistController,
    removeFromWishlistController,
    toggleWishlistItemController,
} from "./wishlist.controller.js";

const router = Router();

router.get("/me", requireAuth, getMyWishlistController);
router.post("/items", requireAuth, addToWishlistController);
router.post("/toggle", requireAuth, toggleWishlistItemController);
router.delete("/items/:productId", requireAuth, removeFromWishlistController);

export default router;