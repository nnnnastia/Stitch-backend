export function toSellerProductDto(product) {
    return {
        id: product._id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        coverImage: product.coverImage,
        images: product.images,
        badges: product.badges,
        categoryId: product.categoryId,
        description: product.description,
        seller: product.seller,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

export function toSellerProductsListDto(items, total, page, limit) {
    return {
        items: items.map(toSellerProductDto),
        total,
        page,
        pages: Math.ceil(total / limit),
    };
}