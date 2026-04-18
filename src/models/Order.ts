import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  riderId: { type: String },
  items: { type: mongoose.Schema.Types.Mixed, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "restaurant_accepted", "ready", "rider_accepted", "picked_up", "on_the_way", "arrived", "delivered", "cancelled"],
    default: "pending" 
  },
  deliveryLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  driverLocation: {
    lat: { type: Number },
    lng: { type: Number },
    lastUpdated: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);
