// models/Product.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const productSchema = new Schema(
  {
    images: { type: [String], required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    saleRegion: { type: String, required: true },
    description: { type: String },
    sellerId: { type: Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["판매중", "판매완료"], required: true },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
