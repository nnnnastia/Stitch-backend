import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { getMe, updateMe } from "./users.controller.js";

const router = Router();

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, upload.single('avatar'), updateMe);

export default router;