import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true },
  category: { type: String }, // e.g., "Mains", "Starters", "Drinks"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Menu = mongoose.model("Menu", menuSchema);
