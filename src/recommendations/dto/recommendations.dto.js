export function toRecommendationProductDto(product) {
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
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

export function toRecommendationsResponseDto(products, strategy = "content_based") {
    return {
        strategy,
        items: products.map(toRecommendationProductDto),
    };
}