export function toProductResponseDto(product, sellerProfile = null) {
    return {
        id: product._id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        coverImage: product.coverImage,
        images: product.images,
        badges: product.badges,
        category: product.categoryId
            ? {
                id: product.categoryId._id,
                name: product.categoryId.name,
                slug: product.categoryId.slug,
                icon: product.categoryId.icon,
            }
            : null,
        description: product.description,
        seller: product.seller
            ? {
                id: product.seller._id,
                userName: product.seller.userName,
                displayName: sellerProfile?.displayName || "",
                storeSlug: sellerProfile?.storeSlug || "",
                rating: {
                    avg: sellerProfile?.rating?.avg || 0,
                    count: sellerProfile?.rating?.count || 0,
                },
            }
            : null,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}
export function toProductsListResponseDto(products) {
    return products.map((product) => toProductResponseDto(product));
}