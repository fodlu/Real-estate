import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
	propery: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Property",
		required: true,
	},
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const InquiryModel = mongoose.model("Inquiry", inquirySchema)

export default InquiryModel