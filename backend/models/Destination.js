import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },   // ⭐ important
  name: String,
  description: String,
  location: String,
  image: String,
  region: String,
  category: String,
  rating: Number,
  bestTime: String
});

export default mongoose.model("Destination", destinationSchema);