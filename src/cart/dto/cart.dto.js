export function toCartResponseDto(cart) {
    const safeItems = (cart?.items || []).filter((item) => item.product);

    const items = safeItems.map((item) => {
        const product = item.product;

        const unitPrice = Number(product.price || 0);
        const quantity = Number(item.quantity || 1);
        const subtotal = unitPrice * quantity;

        return {
            id: item._id,
            quantity,
            subtotal,

            product: {
                id: product._id,
                title: product.title,
                price: product.price,
                currency: product.currency,
                coverImage: product.coverImage,
                images: product.images || [],
                badges: product.badges || [],
                description: product.description,
                seller: product.seller,
                category: product.categoryId
                    ? {
                        id: product.categoryId._id,
                        name: product.categoryId.name,
                        slug: product.categoryId.slug,
                    }
                    : null,
            },
        };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
        id: cart._id,
        user: cart.user,
        items,
        summary: {
            totalItems,
            totalPrice,
            uniqueItems: items.length,
        },
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
}