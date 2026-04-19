import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        icon: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },
        order: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

categorySchema.index({ parent: 1 });
categorySchema.index({ order: 1 });

export default mongoose.model("Category", categorySchema);