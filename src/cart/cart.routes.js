import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as cartController from "./cart.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", cartController.getMyCart);
router.post("/items", cartController.addItemToCart);
router.patch("/items/:productId", cartController.updateItemQuantity);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;