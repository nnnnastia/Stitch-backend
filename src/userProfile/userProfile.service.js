import UserProfile from "./entities/userProfile.model.js";

export async function ensureUserProfile(userId) {
    let profile = await UserProfile.findOne({ user: userId });

    if (!profile) {
        profile = await UserProfile.create({
            user: userId,
            recentlyViewed: [],
            categoryScores: {},
            tagScores: {},
            pricePref: {
                min: null,
                max: null
            }
        });
    }

    return profile;
}