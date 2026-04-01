import Category from "./entities/category.model.js";

export async function findActiveCategories() {
    return Category.find({ isActive: true }).sort({ name: 1 });
}

export async function findById(categoryId) {
    return Category.findById(categoryId);
}

export async function findBySlug(slug) {
    return Category.findOne({ slug });
}