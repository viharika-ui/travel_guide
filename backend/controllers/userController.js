import User from "../models/User.js";
import { SUPPORTED_LANGS } from "../config/constants.js";

// ── GET /profile ──────────────────────────────────────────────
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("wishlist", "name images state")       // shows destination name+image
      .populate("savedPackages", "title price duration"); // shows package summary
      console.log("REQ.USER:", req.user);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /profile ────────────────────────────────────────────
// export async function updateProfile(req, res, next) {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const allowedFields = [
//       // Basic info
//       "name",
//       "phone",
//       "age",
//       "gender",
//       "address",
//       "city",
//       "state",
//       "country",
//       "emergencyContact",
//       "passportNumber",
//       // Travel preferences (new)
//       "travelStyle",
//       "preferredActivities",
//       "dietaryPreferences",
//       // Settings (new)
//       "notificationsEnabled",
//       "preferredLanguage",
//     ];

//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         // Validate preferredLanguage if SUPPORTED_LANGS is defined
//         if (field === "preferredLanguage") {
//           if (SUPPORTED_LANGS.includes(req.body[field])) {
//             user[field] = req.body[field];
//           }
//         } else {
//           user[field] = req.body[field];
//         }
//       }
//     });

//     await user.save();

//     const updated = await User.findById(user._id)
//       .select("-password")
//       .populate("wishlist", "name images state")
//       .populate("savedPackages", "title price duration");

//     res.json({ user: updated });
//   } catch (err) {
//     next(err);
//   }
// }

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ auth middleware sets req.user

    const {
      name, phone, age, gender,
      address, city, state, country,
      emergencyContact, passportNumber,
      travelStyle, preferredActivities, dietaryPreferences,
      notificationsEnabled, preferredLanguage,
    } = req.body;

    if (!name) {
      return res.json({ success: false, message: "Data missing" });
    }

    const SUPPORTED_LANGS = ["en", "hi", "ta", "te", "bn"];
    if (preferredLanguage && !SUPPORTED_LANGS.includes(preferredLanguage)) {
      return res.json({ success: false, message: "Unsupported language" });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        name, phone, age, gender,
        address, city, state, country,
        emergencyContact, passportNumber,
        travelStyle, preferredActivities, dietaryPreferences,
        notificationsEnabled,
        ...(preferredLanguage && { preferredLanguage }),
      },
      { new: true }
    );

    // Re-fetch and return updated user so frontend can setUser()
    const updated = await User.findById(userId).select("-password");

    res.json({ success: true, message: "Profile updated", user: updated });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// ── Wishlist ──────────────────────────────────────────────────
export async function addToWishlist(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.params.destinationId } },
      { new: true }
    )
      .select("-password")
      .populate("wishlist", "name images state");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.destinationId } },
      { new: true }
    )
      .select("-password")
      .populate("wishlist", "name images state");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// ── Saved packages ────────────────────────────────────────────
export async function savePackage(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedPackages: req.params.packageId } },
      { new: true }
    )
      .select("-password")
      .populate("savedPackages", "title price duration");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// ── Admin ─────────────────────────────────────────────────────
export async function listUsers(req, res, next) {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserByAdmin(req, res, next) {
  try {
    const { role, preferredLanguage, loyaltyPoints } = req.body;
    const updates = {};
    if (role != null) updates.role = role;
    if (loyaltyPoints != null) updates.loyaltyPoints = loyaltyPoints;
    if (preferredLanguage != null && SUPPORTED_LANGS.includes(preferredLanguage)) {
      updates.preferredLanguage = preferredLanguage;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}