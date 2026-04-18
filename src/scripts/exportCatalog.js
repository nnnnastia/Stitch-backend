import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "../products/entities/products.model.js";
import Category from "../categories/entities/category.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, "../../../ml-service/catalog_source.json");

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is undefined. Check your .env file.");
}

await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find()
    .populate("categoryId", "slug")
    .lean();

const prepared = products
    .map((product) => ({
        productId: product._id.toString(),
        category: product.categoryId?.slug || null,
        imageUrl: product.coverImage || null,
    }))
    .filter((item) => item.category && item.imageUrl);

fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(prepared, null, 2),
    "utf-8"
);

await mongoose.disconnect();

console.log("catalog_source.json created at:", OUTPUT_PATH);