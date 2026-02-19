import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String, default: null },
    preferredLanguage: { type: String, default: "en" },
    avatar: { type: String, default: "" },

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
