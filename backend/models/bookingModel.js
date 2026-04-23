import mongoose from "mongoose";

// This is the equivalent of your appointmentModel but for tour bookings.
// If you already have appointmentModel.js, you can EITHER:
//   (a) rename "appointment" fields to "booking" and reuse it, OR
//   (b) create this as a separate bookingModel.js
//
// The guideController.js references bookingModel — point it to whichever you choose.

const bookingSchema = new mongoose.Schema({
  userId:       { type: String, required: true },
  guideId:      { type: String, required: true },
  slotDate:     { type: String, required: true },   // "21_07_2025"
  slotTime:     { type: String, required: true },   // "10:00 am"
  userData:     { type: Object, required: true },
  guideData:    { type: Object, required: true },
  amount:       { type: Number, required: true },
  date:         { type: Number, required: true },
  accepted:     { type: Boolean, default: false },
  cancelled:    { type: Boolean, default: false },
  payment:      { type: Boolean, default: false },
  paymentStatus:{ type: String, default: "unpaid" }, // unpaid | cash_pending | paid
  paymentMethod:{ type: String, default: "cash" },   // cash | online
  paymentId:    { type: String, default: "" },
  isCompleted:  { type: Boolean, default: false },
  tourType:     { type: String, default: "" },      // e.g. "Heritage", "Adventure"
  groupSize:    { type: Number, default: 1 },
  notes:        { type: String, default: "" },      // special requests
  reviewRating: { type: Number, min: 1, max: 5, default: null },
  reviewText:   { type: String, default: "" },
  reviewedAt:   { type: Date, default: null },
  isReviewed:   { type: Boolean, default: false },
});

const bookingModel =
  mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel;
