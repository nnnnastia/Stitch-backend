import * as paymentsService from "./payments.service.js";

export async function createCheckoutSession(req, res, next) {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        const result = await paymentsService.createCheckoutSession(orderId, userId);

        res.json(result);
    } catch (error) {
        next(error);
    }
}