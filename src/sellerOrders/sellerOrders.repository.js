import Order from "../orders/entities/order.model.js";

export const sellerOrdersRepository = {
    async findSellerOrders(sellerId) {
        return await Order.find({
            "items.seller": sellerId,
        })
            .populate("customer", "firstName lastName email phoneNumber")
            .sort({ createdAt: -1 });
    },

    async findSellerOrderById(orderId, sellerId) {
        return await Order.findOne({
            _id: orderId,
            "items.seller": sellerId,
        }).populate("customer", "firstName lastName email phoneNumber");
    },

    async save(order) {
        return await order.save();
    },
};