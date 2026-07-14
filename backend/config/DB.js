// config/DB.js
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // Keep these core parameters to support erratic mobile network latency spikes
            // serverSelectionTimeoutMS: 15000,
            // socketTimeoutMS: 60000,
            // maxPoolSize: 5,

        });
        console.log("🚀 [DATABASE] Connected successfully over your hotspot connection!");
    } catch (error) {
        console.error("MongoDB Connection Fault Details:", error.message);
    }
};

