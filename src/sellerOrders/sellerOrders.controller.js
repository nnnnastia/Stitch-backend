import { sellerOrdersService } from "./sellerOrders.service.js";

export async function getSellerOrders(req, res) {
    try {
        const sellerId = req.user.id;
        const orders = await sellerOrdersService.getSellerOrders(sellerId);

        res.json({ orders });
    } catch (error) {
        console.error("Get seller orders error:", error);
        res.status(error.status || 500).json({
            message: error.message || "Не вдалося отримати замовлення продавця",
        });
    }
}

export async function getSellerOrderById(req, res) {
    try {
        const sellerId = req.user.id;
        const { orderId } = req.params;

        const order = await sellerOrdersService.getSellerOrderById(orderId, sellerId);

        res.json({ order });
    } catch (error) {
        console.error("Get seller order by id error:", error);
        res.status(error.status || 500).json({
            message: error.message || "Не вдалося отримати замовлення",
        });
    }
}

export async function updateSellerOrderStatus(req, res) {
    try {
        const sellerId = req.user.id;
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await sellerOrdersService.updateSellerOrderStatus(
            orderId,
            sellerId,
            status
        );

        res.json({
            message: "Статус замовлення оновлено",
            order,
        });
    } catch (error) {
        console.error("Update seller order status error:", error);
        res.status(error.status || 500).json({
            message: error.message || "Не вдалося оновити статус замовлення",
        });
    }
}