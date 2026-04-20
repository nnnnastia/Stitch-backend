import * as reviewsService from "./reviews.service.js";

export async function createReview(req, res, next) {
    try {
        const result = await reviewsService.createReview({
            userId: req.user.id,
            productId: req.params.productId,
            rating: Number(req.body.rating),
            text: req.body.text || "",
        });

        res.status(201).json({ review: result });
    } catch (error) {
        next(error);
    }
}

export async function getProductReviews(req, res, next) {
    try {
        const result = await reviewsService.getProductReviews(req.params.productId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function updateReview(req, res, next) {
    try {
        const result = await reviewsService.updateReview({
            reviewId: req.params.reviewId,
            userId: req.user.id,
            rating: Number(req.body.rating),
            text: req.body.text || "",
        });

        res.json({ review: result });
    } catch (error) {
        next(error);
    }
}

export async function deleteReview(req, res, next) {
    try {
        const result = await reviewsService.deleteReview({
            reviewId: req.params.reviewId,
            userId: req.user.id,
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getSellerRating(req, res, next) {
    try {
        const result = await reviewsService.getSellerRating(req.params.sellerId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}