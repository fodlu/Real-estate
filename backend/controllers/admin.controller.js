import UserModel from "../models/user.model";
import PropertyModel from "../models/property.model";
import InquiryModel from "../models/inquiry.model";
import { genSalt } from "bcrypt";

// view all users
export const getAllUsers = async (req, res) => {
	try {
		const users = await UserModel.find().select("-password");
		res.json({
			success: true,
			count: users.length,
			users,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// Block a parrticular user
export const blockUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);
		user.isBlocked = !user.isBlocked;
		await user.save();

		res.json({
			success: true,
			message: user.isBlocked ? "User Blocked" : "User Unblocked",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// to delete a particular user
export const deleteUser = async (req, res) => {
	try {
		await UserModel.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// to view all the properties
export const getAllProperties = async (req, res) => {
	try {
		const properties = await PropertyModel.find().populate(
			"seller",
			"name email role",
		);
		res.json({
			success: true,
			count: properties.length,
			properties,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// to delete a particular property
export const deleteProperty = async (req, res) => {
	try {
		await PropertyModel.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Property deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// to view all inquiries
export const getAllInquiries = async (req, res) => {
	try {
		const inquiries = await InquiryModel.find()
			.populate("buyer", "name email ")
			.populate("seller", "name email")
			.populate("property", "title price")
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			count: inquiries.length,
			inquiries,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// to get the dashboard analytics
export const getDashboardStats = async (req, res) => {
	try {
		const totalUsers = await UserModel.countDocuments();
		const totalProperties = await PropertyModel.countDocuments();

		const activeListing = await PropertyModel.countDocuments({
			status: "sale",
		});

		const soldProperties = await PropertyModel.countDocuments({
			status: "sold",
		});

		res.json({
			success: true,
			stats: {
				totalUsers,
				totalProperties,
				activeListing,
				soldProperties,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// to get pending seller
export const getPendingSellers = async (req, res) => {
	try {
		const pendingSellers = await UserModel.find({
			role: "seller",
			isApproved: false,
		}).select("-password");
		// if you are a seller, you will get approval from the admin panel

		res.json({
			success: true,
			count: pendingSellers,
			pendingSellers,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

// to approve a seller
export const approveSeller = async (req, res) => {
	try {
		const seller = await UserModel.findById(req.params.id);
		if (!seller || seller.role !== "seller") {
			return res.status(404).json({
				success: false,
				message: "You are not a seller or seller not found",
			});
		}

		seller.isApproved = true;
		await seller.save();

		res.json({
			success: true,
			message: "Seller approved successfully",
			seller,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
