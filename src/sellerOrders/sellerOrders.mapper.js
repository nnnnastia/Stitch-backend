export function mapSellerOrder(order, sellerId) {
    const sellerItems = order.items.filter(
        (item) => String(item.seller) === String(sellerId)
    );

    const sellerSubtotal = sellerItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    return {
        _id: order._id,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customer: order.customer,
        delivery: order.delivery,
        sellerItems,
        sellerSubtotal,
    };
}