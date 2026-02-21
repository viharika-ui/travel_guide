import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  packageId: String,
  days: Number,
  hotel: String,
  transport: String,
  needGuide: Boolean,
  totalPrice: Number,

  paymentId: String,
  paymentStatus: { type: String, default: "pending" },

  travelDate: Date
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
