import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    trackView,
    getMyRecommendations
} from "./recommendations.controller.js";

const router = Router();

router.post("/track-view/:productId", requireAuth, trackView);
router.get("/me", requireAuth, getMyRecommendations);

export default router;