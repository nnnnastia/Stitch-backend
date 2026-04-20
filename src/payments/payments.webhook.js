import { stripe } from "../config/stripe.js";
import Order from "../orders/entities/order.model.js";

export async function stripeWebhook(req, res) {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const orderId = session.metadata?.orderId || session.client_reference_id;

        if (orderId) {
            const order = await Order.findById(orderId);

            if (order && order.paymentStatus !== "paid") {
                order.paymentStatus = "paid";
                order.paymentProvider = "stripe";
                order.paymentSessionId = session.id;
                order.paidAt = new Date();

                if (order.status === "pending") {
                    order.status = "confirmed";
                }

                await order.save();
            }
        }
    }

    res.json({ received: true });
}