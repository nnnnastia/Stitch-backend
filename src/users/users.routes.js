import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
    getMe,
    updateMe,
    updateMyPassword,
    updateMyAvatar,
} from "./users.controller.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);
router.patch("/me/password", requireAuth, updateMyPassword);
router.patch("/me/avatar", requireAuth, upload.single("avatar"), updateMyAvatar);

export default router;