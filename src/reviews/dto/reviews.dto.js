export function toReviewResponseDto(review) {
    return {
        id: review._id,
        product: review.product?._id || review.product,
        seller: review.seller?._id || review.seller,
        rating: review.rating,
        text: review.text,
        author: review.author
            ? {
                id: review.author._id,
                userName: review.author.userName,
                avatarUrl: review.author.avatarUrl || null,
            }
            : null,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
    };
}

export function toReviewsListResponseDto(items) {
    return {
        items: items.map(toReviewResponseDto),
    };
}