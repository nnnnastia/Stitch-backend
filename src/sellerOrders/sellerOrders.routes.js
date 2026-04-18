import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireSeller } from "../middleware/requireSeller.js";
import {
    getSellerOrders,
    getSellerOrderById,
    updateSellerOrderStatus,
} from "./sellerOrders.controller.js";

const router = Router();

router.get("/", requireAuth, requireSeller, getSellerOrders);
router.get("/:orderId", requireAuth, requireSeller, getSellerOrderById);
router.patch("/:orderId/status", requireAuth, requireSeller, updateSellerOrderStatus);

export default router;