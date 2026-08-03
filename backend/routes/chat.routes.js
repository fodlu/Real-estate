import express from "express";
import ChatModel from "../models/chat.model.js";
import { protect } from "../middlewares/auth.middleware.js";

const ChatRouter = express.Router();
ChatRouter.use(protect);

// to create a chat
ChatRouter.post("/start", async (req, res) => {
	try {
		const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;

		if (!req.user) {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}

		let buyerId, finalSellerId;
		if (req.user.role === "seller") {
			buyerId = providedBuyerId;
			finalSellerId = req.user._id;
		} else {
			buyerId = req.user._id;
			finalSellerId = sellerId;
		}

		if (!buyerId || !finalSellerId) {
			return res.status(400).json({
				message: "Missing buyer or the seller id",
			});
		}

		// check for an existing chat between the buyer and the seller
		let chat = await ChatModel.findOne({
			buyer: buyerId,
			seller: finalSellerId,
		});

		if (!chat) {
			chat = await ChatModel.create({
				property: propertyId, // initial property context
				buyer: buyerId,
				seller: finalSellerId,
				messages: [],
			});
		}

		chat = await ChatModel.findById(chat._id)
			.populate("buyer", "name email profilePic")
			.populate("seller", "name email profilePic")
			.populate("property", "title price images");

		return res.status(200).json(chat);
	} catch (error) {
		console.error("Backend chat start fault: ", error);
		res.status(500).json({
			message: "Error creating chat or getting previous ones",
			error: error.message,
		});
	}
});

// to send message
ChatRouter.post("/send", async (req, res) => {
	try {
		const { chatId, text, image } = req.body;
		const userId = req.user.id || req.user._id;

		const chat = await ChatModel.findById(chatId);
		if (!chat)
			return res.status(404).json({
				message: "Chat not found",
			});

		// ensure sender is part of the chat
		if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
			return res.status(403).json({
				message: "You are not authorized to send message in this chat",
			});
		}

		const newMessage = {
			sender: userId,
			text,
			image: image || null,
			createdAt: new Date(),
		};
		chat.messages.push(newMessage);
		await chat.save();

		const savedMessage = chat.messages[chat.messages.length - 1];
		return res.status(200).json({ chat, newMessage: savedMessage });
	} catch (error) {
		return res.status(500).json({
			message: "Error sending the message",
			error: error.message,
		});
	}
});

// to get chats for user
ChatRouter.get("/user", async (req, res) => {
	try {
		const userId = req.user._id;
		const chats = await ChatModel.find({
			$or: [{ buyer: userId }, { seller: userId }],
		})
			.populate("buyer", "name email profilePic")
			.populate("seller", "name email profilePic")
			.populate("property", "title price images")
			.sort({ updatedAt: -1 });

		return res.json(chats);
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching the user chats",
			error: error.message,
		});
	}
});

// to get chat message
ChatRouter.get("/:chatId", async (req, res) => {
	try {
		const chat = await ChatModel.findById(req.params.chatId).populate({
			path: "messages.sender",
			select: "name profilePic",
		});

		if (!chat) return res.status(404).json({ message: "Chat not found" });

		const userId = (req.user?._id || req.user?.id)?.toString();
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Unauthorized user profile context context" });
		}

		const buyerId = chat.buyer?._id?.toString() || chat.buyer?.toString();
		const sellerId = chat.seller?._id?.toString() || chat.seller?.toString();

		if (buyerId !== userId && sellerId !== userId) {
			return res.status(403).json({
				message: "You are not authorized",
			});
		}

		return res.status(200).json(chat);
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching the chat messages",
			error: error.message,
		});
	}
});

// to delete an entire chat
ChatRouter.delete("/:chatId", async (req, res) => {
	try {
		const userId = req.user._id;
		const chat = await ChatModel.findById(req.params.chatId);

		if (!chat) return res.status(404).json({ message: "Chat not found" });

		// to ensure the user is part of the chat
		if (
			chat.buyer.toString() !== userId.toString() &&
			chat.seller.toString() !== userId.toString()
		) {
			return res.status(403).json({
				message: "You are not authorized",
			});
		}

		await ChatModel.findByIdAndDelete(req.params.chatId);
		return res.json({ message: "Chat deleted successfully!" });
	} catch (error) {
		return res.status(500).json({
			message: "Error fetching the chat messages",
			error: error.message,
		});
	}
});

// to delete a specific message
ChatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
	try {
		const userId = req.user._id;
		const chat = await ChatModel.findById(req.params.chatId);

		if (!chat) return res.status(404).json({ message: "Chat not found" });

		const message = chat.messages.id(req.params.messageId);
		if (!message) return res.status(404).json({ message: "Message not found" });

		// only sender can delete their messaege
		if (message.sender.toString() !== userId.toString()) {
			return res.status(403).json({
				message: "Not authorized to delete this message",
			});
		}

		chat.messages.pull(req.params.messageId);
		await chat.save();
		res.json({ message: "Message deleted successfully" });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching the chat messages",
			error: error.message,
		});
	}
});

export default ChatRouter;
