import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
import API_URL from "../../config";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const { user } = useAuth();
	const [socket, setSocket] = useState(null);
	const [activeChat, setActiveChat] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const activeChatRef = useRef(null);

	useEffect(() => {
		activeChatRef.current = activeChat;
	}, [activeChat]);

	useEffect(() => {
		setActiveChat(null);
		setNotifications([]);
	}, [user]);

	useEffect(() => {
		if (user) {
			const newSocket = io(API_URL);

			setSocket(newSocket);

			newSocket.on("receivedMessage", (data) => {
				if (activeChatRef.current?._id !== data.chatId) {
					setNotifications((prev) => [...prev, data]);
				}
			});

			return () => newSocket.close();
		}
	}, [user]);

	// to join a chat
	const joinChat = (chatId) => {
		if (socket) {
			socket.emit("joinChat", chatId);
		}
	};

	const leaveChat = (chatId) => {
		if (socket) {
			socket.emit("leave_room", chatId); // Emits a signal to your Express server
		}
	};

	const sendMessage = (messagePayload) => {
		if (!socket || !user) return null;

		try {
			const messageData = {
				chatId: messagePayload.chatId,
				sender: messagePayload.sender || {
					_id: user._id || user.id,
					name: user.name,
					profilePic: user.profilePic || "",
				},
				text: messagePayload.text,
				image: messagePayload.image || "",
				createdAt: messagePayload.createdAt || new Date(),
				_id: messagePayload._id,
			};

			socket.emit("sendMessage", messageData);

			return messageData;
		} catch (error) {
			console.error(
				"Failed to execute socket broadcast stream emission:",
				error,
			);
			return null;
		}
	};

	const value = {
		socket,
		activeChat,
		setActiveChat,
		joinChat,
		sendMessage,
		notifications,
		setNotifications,
		leaveChat,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
