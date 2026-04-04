import * as categoriesService from "./categories.service.js";

export async function getCategories(req, res, next) {
    try {
        const categories = await categoriesService.listCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
}

export async function getCategoryBySlug(req, res, next) {
    try {
        const category = await categoriesService.getCategoryBySlug(req.params.slug);
        res.json(category);
    } catch (error) {
        next(error);
    }
}