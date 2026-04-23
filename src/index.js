import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "./users/entities/user.model.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";
import passport from "./config/passport.js";

import { fileURLToPath } from "url";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { connectDB } from "./config/db.js";

import authRoutes from "./auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";
import productsRoutes from "./products/products.routes.js";
import sellerProductsRoutes from "./sellerProducts/sellerProducts.routes.js";
import categoriesRoutes from "./categories/categories.routes.js";
import recommendationsRoutes from "./recommendations/recommendations.routes.js";
import sellerProfilesRoutes from "./sellerProfile/sellerProfiles.routes.js";
import cartRoutes from "./cart/cart.routes.js";
import categoryTypeDefs from "./categories/graphql/category.typeDefs.js";
import categoryResolvers from "./categories/category.resolvers.js";
import searchRoutes from "./search/search.routes.js";
import userTypeDefs from "./users/graphql/user.typeDefs.js";
import userResolvers from "./users/user.resolvers.js";
import ordersRoutes from "./orders/orders.routes.js";
import shippingRoutes from "./shipping/shipping.routes.js";
import { ordersTypeDefs } from "./orders/graphql/orders.typeDefs.js";
import { ordersResolvers } from "./orders/orders.resolvers.js";
import baseTypeDefs from "./graphql/base.typeDefs.js";
import sellerOrdersRoutes from "./sellerOrders/sellerOrders.routes.js";
import chatRoutes from "./chat/chat.routes.js";
import reviewsRoutes from "./reviews/reviews.routes.js";
import paymentsRoutes from "./payments/payments.routes.js";
import { stripeWebhook } from "./payments/payments.webhook.js";
import wishlistRoutes from "./wishlist/wishlist.routes.js";

const app = express();

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
);

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "https://stitch-frontend-kappa.vercel.app",
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/seller/profile", sellerProfilesRoutes);
app.use("/api/seller/products", sellerProductsRoutes);
app.use("/api/seller-profiles", sellerProfilesRoutes);
app.use("/api/seller/orders", sellerOrdersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/wishlist", wishlistRoutes);

const apolloServer = new ApolloServer({
    typeDefs: [baseTypeDefs, categoryTypeDefs, userTypeDefs, ordersTypeDefs],
    resolvers: [categoryResolvers, userResolvers, ordersResolvers],
});

const PORT = process.env.PORT || 5000;

async function start() {
    await connectDB();

    await apolloServer.start();

    app.use(
        "/graphql",
        expressMiddleware(apolloServer, {
            context: async ({ req }) => {
                try {
                    let token = null;

                    const header = req.headers.authorization || "";
                    if (header.startsWith("Bearer ")) {
                        token = header.slice(7);
                    }

                    if (!token && req.cookies?.accessToken) {
                        token = req.cookies.accessToken;
                    }

                    if (!token) {
                        return { user: null };
                    }

                    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

                    const user = await User.findById(payload.sub).select("_id email role");

                    return {
                        user: user || null,
                    };
                } catch (error) {
                    return { user: null };
                }
            },
        })
    );

    app.get("/", (req, res) => {
        res.json({ message: "API is running" });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            message: "Route not found",
        });
    });

    // global error handler
    app.use((err, req, res, next) => {
        console.error(err);

        const status = err.status || 500;
        const message = err.message || "Internal server error";

        res.status(status).json({
            message,
        });
    });

    app.listen(PORT, () => {
        console.log(`✅ Server running: http://localhost:${PORT}`);
        console.log(`✅ GraphQL ready: http://localhost:${PORT}/graphql`);
    });
}

start().catch((e) => {
    console.error("❌ Server error:", e);
    process.exit(1);
});