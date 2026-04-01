import * as sellerProductsService from "./sellerProducts.service.js";

export async function listMyProducts(req, res, next) {
    try {
        const result = await sellerProductsService.listMyProducts(req.user._id, req.query);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function createMyProduct(req, res, next) {
    try {
        const product = await sellerProductsService.createMyProduct(
            req.user._id,
            req.sellerProfile,
            req.body,
            req.files
        );

        return res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

export async function getMyProductById(req, res, next) {
    try {
        const product = await sellerProductsService.getMyProductById(
            req.user._id,
            req.params.id
        );

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

export async function updateMyProduct(req, res, next) {
    try {
        const product = await sellerProductsService.updateMyProduct(
            req.user._id,
            req.params.id,
            req.body
        );

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

export async function deleteMyProduct(req, res, next) {
    try {
        const result = await sellerProductsService.deleteMyProduct(
            req.user._id,
            req.params.id
        );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}