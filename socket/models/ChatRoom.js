// models/ChatRoom.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const chatRoomSchema = new Schema(
  {
    participants: {
      type: [Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: "participants는 정확히 2명의 사용자 ID 배열이어야 합니다.",
      },
    },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

chatRoomSchema.index({ productId: 1, participants: 1 }, { unique: true });

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
