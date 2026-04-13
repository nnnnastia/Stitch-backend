import * as recommendationsService from "./recommendations.service.js";

export async function trackView(req, res, next) {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        await recommendationsService.trackProductView(userId, productId);

        res.status(200).json({
            message: "View tracked"
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyRecommendations(req, res, next) {
    try {
        const userId = req.user._id;

        const products = await recommendationsService.getRecommendedProducts(userId, 8);

        res.status(200).json({
            products
        });
    } catch (error) {
        next(error);
    }
}