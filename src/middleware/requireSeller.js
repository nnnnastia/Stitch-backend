import SellerProfile from "../sellerProfile/entities/sellerProfile.model.js";

export async function requireSeller(req, res, next) {
    try {
        const profile = await SellerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(403).json({ message: "Seller profile not found" });
        }

        if (profile.status === "blocked") {
            return res.status(403).json({ message: "Seller is blocked" });
        }

        req.sellerProfile = profile;
        next();
    } catch (error) {
        next(error);
    }
}