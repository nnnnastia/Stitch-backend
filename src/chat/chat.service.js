import mongoose from "mongoose";
import Product from "../products/entities/products.model.js";
import User from "../users/entities/user.model.js";
import {
    findConversationByParticipants,
    createConversation,
    getConversationById,
    getUserConversations,
    updateConversationAfterMessage,
} from "./chat.repository.js";
import Conversation from "./entities/conversation.model.js";
import Message from "./entities/message.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export async function createOrOpenConversationService(currentUserId, payload) {
    const { sellerId, productId = null, sourceType } = payload;

    if (!sellerId) {
        throw new Error("Seller id is required");
    }

    if (!["product", "shop"].includes(sourceType)) {
        throw new Error("Invalid source type");
    }

    if (String(currentUserId) === String(sellerId)) {
        throw new Error("You cannot create conversation with yourself");
    }

    const seller = await User.findById(sellerId);
    if (!seller) {
        throw new Error("Seller not found");
    }

    if (seller.role !== "seller") {
        throw new Error("Target user is not a seller");
    }

    if (sourceType === "product") {
        if (!productId) {
            throw new Error("Product id is required for product conversation");
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (String(product.seller) !== String(sellerId)) {
            throw new Error("Product does not belong to seller");
        }
    }

    let conversation = await findConversationByParticipants({
        buyerId: currentUserId,
        sellerId,
        productId: sourceType === "product" ? productId : null,
        sourceType,
    });

    if (!conversation) {
        conversation = await createConversation({
            buyer: currentUserId,
            seller: sellerId,
            product: sourceType === "product" ? productId : null,
            sourceType,
        });
    }

    return getConversationById(conversation._id);
}

export async function getMyConversationsService(currentUserId) {
    return getUserConversations(currentUserId);
}

export async function getConversationByIdService(currentUserId, conversationId) {
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const isParticipant =
        String(conversation.buyer._id) === String(currentUserId) ||
        String(conversation.seller._id) === String(currentUserId);

    if (!isParticipant) {
        throw new Error("Access denied");
    }

    return conversation;
}

export async function sendMessageService(currentUserId, conversationId, { text }, files = []) {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const isBuyer = String(conversation.buyer) === String(currentUserId);
    const isSeller = String(conversation.seller) === String(currentUserId);

    if (!isBuyer && !isSeller) {
        throw new Error("Access denied");
    }

    if (files.length > 3) {
        throw new Error("Максимум 3 зображення");
    }

    const normalizedText = (text || "").trim();

    if (normalizedText.length > 5000) {
        throw new Error("Повідомлення занадто довге");
    }

    if (!normalizedText && files.length === 0) {
        throw new Error("Message cannot be empty");
    }

    const attachments = [];

    for (const file of files) {
        try {
            const uploaded = await uploadBufferToCloudinary(file.buffer, {
                folder: "chat/messages",
                resource_type: "image",
            });

            attachments.push({
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            });
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            throw new Error("Помилка завантаження зображення");
        }
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: currentUserId,
        text: normalizedText,
        attachments,
        isRead: false,
    });

    let lastMessageText = "";

    if (normalizedText) {
        lastMessageText = normalizedText;
    } else if (attachments.length > 0) {
        lastMessageText = "📷 Зображення";
    }

    const update = {
        $set: {
            lastMessageText,
            lastMessageAt: message.createdAt,
            lastMessageSender: currentUserId,
        },
        $inc: isBuyer
            ? { sellerUnreadCount: 1 }
            : { buyerUnreadCount: 1 },
    };

    await updateConversationAfterMessage(conversationId, update);

    await message.populate("sender", "userName userSurname avatarUrl role");

    return message;
}

export async function markConversationAsReadService(currentUserId, conversationId) {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const isBuyer = String(conversation.buyer) === String(currentUserId);
    const isSeller = String(conversation.seller) === String(currentUserId);

    if (!isBuyer && !isSeller) {
        throw new Error("Access denied");
    }

    await Message.updateMany(
        {
            conversation: conversationId,
            sender: { $ne: currentUserId },
            isRead: false,
        },
        {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        }
    );

    await Conversation.findByIdAndUpdate(conversationId, {
        $set: isBuyer ? { buyerUnreadCount: 0 } : { sellerUnreadCount: 0 },
    });

    return { success: true };
}

export async function getUnreadCountService(currentUserId) {
    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    const result = await Conversation.aggregate([
        {
            $match: {
                $or: [{ buyer: userObjectId }, { seller: userObjectId }],
            },
        },
        {
            $project: {
                unread: {
                    $cond: [
                        { $eq: ["$buyer", userObjectId] },
                        "$buyerUnreadCount",
                        "$sellerUnreadCount",
                    ],
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$unread" },
            },
        },
    ]);

    return { count: result[0]?.total || 0 };
}

export async function getConversationMessagesService(currentUserId, conversationId, { page, limit }) {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const isParticipant =
        String(conversation.buyer) === String(currentUserId) ||
        String(conversation.seller) === String(currentUserId);

    if (!isParticipant) {
        throw new Error("Access denied");
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
        Message.find({ conversation: conversationId })
            .populate("sender", "userName userSurname avatarUrl role")
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(safeLimit),
        Message.countDocuments({ conversation: conversationId }),
    ]);

    return {
        items,
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
    };
}