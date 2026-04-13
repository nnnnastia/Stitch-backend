import Product from "./entities/products.model.js";

export async function findAll(filter = {}, options = {}) {
    const {
        limit,
        skip,
        sort = { createdAt: -1 },
    } = options;

    let query = Product.find(filter)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon")
        .sort(sort);

    if (skip) {
        query = query.skip(skip);
    }

    if (limit) {
        query = query.limit(limit);
    }

    return query;
}

export async function countAll(filter = {}) {
    return Product.countDocuments(filter);
}

export async function findById(productId) {
    return Product.findById(productId)
        .populate("seller", "userName")
        .populate("categoryId", "name slug icon");
}