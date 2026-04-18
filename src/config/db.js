import mongoose from "mongoose";

export async function connectDB() {
    mongoose.set("strictQuery", true);

    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI не знайдено у .env");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
}