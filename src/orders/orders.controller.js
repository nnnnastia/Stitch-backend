import mongoose from "mongoose";
import Order from "./entities/order.model.js";
import Cart from "../cart/entities/cart.model.js";

function validateCreateOrderPayload(paymentMethod, delivery) {
    if (!paymentMethod) {
        const error = new Error("Не вказано спосіб оплати");
        error.statusCode = 400;
        throw error;
    }

    if (!["cod", "card"].includes(paymentMethod)) {
        const error = new Error("Непідтримуваний спосіб оплати");
        error.statusCode = 400;
        throw error;
    }

    if (!delivery) {
        const error = new Error("Не вказано дані доставки");
        error.statusCode = 400;
        throw error;
    }

    const requiredFields = [
        "provider",
        "cityId",
        "cityName",
        "warehouseId",
        "warehouseName",
        "recipientFullName",
        "recipientPhone",
    ];

    for (const field of requiredFields) {
        if (!delivery[field]) {
            const error = new Error(`Поле delivery.${field} є обов’язковим`);
            error.statusCode = 400;
            throw error;
        }
    }

    if (delivery.provider !== "nova_poshta") {
        const error = new Error("Підтримується лише доставка Новою поштою");
        error.statusCode = 400;
        throw error;
    }
}

export async function createOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const { paymentMethod, delivery } = req.body;

        validateCreateOrderPayload(paymentMethod, delivery);

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: "Кошик порожній" });
        }

        const validCartItems = cart.items.filter((item) => item.product);

        if (!validCartItems.length) {
            return res.status(400).json({ message: "У кошику немає доступних товарів" });
        }

        const items = validCartItems.map((item) => ({
            product: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            coverImage: item.product.coverImage,
            seller: item.product.seller,
        }));

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryCost = 0;
        const total = subtotal + deliveryCost;

        const order = await Order.create({
            customer: userId,
            items,
            subtotal,
            deliveryCost,
            total,
            paymentMethod,
            delivery,
        });

        cart.items = [];
        await cart.save();

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
        const userId = req.user.id;

        const orders = await Order.find({ customer: userId })
            .sort({ createdAt: -1 })
            .populate("items.product")
            .populate("customer", "userName userSurname email");

        res.json({ orders });
    } catch (error) {
        next(error);
    }
}

export async function getOrderById(req, res, next) {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Некоректний id замовлення" });
        }

        const order = await Order.findOne({
            _id: orderId,
            customer: userId,
        })
            .populate("items.product")
            .populate("customer", "userName userSurname email");

        if (!order) {
            return res.status(404).json({ message: "Замовлення не знайдено" });
        }

        res.json({ order });
    } catch (error) {
        next(error);
    }
}