import Category from "./entities/category.model.js";

export async function findActiveCategories() {
    return Category.find({ isActive: true }).sort({ name: 1 });
}

export async function findRootCategories() {
    return Category.find({ parent: null }).sort({ order: 1, createdAt: -1 });
}

export async function findById(categoryId) {
    return Category.findById(categoryId);
}

export async function findBySlug(slug) {
    return Category.findOne({ slug });
}

export async function findByName(name) {
    return Category.findOne({ name });
}

export async function findByNameExcludingId(name, excludeId) {
    return Category.findOne({
        name,
        _id: { $ne: excludeId }
    });
}

export async function findBySlugExcludingId(slug, excludeId) {
    return Category.findOne({
        slug,
        _id: { $ne: excludeId }
    });
}

export async function findByNameOrSlug(name, slug) {
    return Category.findOne({
        $or: [{ name }, { slug }]
    });
}

export async function findChildren(parentId) {
    return Category.find({ parent: parentId }).sort({ order: 1, createdAt: -1 });
}

export async function hasChildren(parentId) {
    return Category.exists({ parent: parentId });
}

export async function createCategory(data) {
    return Category.create(data);
}

export async function updateCategory(category) {
    return category.save();
}

export async function deleteCategoryById(id) {
    return Category.findByIdAndDelete(id);
}

export async function findAllLean() {
    return Category.find().sort({ order: 1, createdAt: -1 }).lean();
}

export async function findAllCategoriesPaginated(skip, limit) {
    return Category.find()
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
}

export async function countAllCategories() {
    return Category.countDocuments();
}