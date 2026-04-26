import express from "express";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import Product from "../products/entities/products.model.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

router.post("/by-photo", upload.single("file"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Фото не завантажено" });
        }

        const form = new FormData();
        form.append("file", fs.createReadStream(req.file.path), req.file.originalname);

        const mlResponse = await fetch(`${ML_SERVICE_URL}/search-by-photo`, {
            method: "POST",
            body: form,
            headers: form.getHeaders(),
        });

        const contentType = mlResponse.headers.get("content-type") || "";

        const mlData = contentType.includes("application/json")
            ? await mlResponse.json().catch(() => null)
            : null;

        const mlText = !mlData
            ? await mlResponse.text().catch(() => "")
            : "";

        if (!mlResponse.ok) {
            return res.status(mlResponse.status).json({
                message:
                    mlData?.detail ||
                    mlData?.message ||
                    mlText ||
                    "Помилка ML сервісу",
            });
        }
        const productIds = mlData.results.map(item => item.productId);

        const products = await Product.find({
            _id: { $in: productIds }
        }).lean();

        const orderedProducts = productIds
            .map(id => products.find(p => p._id.toString() === id))
            .filter(Boolean);

        return res.json({
            prediction: {
                category: mlData.predictedCategory,
                categoryUa: mlData.predictedCategoryUa,
                confidence: mlData.confidence,
            },
            products: orderedProducts,
            similarities: mlData.results
        });
    } catch (error) {
        next(error);
    } finally {
        if (req.file?.path) {
            fs.unlink(req.file.path, () => { });
        }
    }
});

export default router;