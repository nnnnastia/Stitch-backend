import mongoose from "mongoose";
import * as ordersService from "./orders.service.js";

export async function createOrder(req, res, next) {
    try {
        const order = await ordersService.createOrder(req.user.id, req.body);

        res.status(201).json({
            message: "Замовлення оформлено успішно",
            order,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyOrders(req, res, next) {
    try {
        const orders = await ordersService.getMyOrders(req.user.id);
        res.json({ orders });
    } catch (error) {
        next(error);
    }
}

export async function getOrderById(req, res, next) {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Некоректний id замовлення" });
        }

        const order = await ordersService.getOrderById(req.user.id, orderId);

        if (!order) {
            return res.status(404).json({ message: "Замовлення не знайдено" });
        }

        res.json({ order });
    } catch (error) {
        next(error);
    }
}