import jwt from "jsonwebtoken";

export function generateToken(user) {
    return jwt.sign(
        { id: String(user._id), role: user.role }, // ВАЖЛИВО: саме id
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}
