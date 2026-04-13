import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        recentlyViewed: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                viewedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        categoryScores: {
            type: Map,
            of: Number,
            default: {}
        },

        tagScores: {
            type: Map,
            of: Number,
            default: {}
        },

        pricePref: {
            min: { type: Number, default: null },
            max: { type: Number, default: null }
        }
    },
    { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);