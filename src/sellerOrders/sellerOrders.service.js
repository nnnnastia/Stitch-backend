import mongoose from "mongoose";
import { sellerOrdersRepository } from "./sellerOrders.repository.js";
import { mapSellerOrder } from "./sellerOrders.mapper.js";

export const sellerOrdersService = {
    async getSellerOrders(sellerId) {
        const orders = await sellerOrdersRepository.findSellerOrders(sellerId);

        return orders.map((order) => mapSellerOrder(order, sellerId));
    },

    async getSellerOrderById(orderId, sellerId) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            const error = new Error("Некоректний ID замовлення");
            error.status = 400;
            throw error;
        }

        const order = await sellerOrdersRepository.findSellerOrderById(orderId, sellerId);

        if (!order) {
            const error = new Error("Замовлення не знайдено");
            error.status = 404;
            throw error;
        }

        return mapSellerOrder(order, sellerId);
    },

    async updateSellerOrderStatus(orderId, sellerId, status) {
        const allowedStatuses = ["confirmed", "shipped", "completed", "cancelled"];

        if (!allowedStatuses.includes(status)) {
            const error = new Error("Недопустимий статус");
            error.status = 400;
            throw error;
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            const error = new Error("Некоректний ID замовлення");
            error.status = 400;
            throw error;
        }

        const order = await sellerOrdersRepository.findSellerOrderById(orderId, sellerId);

        if (!order) {
            const error = new Error("Замовлення не знайдено");
            error.status = 404;
            throw error;
        }

        order.status = status;
        await sellerOrdersRepository.save(order);

        return mapSellerOrder(order, sellerId);
    },
};