import { Router } from "express";
import { createCheckoutSession } from "./payments.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/create-checkout-session", requireAuth, createCheckoutSession);

export default router;