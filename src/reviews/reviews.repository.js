import Review from "./entities/review.model.js";

export const reviewsRepository = {
    create(payload) {
        return Review.create(payload);
    },

    findById(id) {
        return Review.findById(id)
            .populate("author", "userName avatarUrl")
            .populate("product", "title coverImage")
            .populate("seller", "userName");
    },

    findProductReviews(productId) {
        return Review.find({ product: productId })
            .sort({ createdAt: -1 })
            .populate("author", "userName avatarUrl");
    },

    findByAuthorAndProduct({ authorId, productId }) {
        return Review.findOne({
            author: authorId,
            product: productId,
        });
    },

    updateById(id, payload) {
        return Review.findByIdAndUpdate(id, payload, { new: true })
            .populate("author", "userName avatarUrl")
            .populate("product", "title coverImage")
            .populate("seller", "userName");
    },

    deleteById(id) {
        return Review.findByIdAndDelete(id);
    },
};