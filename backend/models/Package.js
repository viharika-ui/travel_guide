// import mongoose from "mongoose";

// const packageSchema = new mongoose.Schema(
//   {
//     title: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
//     description: { type: mongoose.Schema.Types.Mixed, default: {} },
//     destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
//     duration: { type: String, default: "" },
//     price: { type: Number, required: true },
//     itinerary: [
//       {
//         type: mongoose.Schema.Types.Mixed,
//         default: {},
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Package", packageSchema);
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: String,
  type: String,
  pricePerNight: Number,
});

const transportSchema = new mongoose.Schema({
  type: String,
  provider: String,
  price: Number,
});

const packageSchema = new mongoose.Schema({
  title: String,
  city: String,
  state: String,
  days: Number,
  nights: Number,
  price: Number,
  description: String,
  image: String,

  hotels: [hotelSchema],
  transport: [transportSchema],
});

export default mongoose.model("Package", packageSchema);

