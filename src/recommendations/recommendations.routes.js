import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { trackView, getMyRecommendations, getPopular, trackPublicView } from "./recommendations.controller.js";

const router = Router();

router.post("/track-view/:productId", requireAuth, trackView);
router.get("/me", requireAuth, getMyRecommendations);
router.get("/popular", getPopular);
router.post("/view/:productId", trackPublicView);

export default router;