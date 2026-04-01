import { Router } from "express";
import { listCategories, getCategoryBySlug } from "./categories.controller.js";

const router = Router();

router.get("/", listCategories);
router.get("/slug/:slug", getCategoryBySlug);

export default router;