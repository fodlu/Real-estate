import InquiryModel from "../models/inquiry.model.js";
import PropertyModel from "../models/property.model.js";

// buyer send inquiry
export const sendInquiry = async (req, res) => {
	try {
		const { propertyId, message } = req.body;
		const property =
			await PropertyModel.findById(propertyId).populate("seller");

		if (!property) {
			return res.status(404).json({
				success: false,
				message: "Property not found",
			});
		}

		const inquiry = InquiryModel.create({
			property: property._id,
			buyer: req.user._id,
			seller: property.seller._id,
			message,
		});
		res.status(201).json({
			success: true,
			message: "Inquiry sent successfully",
			inquiry,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// seller views inquiry
export const getSellerInquiries = async (req, res) => {
	try {
		const inquiries = await InquiryModel.find({
			seller: req.user._id,
		})
			.populate("buyer", "name email phone")
			.populate("property", "title price images city")
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			count: inquiries.length,
			inquiries,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// to mark inquiry as read
export const markAsRead = async (req, res ) => {
    try {
        const inquiry = await InquiryModel.findById(req.params.id);
        if(!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found"
            })
        }

        inquiry.isRead = true
        await inquiry.save();

        res.json({
            success: true,
            message: "Marked as read"
        })
    } catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}