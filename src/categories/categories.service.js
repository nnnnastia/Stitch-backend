import mongoose from "mongoose";
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

export async function listAllCategoriesForAdmin(page = 1, limit = 10) {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

    const skip = (normalizedPage - 1) * normalizedLimit;

    const [items, totalItems] = await Promise.all([
        categoriesRepository.findAllCategoriesPaginated(skip, normalizedLimit),
        categoriesRepository.countAllCategories(),
    ]);

    const totalPages = Math.ceil(totalItems / normalizedLimit) || 1;

    return {
        items,
        pagination: {
            page: normalizedPage,
            limit: normalizedLimit,
            totalItems,
            totalPages,
            hasNextPage: normalizedPage < totalPages,
            hasPrevPage: normalizedPage > 1,
        },
    };
}

export async function listRootCategoriesForAdmin() {
    return categoriesRepository.findRootCategories();
}

export async function getCategoryByIdForAdmin(id) {
    validateObjectId(id);

    const category = await categoriesRepository.findById(id);

    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }

    return category;
}

export async function getCategoryTreeForAdmin() {
    const categories = await categoriesRepository.findAllLean();
    return buildCategoryTree(categories);
}

export async function createCategoryForAdmin(input, user) {
    requireAdmin(user);

    const normalizedName = input.name?.trim();
    const normalizedSlug = input.slug?.trim();

    if (!normalizedName || !normalizedSlug) {
        const error = new Error("Name and slug are required");
        error.status = 400;
        throw error;
    }

    const existingCategory = await categoriesRepository.findByNameOrSlug(
        normalizedName,
        normalizedSlug
    );

    if (existingCategory) {
        const error = new Error("Category with this name or slug already exists");
        error.status = 409;
        throw error;
    }

    if (input.parent) {
        validateObjectId(input.parent);

        const parentCategory = await categoriesRepository.findById(input.parent);

        if (!parentCategory) {
            const error = new Error("Parent category not found");
            error.status = 404;
            throw error;
        }
    }

    return categoriesRepository.createCategory({
        name: normalizedName,
        slug: normalizedSlug,
        icon: input.icon ?? "",
        description: input.description ?? "",
        isActive: input.isActive ?? true,
        parent: input.parent ?? null,
        order: input.order ?? 0
    });
}

export async function updateCategoryForAdmin(id, input, user) {
    requireAdmin(user);
    validateObjectId(id);

    const category = await categoriesRepository.findById(id);

    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }

    if (input.parent && String(input.parent) === String(id)) {
        const error = new Error("Category cannot be parent of itself");
        error.status = 400;
        throw error;
    }

    if (input.parent) {
        validateObjectId(input.parent);

        const parentCategory = await categoriesRepository.findById(input.parent);

        if (!parentCategory) {
            const error = new Error("Parent category not found");
            error.status = 404;
            throw error;
        }

        const isDescendant = await checkIfDescendant(id, input.parent);

        if (isDescendant) {
            const error = new Error("Cannot assign child category as parent");
            error.status = 400;
            throw error;
        }
    }

    if (input.name !== undefined) {
        const normalizedName = input.name.trim();

        if (!normalizedName) {
            const error = new Error("Name cannot be empty");
            error.status = 400;
            throw error;
        }

        const existingByName = await categoriesRepository.findByNameExcludingId(
            normalizedName,
            id
        );

        if (existingByName) {
            const error = new Error("Category with this name already exists");
            error.status = 409;
            throw error;
        }

        category.name = normalizedName;
    }

    if (input.slug !== undefined) {
        const normalizedSlug = input.slug.trim();

        if (!normalizedSlug) {
            const error = new Error("Slug cannot be empty");
            error.status = 400;
            throw error;
        }

        const existingBySlug = await categoriesRepository.findBySlugExcludingId(
            normalizedSlug,
            id
        );

        if (existingBySlug) {
            const error = new Error("Category with this slug already exists");
            error.status = 409;
            throw error;
        }

        category.slug = normalizedSlug;
    }

    if (input.icon !== undefined) {
        category.icon = input.icon;
    }

    if (input.description !== undefined) {
        category.description = input.description;
    }

    if (input.isActive !== undefined) {
        category.isActive = input.isActive;
    }

    if (input.parent !== undefined) {
        category.parent = input.parent || null;
    }

    if (input.order !== undefined) {
        category.order = input.order;
    }

    return categoriesRepository.updateCategory(category);
}

export async function deleteCategoryForAdmin(id, user) {
    requireAdmin(user);
    validateObjectId(id);

    const category = await categoriesRepository.findById(id);

    if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }

    const hasChildren = await categoriesRepository.hasChildren(id);

    if (hasChildren) {
        const error = new Error("Cannot delete category that has subcategories");
        error.status = 400;
        throw error;
    }

    await categoriesRepository.deleteCategoryById(id);
    return true;
}

export async function getChildrenForAdmin(parentId) {
    return categoriesRepository.findChildren(parentId);
}

export async function getParentCategoryForAdmin(parentId) {
    if (!parentId) return null;
    return categoriesRepository.findById(parentId);
}

function validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid category id");
        error.status = 400;
        throw error;
    }
}

function requireAdmin(user) {
    if (!user) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
    }

    if (user.role !== "admin") {
        const error = new Error("Forbidden");
        error.status = 403;
        throw error;
    }
}

function buildCategoryTree(categories) {
    const map = new Map();
    const roots = [];

    for (const category of categories) {
        map.set(String(category._id), {
            ...category,
            children: []
        });
    }

    for (const category of categories) {
        const current = map.get(String(category._id));

        if (category.parent) {
            const parent = map.get(String(category.parent));

            if (parent) {
                parent.children.push(current);
            } else {
                roots.push(current);
            }
        } else {
            roots.push(current);
        }
    }

    return roots;
}

async function checkIfDescendant(categoryId, potentialParentId) {
    let current = await categoriesRepository.findById(potentialParentId);

    while (current) {
        if (String(current._id) === String(categoryId)) {
            return true;
        }

        if (!current.parent) {
            return false;
        }

        current = await categoriesRepository.findById(current.parent);
    }

    return false;
}
