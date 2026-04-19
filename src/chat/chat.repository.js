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
    sourceType,
}) {
    return Conversation.findOne({
        buyer: buyerId,
        seller: sellerId,
        sourceType,
        product: sourceType === "product" ? productId : null,
    });
}

export async function createConversation(data) {
    return Conversation.create(data);
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