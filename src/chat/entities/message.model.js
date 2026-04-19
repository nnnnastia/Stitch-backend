import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            default: "",
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        text: {
            type: String,
            trim: true,
            default: "",
            maxlength: 5000,
        },

        attachments: {
            type: [attachmentSchema],
            default: [],
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);