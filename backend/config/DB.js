// config/DB.js
import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log(
			"🚀 [DATABASE] Connected successfully over your hotspot connection!",
		);
	} catch (error) {
		console.error("MongoDB Connection Fault Details:", error.message);
	}
};
