import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	property: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Property",
	},
});


const WishlistModel = mongoose.model("Wishlist", wishlistSchema)

export default WishlistModel