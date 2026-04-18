import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  displayName: { type: String },
  avatarUrl: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["user", "rider", "restaurant", "admin"], default: "user" },
  isAdmin: { type: Boolean, default: false },
  riderStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
  vehicleType: { type: String },
  idImageUrl: { type: String },
  lastDeliveryAddress: { type: Object },
  dietaryPreferences: [{ type: String }],
  restaurantName: { type: String },
  restaurantAddress: { type: String },
  restaurantDescription: { type: String },
  hasCompletedTour: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Profile = mongoose.model("Profile", profileSchema);
