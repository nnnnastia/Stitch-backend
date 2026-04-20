import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getSellerRating,
} from "./reviews.controller.js";

const router = Router();

router.get("/product/:productId", getProductReviews);
router.post("/product/:productId", requireAuth, createReview);
router.patch("/:reviewId", requireAuth, updateReview);
router.delete("/:reviewId", requireAuth, deleteReview);

router.get("/seller/:sellerId/rating", getSellerRating);

export default router;