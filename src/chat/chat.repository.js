import Conversation from "./entities/conversation.model.js";

const conversationPopulate = [
    { path: "buyer", select: "userName userSurname avatarUrl role" },
    { path: "seller", select: "userName userSurname avatarUrl role" },
    { path: "product", select: "title price coverImage" },
];

export async function findConversationByParticipants({
    buyerId,
    sellerId,
    productId = null,
    orderId = null,
    sourceType,
}) {
    return Conversation.findOne({
        buyer: buyerId,
        seller: sellerId,
        product: sourceType === "product" ? productId : null,
        order: sourceType === "order" ? orderId : null,
        sourceType,
    });
}

export async function findConversationByOrder({
    buyerId,
    sellerId,
    orderId,
    sourceType,
}) {
    return Conversation.findOne({
        buyer: buyerId,
        seller: sellerId,
        order: orderId,
        sourceType,
    });
}

export async function findAnyConversationBetweenUsers({ buyerId, sellerId }) {
    return Conversation.findOne({
        buyer: buyerId,
        seller: sellerId,
    }).sort({ updatedAt: -1 });
}

export async function createConversation({
    buyer,
    seller,
    product = null,
    order = null,
    sourceType,
}) {
    return Conversation.create({
        buyer,
        seller,
        product,
        order,
        sourceType,
        buyerUnreadCount: 0,
        sellerUnreadCount: 0,
    });
}

export async function getConversationById(id) {
    return Conversation.findById(id).populate(conversationPopulate);
}

export async function getUserConversations(userId) {
    return Conversation.find({
        $or: [{ buyer: userId }, { seller: userId }],
    })
        .populate(conversationPopulate)
        .sort({ lastMessageAt: -1, updatedAt: -1 });
}

export async function updateConversationAfterMessage(conversationId, update) {
    return Conversation.findByIdAndUpdate(conversationId, update, { new: true });
}