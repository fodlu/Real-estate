// config/DB.js
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // ✅ Extends the node discovery phase to give your hotspot 10s to sync
            serverSelectionTimeoutMS: 10000,
            // ✅ Prevents slow data packets from causing an abrupt crash
            socketTimeoutMS: 45000,
        });
        console.log("🚀 [DATABASE] Connected successfully over your hotspot connection!");
    } catch (error) {
        console.error("MongoDB Connection Fault Details:", error);
    }
};
