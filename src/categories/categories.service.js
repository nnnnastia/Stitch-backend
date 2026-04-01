import * as categoriesRepository from "./categories.repository.js";
import {
    toCategoryResponseDto,
    toCategoriesListDto
} from "./dto/categories.dto.js";

export async function listCategories() {
    const categories = await categoriesRepository.findActiveCategories();
    return toCategoriesListDto(categories);
}

export async function getCategoryBySlug(slug) {
    const category = await categoriesRepository.findBySlug(slug);

    if (!category || !category.isActive) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }

    return toCategoryResponseDto(category);
}