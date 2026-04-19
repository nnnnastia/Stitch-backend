export function toConversationDto(conversation, currentUserId) {
    const isBuyer = String(conversation.buyer?._id || conversation.buyer) === String(currentUserId);

    const partner = isBuyer ? conversation.seller : conversation.buyer;
    const unreadCount = isBuyer
        ? conversation.buyerUnreadCount || 0
        : conversation.sellerUnreadCount || 0;

    return {
        id: conversation._id,
        sourceType: conversation.sourceType,
        product: conversation.product
            ? {
                id: conversation.product._id,
                title: conversation.product.title,
                price: conversation.product.price,
                coverImage: conversation.product.coverImage,
            }
            : null,
        partner: partner
            ? {
                id: partner._id,
                userName: partner.userName,
                userSurname: partner.userSurname,
                avatarUrl: partner.avatarUrl,
                role: partner.role,
            }
            : null,
        lastMessageText: conversation.lastMessageText,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };
}

export function toMessageDto(message) {
    return {
        id: message._id,
        conversationId: message.conversation,
        sender: message.sender
            ? {
                id: message.sender._id,
                userName: message.sender.userName,
                userSurname: message.sender.userSurname,
                avatarUrl: message.sender.avatarUrl,
                role: message.sender.role,
            }
            : null,
        text: message.text,
        attachments: message.attachments || [],
        isRead: message.isRead,
        readAt: message.readAt,
        createdAt: message.createdAt,
    };
}