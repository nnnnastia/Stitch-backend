import * as categoriesService from "./categories.service.js";

export async function listCategories(req, res, next) {
    try {
        const categories = await categoriesService.listCategories();
        return res.status(200).json({ categories });
    } catch (error) {
        next(error);
    }
}

export async function getCategoryBySlug(req, res, next) {
    try {
        const category = await categoriesService.getCategoryBySlug(req.params.slug);
        return res.status(200).json({ category });
    } catch (error) {
        next(error);
    }
}