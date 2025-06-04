require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");

const User = require("./models/User");
const ChatRoom = require("./models/ChatRoom");
const Message = require("./models/Message");
const Product = require("./models/Product");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"], // 반드시 지정해야 함
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 8000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

app.get("/", (req, res) => {
  res.send("test");
});

io.on("connection", (socket) => {
  console.log("클라이언트 연결: ", socket.id);

  socket.on("joinRoom", async ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log(`${socket.id} joined room ${chatRoomId}`);
  });

  socket.on("joinUser", async ({ uid }) => {
    socket.join(uid);
    console.log(`${uid} 연결`);
  });

  socket.on("sendMessage", async ({ chatRoomId, senderId, message }) => {
    try {
      console.log(`메세지 전송: ${chatRoomId}, ${senderId}, ${message}`);
      if (!chatRoomId || !senderId || !message) return;

      const newMessage = await Message.create({
        chatRoomId,
        senderId,
        message,
        sentAt: new Date(),
        read: false,
      });

      await ChatRoom.findByIdAndUpdate(chatRoomId, { updatedAt: new Date() });

      const chatRoomData = await ChatRoom.findById(chatRoomId).populate(
        "participants",
        "_id"
      );

      io.to(chatRoomId).emit("newMessage", newMessage);
      chatRoomData.participants.forEach((user) => {
        const userId = user._id.toString();
        io.to(userId).emit("msgListUpdate");
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 해제: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`서버 실행(${PORT})`);
});
