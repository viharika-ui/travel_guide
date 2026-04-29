// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["user", "admin","guide"], default: "user" },
//     googleId: { type: String, default: null },
//     preferredLanguage: { type: String, default: "en" },
//     avatar: { type: String, default: "" },
//     phone: { type: String, default: "" },
//     age: { type: Number },
//     gender: { type: String, default: "" },
//     address: { type: String, default: "" },
//     city: { type: String, default: "" },
//     state: { type: String, default: "" },
//     country: { type: String, default: "" },
//     emergencyContact: { type: String, default: "" },
//     passportNumber: { type: String, default: "" }
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password") || !this.password) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = function (candidate) {
//   return bcrypt.compare(candidate, this.password || "");
// };

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: null },
    role: { type: String, enum: ["user", "admin","guide"], default: "user" },
    googleId: { type: String, default: null },
    preferredLanguage: { type: String, default: "en" },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    age: { type: Number, default: null },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    passportNumber: { type: String, default: "" },

    // ✅ NEW FIELDS
    travelStyle: {
      type: String,
      enum: ["budget", "luxury", "adventure", "cultural", ""],
      default: "",
    },
    preferredActivities: [{ type: String }],
    dietaryPreferences: { type: String, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
    savedPackages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
    loyaltyPoints: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password || "");
};

export default mongoose.model("User", userSchema);