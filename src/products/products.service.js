import * as productsRepository from "./products.repository.js";
import {
    toProductResponseDto,
    toProductsListResponseDto
} from "./dto/products.dto.js";

export async function getAllProducts(query) {
    const { badge, limit, categoryId } = query;

    const filter = {
        status: "active"
    };

    if (badge) {
        filter.badges = badge;
    }

    if (categoryId) {
        filter.categoryId = categoryId;
    }

    const products = await productsRepository.findAll(filter, {
        limit: limit ? Number(limit) : undefined,
    });

    return toProductsListResponseDto(products);
}

export async function getProductById(productId) {
    const product = await productsRepository.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }

    return toProductResponseDto(product);
}