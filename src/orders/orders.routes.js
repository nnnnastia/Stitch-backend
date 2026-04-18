import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
    createOrder,
    getMyOrders,
    getOrderById,
} from "./orders.controller.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/me", requireAuth, getMyOrders);
router.get("/:orderId", requireAuth, getOrderById);

export default router;