import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

import authRoutes from "./auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";
import productsRoutes from "./products/products.routes.js";
import sellerProductsRoutes from "./sellerProducts/sellerProducts.routes.js";
import categoriesRoutes from "./categories/categories.routes.js";
import recommendationsRoutes from "./recommendations/recommendations.routes.js";
import sellerProfilesRoutes from "./sellerProfile/sellerProfiles.routes.js";



const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true, }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/seller/profile", sellerProfilesRoutes);
app.use("/api/seller/products", sellerProductsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/recommendations", recommendationsRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
        console.log(`✅ Server running: http://localhost:${PORT}`);
    });
}

start().catch((e) => {
    console.error("❌ Server error:", e);
    process.exit(1);
});