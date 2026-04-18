import Order from "./entities/order.model.js";

function requireAdmin(ctx) {
    if (!ctx.user) {
        throw new Error("Unauthorized");
    }

    if (ctx.user.role !== "admin") {
        throw new Error("Forbidden");
    }
}

export const ordersResolvers = {
    Query: {
        async adminOrders(_, args, ctx) {
            requireAdmin(ctx);

            const page = Math.max(1, args.page || 1);
            const limit = Math.max(1, Math.min(args.limit || 10, 100));
            const skip = (page - 1) * limit;

            const filter = {};

            if (args.status) {
                filter.status = args.status;
            }

            if (args.search?.trim()) {
                filter.orderNumber = { $regex: args.search.trim(), $options: "i" };
            }

            const [items, total] = await Promise.all([
                Order.find(filter)
                    .populate("customer", "firstName lastName email")
                    .populate("items.product", "title coverImage")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Order.countDocuments(filter),
            ]);

            return { items, total };
        },

        async adminOrder(_, { id }, ctx) {
            requireAdmin(ctx);

            return await Order.findById(id)
                .populate("customer", "firstName lastName email")
                .populate("items.product", "title coverImage");
        },
    },

    Mutation: {
        async adminUpdateOrderStatus(_, { id, status }, ctx) {
            requireAdmin(ctx);

            const order = await Order.findById(id);

            if (!order) {
                throw new Error("Order not found");
            }

            order.status = status;
            await order.save();

            return await Order.findById(order._id)
                .populate("customer", "firstName lastName email")
                .populate("items.product", "title coverImage");
        },
    },
};