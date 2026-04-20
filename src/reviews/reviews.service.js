import Review from "./entities/review.model.js";
import Product from "../products/entities/products.model.js";
import SellerProfile from "../sellerProfile/entities/sellerProfile.model.js";
import { reviewsRepository } from "./reviews.repository.js";
import { toReviewResponseDto, toReviewsListResponseDto } from "./dto/reviews.dto.js";
import { recalculateProductRating, recalculateSellerRating } from "./reviews.rating.service.js";

export async function createReview({ userId, productId, rating, text }) {
    const product = await Product.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }

    const existingReview = await reviewsRepository.findByAuthorAndProduct({
        authorId: userId,
        productId,
    });

    if (existingReview) {
        const error = new Error("You have already left a review for this product");
        error.status = 409;
        throw error;
    }

    const review = await reviewsRepository.create({
        product: productId,
        seller: product.seller,
        author: userId,
        rating,
        text,
    });

    await recalculateProductRating(productId);
    await recalculateSellerRating(product.seller);

    const fullReview = await reviewsRepository.findById(review._id);
    return toReviewResponseDto(fullReview);
}

export async function getProductReviews(productId) {
    const items = await reviewsRepository.findProductReviews(productId);
    return toReviewsListResponseDto(items);
}

export async function updateReview({ reviewId, userId, rating, text }) {
    const review = await Review.findById(reviewId);

    if (!review) {
        const error = new Error("Review not found");
        error.status = 404;
        throw error;
    }

    if (String(review.author) !== String(userId)) {
        const error = new Error("You can edit only your own review");
        error.status = 403;
        throw error;
    }

    const updated = await reviewsRepository.updateById(reviewId, {
        rating,
        text,
    });

    await recalculateProductRating(review.product);
    await recalculateSellerRating(review.seller);

    return toReviewResponseDto(updated);
}

export async function deleteReview({ reviewId, userId }) {
    const review = await Review.findById(reviewId);

    if (!review) {
        const error = new Error("Review not found");
        error.status = 404;
        throw error;
    }

    if (String(review.author) !== String(userId)) {
        const error = new Error("You can delete only your own review");
        error.status = 403;
        throw error;
    }

    const productId = review.product;
    const sellerId = review.seller;

    await reviewsRepository.deleteById(reviewId);

    await recalculateProductRating(productId);
    await recalculateSellerRating(sellerId);

    return { success: true };
}

export async function getSellerRating(sellerId) {
    const profile = await SellerProfile.findOne({ user: sellerId });

    return {
        avg: profile?.rating?.avg || 0,
        count: profile?.rating?.count || 0,
    };
}