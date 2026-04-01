import Product from "./entities/products.model.js";

export async function findAll(filter = {}, options = {}) {
    let query = Product.find(filter)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon")
        .sort({ createdAt: -1 });

    if (options.limit) {
        query = query.limit(options.limit);
    }

    return query;
}

export async function findById(productId) {
    return Product.findById(productId)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}