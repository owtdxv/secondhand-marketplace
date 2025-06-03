// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true, unique: true },
    profileImage: { type: String, default: null },
    socialId: { type: String, default: null },
    provider: {
      type: String,
      enum: ["local", "naver"],
      default: "local",
      required: true,
    },
    active: {
      type: String,
      enum: ["ACTIVE", "BANNED"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
