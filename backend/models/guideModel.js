import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    speciality: { type: String, required: true }, // e.g. "Heritage Tours", "Adventure Trekking"
    degree: { type: String, required: true },      // e.g. "Certified Tour Guide"
    experience: { type: String, required: true },  // e.g. "5 Year"
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fee: { type: Number, required: true },          // fee per day / per tour
    address: { type: Object, default: {} },         // { line1, line2 }
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    languages: { type: [String], default: [] },     // e.g. ["English", "Hindi", "Odia"]
    regions: { type: [String], default: [] },       // e.g. ["Odisha", "Rajasthan"]
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { minimize: false }
);

const guideModel =
  mongoose.models.guide || mongoose.model("guide", guideSchema);

export default guideModel;
