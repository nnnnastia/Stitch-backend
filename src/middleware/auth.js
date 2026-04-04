import jwt from "jsonwebtoken";
import User from "../users/entities/user.model.js";

export async function requireAuth(req, res, next) {
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
            return res.status(401).json({ message: "No token" });
        }

        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(payload.sub).select("_id email role");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid token" });
    }
}