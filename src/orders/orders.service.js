import Cart from "../cart/entities/cart.model.js";
import Order from "./entities/order.model.js";

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
        "recipientEmail",
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

    const email = String(delivery.recipientEmail).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        const error = new Error("Некоректний email отримувача");
        error.statusCode = 400;
        throw error;
    }
}

export async function createOrder(userId, payload) {
    const { paymentMethod, delivery } = payload;

    validateCreateOrderPayload(paymentMethod, delivery);

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || !cart.items.length) {
        const error = new Error("Кошик порожній");
        error.statusCode = 400;
        throw error;
    }

    const validCartItems = cart.items.filter((item) => item.product);

    if (!validCartItems.length) {
        const error = new Error("У кошику немає доступних товарів");
        error.statusCode = 400;
        throw error;
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
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        delivery,
    });

    cart.items = [];
    await cart.save();

    return order;
}

export async function getMyOrders(userId) {
    return Order.find({ customer: userId })
        .sort({ createdAt: -1 })
        .populate("items.product")
        .populate("customer", "userName userSurname email");
}

export async function getOrderById(userId, orderId) {
    return Order.findOne({
        _id: orderId,
        customer: userId,
    })
        .populate("items.product")
        .populate("customer", "userName userSurname email");
}