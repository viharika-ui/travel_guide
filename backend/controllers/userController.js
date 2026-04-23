import User from "../models/User.js";
import { SUPPORTED_LANGS } from "../config/constants.js";
import guideModel from "../models/guideModel.js";
import bookingModel from "../models/bookingModel.js";

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
//admin-only controllers below
export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserByAdmin(req, res, next) {
  try {
    const { role, preferredLanguage } = req.body;
    const updates = {};
    if (role != null) updates.role = role;
    if (preferredLanguage != null && SUPPORTED_LANGS.includes(preferredLanguage)) {
      updates.preferredLanguage = preferredLanguage;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function listGuides(req, res, next) {
  try {
    const guides = await guideModel
      .find({})
      .select("name image speciality experience degree about fee address languages regions rating reviewsCount available")
      .sort({ rating: -1, reviewsCount: -1, date: -1 })
      .lean();

    res.json({ guides });
  } catch (err) {
    next(err);
  }
}

export async function createGuideBooking(req, res, next) {
  try {
    const { guideId, slotDate, slotTime, tourType, groupSize, notes } = req.body;

    if (!guideId || !slotDate || !slotTime) {
      return res.status(400).json({ message: "guideId, slotDate, and slotTime are required" });
    }

    const guide = await guideModel.findById(guideId).lean();
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.available) {
      return res.status(400).json({ message: "Guide is currently unavailable" });
    }

    const slotsBooked = guide.slots_booked || {};
    const bookedSlotsForDay = slotsBooked[slotDate] || [];
    if (bookedSlotsForDay.includes(slotTime)) {
      return res.status(400).json({ message: "Selected slot is already booked" });
    }

    const userData = {
      name: req.user?.name || "Traveler",
      email: req.user?.email || "",
      phone: req.user?.phone || "",
    };

    const guideData = {
      name: guide.name,
      image: guide.image,
      speciality: guide.speciality,
      experience: guide.experience,
      fee: guide.fee,
      address: guide.address || {},
      languages: guide.languages || [],
      regions: guide.regions || [],
    };

    const booking = await bookingModel.create({
      userId: String(req.user._id),
      guideId: String(guide._id),
      slotDate,
      slotTime,
      userData,
      guideData,
      amount: Number(guide.fee) || 0,
      date: Date.now(),
      accepted: false,
      payment: false,
      paymentStatus: "unpaid",
      paymentMethod: "cash",
      paymentId: "",
      tourType: tourType || "",
      groupSize: Number(groupSize) || 1,
      notes: notes || "",
    });

    const nextSlots = { ...slotsBooked, [slotDate]: [...bookedSlotsForDay, slotTime] };
    await guideModel.findByIdAndUpdate(guideId, { slots_booked: nextSlots });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

export async function markGuidePayment(req, res, next) {
  try {
    const { bookingId, method, paymentId } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({ message: "bookingId and method are required" });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only update your own booking" });
    }

    if (booking.cancelled) {
      return res.status(400).json({ message: "Cancelled bookings cannot be paid" });
    }

    if (!booking.accepted) {
      return res.status(400).json({ message: "Please wait for guide acceptance" });
    }

    if (method === "cash") {
      booking.paymentMethod = "cash";
      booking.paymentStatus = "cash_pending";
      booking.payment = false;
      booking.paymentId = "";
    } else if (method === "online") {
      if (!paymentId) {
        return res.status(400).json({ message: "paymentId is required for online payments" });
      }
      booking.paymentMethod = "online";
      booking.paymentStatus = "paid";
      booking.payment = true;
      booking.paymentId = paymentId;
        booking.isCompleted = true;
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

export async function getMyGuideBookings(req, res, next) {
  try {
    const myGuideBookings = await bookingModel
      .find({ userId: String(req.user._id) })
      .sort({ date: -1 })
      .lean();

    res.json({ bookings: myGuideBookings });
  } catch (err) {
    next(err);
  }
}

export async function submitGuideReview(req, res, next) {
  try {
    const { bookingId, rating, reviewText } = req.body;
    const normalizedRating = Number(rating);

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can review only your own booking" });
    }

    if (booking.cancelled) {
      return res.status(400).json({ message: "Cancelled booking cannot be reviewed" });
    }

    if (!booking.isCompleted) {
      return res.status(400).json({ message: "Only completed bookings can be reviewed" });
    }

    if (booking.isReviewed) {
      return res.status(400).json({ message: "Review already submitted for this booking" });
    }

    booking.reviewRating = normalizedRating;
    booking.reviewText = (reviewText || "").trim();
    booking.reviewedAt = new Date();
    booking.isReviewed = true;
    await booking.save();

    const guideId = booking.guideId;
    const reviewedBookings = await bookingModel
      .find({ guideId, isReviewed: true })
      .select("reviewRating reviewText reviewedAt userData userId")
      .lean();

    const reviewsCount = reviewedBookings.length;
    const totalRating = reviewedBookings.reduce((sum, item) => sum + (item.reviewRating || 0), 0);
    const averageRating = reviewsCount > 0 ? Number((totalRating / reviewsCount).toFixed(1)) : 0;

    const recentReviews = reviewedBookings
      .sort((a, b) => new Date(b.reviewedAt || 0) - new Date(a.reviewedAt || 0))
      .slice(0, 20)
      .map((item) => ({
        rating: item.reviewRating,
        reviewText: item.reviewText || "",
        reviewedAt: item.reviewedAt,
        userName: item.userData?.name || "Traveler",
        userId: item.userId,
      }));

    await guideModel.findByIdAndUpdate(guideId, {
      rating: averageRating,
      reviewsCount,
      recentReviews,
    });

    res.json({
      success: true,
      message: "Review submitted successfully",
      review: {
        bookingId: booking._id,
        rating: booking.reviewRating,
        reviewText: booking.reviewText,
        reviewedAt: booking.reviewedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
