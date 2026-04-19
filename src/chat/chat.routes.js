import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { chatUpload } from "../middleware/upload.js";
import {
    createOrOpenConversation,
    getMyConversations,
    getConversationById,
    getConversationMessages,
    sendMessage,
    markConversationAsRead,
    getUnreadCount,
} from "./chat.controller.js";

const router = Router();

router.post("/conversations", requireAuth, createOrOpenConversation);
router.get("/conversations", requireAuth, getMyConversations);
router.get("/conversations/:conversationId", requireAuth, getConversationById);
router.get("/conversations/:conversationId/messages", requireAuth, getConversationMessages);

router.post(
    "/conversations/:conversationId/messages",
    requireAuth,
    chatUpload.array("images", 3),
    sendMessage
);

router.post("/conversations/:conversationId/read", requireAuth, markConversationAsRead);
router.get("/unread-count", requireAuth, getUnreadCount);

export default router;