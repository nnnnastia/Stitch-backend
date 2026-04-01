import Product from "../products/entities/products.model.js";

export async function findManyBySeller({ sellerId, q = "", skip = 0, limit = 12 }) {
    const filter = {
        seller: sellerId,
        ...(q ? { title: { $regex: String(q), $options: "i" } } : {}),
    };

    const [items, total] = await Promise.all([
        Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Product.countDocuments(filter),
    ]);

    return { items, total };
}

export async function createProduct(data) {
    return Product.create(data);
}

export async function findOneBySellerAndId(productId, sellerId) {
    return Product.findOne({ _id: productId, seller: sellerId });
}

export async function updateOneBySellerAndId(productId, sellerId, patch) {
    return Product.findOneAndUpdate(
        { _id: productId, seller: sellerId },
        { $set: patch },
        { new: true, runValidators: true }
    );
}

export async function deleteOneBySellerAndId(productId, sellerId) {
    return Product.findOneAndDelete({ _id: productId, seller: sellerId });
}