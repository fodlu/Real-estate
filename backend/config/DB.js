import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Double-check that your environment variables are loading
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is completely missing from your .env file!");
        }

        // Clean up the promise resolution chain safely
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🚀 Database connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection crash:", error.message);
        // Force the backend server to shut down cleanly if it can't reach its database
        process.exit(1);
    }
};