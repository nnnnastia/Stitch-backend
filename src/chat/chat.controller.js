import {
    createOrOpenConversationService,
    getMyConversationsService,
    getConversationByIdService,
    getConversationMessagesService,
    sendMessageService,
    markConversationAsReadService,
    getUnreadCountService,
} from "./chat.service.js";

export async function createOrOpenConversation(req, res, next) {
    try {
        const conversation = await createOrOpenConversationService(req.user.id, req.body);
        res.status(200).json(conversation);
    } catch (error) {
        next(error);
    }
}

export async function getMyConversations(req, res, next) {
    try {
        const conversations = await getMyConversationsService(req.user.id);
        res.json({ items: conversations });
    } catch (error) {
        next(error);
    }
}

export async function getConversationById(req, res, next) {
    try {
        const conversation = await getConversationByIdService(
            req.user.id,
            req.params.conversationId
        );

        res.json(conversation);
    } catch (error) {
        next(error);
    }
}

export async function getConversationMessages(req, res, next) {
    try {
        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 20;

        const result = await getConversationMessagesService(
            req.user.id,
            req.params.conversationId,
            { page, limit }
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function sendMessage(req, res, next) {
    try {
        const message = await sendMessageService(
            req.user.id,
            req.params.conversationId,
            req.body,
            req.files || []
        );

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}

export async function markConversationAsRead(req, res, next) {
    try {
        const result = await markConversationAsReadService(
            req.user.id,
            req.params.conversationId
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getUnreadCount(req, res, next) {
    try {
        const result = await getUnreadCountService(req.user.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}