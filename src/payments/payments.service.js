import Order from "../orders/entities/order.model.js";
import { stripe } from "../config/stripe.js";

export async function createCheckoutSession(orderId, userId) {
    const order = await Order.findOne({
        _id: orderId,
        customer: userId,
    });

    if (!order) {
        const error = new Error("Замовлення не знайдено");
        error.statusCode = 404;
        throw error;
    }

    if (order.paymentMethod !== "card") {
        const error = new Error("Для цього замовлення недоступна онлайн-оплата");
        error.statusCode = 400;
        throw error;
    }

    if (order.status === "paid") {
        const error = new Error("Замовлення вже оплачене");
        error.statusCode = 400;
        throw error;
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: order.items.map((item) => ({
            price_data: {
                currency: "uah",
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })),
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
            orderId: String(order._id),
            userId: String(userId),
        },
    });

    return {
        url: session.url,
        sessionId: session.id,
    };
}