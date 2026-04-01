import * as recommendationsService from "./recommendations.service.js";

export async function trackView(req, res, next) {
    try {
        const result = await recommendationsService.trackView(
            req.user._id,
            req.params.productId
        );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getMyRecommendations(req, res, next) {
    try {
        const result = await recommendationsService.getMyRecommendations(req.user._id);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}