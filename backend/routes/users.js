import express from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  getProfile,
  updateProfile,
  listUsers,
  updateUserByAdmin,
  addToWishlist,
  removeFromWishlist,
  savePackage,
} from "../controllers/userController.js";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const router = express.Router();

// ── Core profile ──────────────────────────────────────────────
router.get("/profile", auth, getProfile);

// Single unified PATCH — handles all profile fields + new fields
router.post("/profile/update", auth, updateProfile);

// Avatar upload
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    user.avatar = url;
    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
});

// ── Wishlist & saved packages ─────────────────────────────────
router.post("/wishlist/:destinationId", auth, addToWishlist);
router.delete("/wishlist/:destinationId", auth, removeFromWishlist);
router.post("/saved-packages/:packageId", auth, savePackage);

// ── Admin ─────────────────────────────────────────────────────
router.get("/", auth, admin, listUsers);
router.patch("/:id", auth, admin, updateUserByAdmin);

export default router;