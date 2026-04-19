import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../users/entities/user.model.js";

const GOOGLE_CONFIG = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

// login
passport.use(
    "google-login",
    new GoogleStrategy(
        {
            ...GOOGLE_CONFIG,
            callbackURL: "http://localhost:5000/api/auth/google/login/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();

                if (!email) {
                    return done(new Error("Google account email not found"), null);
                }

                const existingUser = await User.findOne({ email });

                if (!existingUser) {
                    return done(null, { mode: "login_not_found" });
                }

                return done(null, {
                    mode: "login",
                    user: existingUser,
                });
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// register
passport.use(
    "google-register",
    new GoogleStrategy(
        {
            ...GOOGLE_CONFIG,
            callbackURL: "http://localhost:5000/api/auth/google/register/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();

                if (!email) {
                    return done(new Error("Google account email not found"), null);
                }

                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    return done(null, { mode: "register_exists" });
                }

                return done(null, {
                    mode: "register",
                    googleProfile: {
                        provider: "google",
                        googleId: profile.id,
                        email,
                        userName: profile.name?.givenName || profile.displayName || "",
                        userSurname: profile.name?.familyName || "",
                        avatarUrl: profile.photos?.[0]?.value || "",
                    },
                });
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;