import mongoose from "mongoose";
import Category from "../categories/entities/category.model.js";
import * as productsRepository from "./products.repository.js";
import {
    toProductResponseDto,
    toProductsListResponseDto,
} from "./dto/products.dto.js";
import SellerProfile from "../sellerProfile/entities/sellerProfile.model.js";
export async function getAllProducts(query) {
    const {
        badge,
        limit,
        page,
        category,
        categoryId,
        search,
        minPrice,
        maxPrice,
        sort,
    } = query;

    const filter = {};

    if (badge) {
        filter.badges = badge;
    }

    const selectedCategoryId = categoryId || category;

    if (selectedCategoryId && mongoose.Types.ObjectId.isValid(selectedCategoryId)) {
        const selectedObjectId = new mongoose.Types.ObjectId(selectedCategoryId);

        const childCategories = await Category.find({
            parent: selectedObjectId,
            isActive: true,
        }).select("_id");

        const categoryIds = [
            selectedObjectId,
            ...childCategories.map((item) => item._id),
        ];

        filter.categoryId = { $in: categoryIds };
    }

    if (search?.trim()) {
        filter.title = {
            $regex: search.trim(),
            $options: "i",
        };
    }

    if (
        (minPrice !== undefined && minPrice !== "") ||
        (maxPrice !== undefined && maxPrice !== "")
    ) {
        filter.price = {};

        if (minPrice !== undefined && minPrice !== "") {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            filter.price.$lte = Number(maxPrice);
        }
    }

    let sortOptions = { createdAt: -1 };

    if (sort === "price_asc") {
        sortOptions = { price: 1 };
    } else if (sort === "price_desc") {
        sortOptions = { price: -1 };
    } else if (sort === "title_asc") {
        sortOptions = { title: 1 };
    } else if (sort === "title_desc") {
        sortOptions = { title: -1 };
    }

    const normalizedLimit = Number(limit) || 12;
    const normalizedPage = Number(page) || 1;
    const skip = (normalizedPage - 1) * normalizedLimit;

    const [products, total] = await Promise.all([
        productsRepository.findAll(filter, {
            limit: normalizedLimit,
            skip,
            sort: sortOptions,
        }),
        productsRepository.countAll(filter),
    ]);

    return {
        products: toProductsListResponseDto(products),
        total,
        page: normalizedPage,
        totalPages: Math.ceil(total / normalizedLimit),
    };
}

export async function getProductById(productId) {
    const product = await productsRepository.findById(productId);

    if (!product) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
    }

    const sellerProfile = product.seller?._id
        ? await SellerProfile.findOne({ user: product.seller._id })
        : null;

    return toProductResponseDto(product, sellerProfile);
}