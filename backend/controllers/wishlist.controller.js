import WishlistModel from "../models/wishlist.model.js";

// to add property to wishlist
export const addWishlist = async (req, res) => {
	try {
		const propertyId = req.params.propertyId;

		const existing = await WishlistModel.findOne({
			user: req.user._id,
			property: propertyId,
		});

		if (existing) {
			res.status(200).json({
				success: true,
				message: "Already in the wishlist",
			});
		}

		await WishlistModel.create({
			user: req.user._id,
			property: propertyId,
		});

		res.status(201).json({
			success: true,
			message: "Added to the wishlist",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// to get the property that is on the wishlist
export const getWishList = async (req, res) => {
    try {
        const data = await WishlistModel.find({
            user: req.user._id
        }).populate("property");

        res.status(200).json({success: true, data})
    } catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// to remove a property from wishlist
export const removeWishlist = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const result = await WishlistModel.findOneAndDelete({
            user: req.user._id,
			property: propertyId,
        })

        if(!result) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            })
        }

        res.status(201).json({
            success: true,
            message: "Removed from wishlist"
        })
    } catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}