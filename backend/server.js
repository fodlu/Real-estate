import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/DB.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import contactRouter from "./routes/contact.routes.js";
import adminRouter from "./routes/admin.routes.js";
import ChatRouter from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// middlewares
// to make the server only connect to this port address only
const allowedOrigins = ["http://localhost:5173"].filter(Boolean);
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	}),
);
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/chat", ChatRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
	res.send("Welcome to the RealEstate server");
});

const server = http.createServer(app);

// socket io setup
const io = new Server(server, {
	cors: {
		origin: "allowedOrigins",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
	});

	socket.on("sendMessage", (data) => {
		io.to(data.chatId.emit("sendMessage", data));
	});

	socket.on("disconnected", () => {});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
