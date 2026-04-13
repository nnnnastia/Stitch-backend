import * as productsService from "./products.service.js";

export async function getAllProducts(req, res, next) {
    try {
        const result = await productsService.getAllProducts(req.query);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getProductById(req, res, next) {
    try {
        const product = await productsService.getProductById(req.params.id);
        return res.status(200).json({ product });
    } catch (error) {
        next(error);
    }
}