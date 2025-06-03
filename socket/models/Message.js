// models/Message.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const messageSchema = new Schema({
  chatRoomId: { type: Types.ObjectId, ref: "ChatRoom", required: true },
  senderId: { type: Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Message", messageSchema);
