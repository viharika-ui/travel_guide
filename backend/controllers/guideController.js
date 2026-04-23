import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import guideModel from "../models/guideModel.js";
import bookingModel from "../models/bookingModel.js"; // same as appointmentModel — rename/alias as needed
import userModel from "../models/User.js";

// ─── Guide Login ──────────────────────────────────────────────────────────────
export const guideRegister = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fee } = req.body;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fee) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const existing = await guideModel.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Guide already exists with this email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser?.role === "admin") {
      return res.json({ success: false, message: "Admin email cannot be used for guide registration" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newGuide = new guideModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fee: Number(fee),
      image: imageUrl,
      date: Date.now()
    });

    const guide = await newGuide.save();

    if (existingUser) {
      if (!existingUser.password && password) {
        existingUser.password = password;
      }
      existingUser.role = "guide";
      existingUser.name = existingUser.name || name;
      await existingUser.save();
    } else {
      await userModel.create({ name, email, password, role: "guide" });
    }

    const token = jwt.sign({ id: guide._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const guideLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const guide = await guideModel.findOne({ email });

    if (!guide) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, guide.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: guide._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Get Guide Profile ────────────────────────────────────────────────────────
export const getGuideProfile = async (req, res) => {
  try {
    const { guideId } = req.guide; // set by authGuide middleware
    const profileData = await guideModel.findById(guideId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Update Guide Profile ─────────────────────────────────────────────────────
export const updateGuideProfile = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const { name, speciality, experience, degree, about, fee, address, available, languages, regions } = req.body;
    const imageFile = req.file;

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (speciality) updateData.speciality = speciality;
    if (experience) updateData.experience = experience;
    if (degree) updateData.degree = degree;
    if (about) updateData.about = about;
    if (fee) updateData.fee = fee;
    if (address) updateData.address = JSON.parse(address);
    if (available !== undefined) updateData.available = available === "true";
    if (languages) updateData.languages = JSON.parse(languages);
    if (regions) updateData.regions = JSON.parse(regions);

    await guideModel.findByIdAndUpdate(guideId, updateData);

    if (imageFile) {
      await guideModel.findByIdAndUpdate(guideId, {
        image: `/uploads/${imageFile.filename}`, // make sure the frontend concats backendUrl
      });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Get Guide Bookings ───────────────────────────────────────────────────────
export const getGuideBookings = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const appointments = await bookingModel.find({ guideId });

    // Attach userData
    let bookingsData = await Promise.all(
      appointments.map(async (booking) => {
        const userData = await userModel.findById(booking.userId).select("-password");
        return { ...booking._doc, userData };
      })
    );

    res.json({ success: true, appointments: bookingsData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Cancel Booking (by guide) ────────────────────────────────────────────────
export const cancelBookingByGuide = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);

    if (!bookingData || bookingData.guideId !== guideId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, { cancelled: true });

    // Release the slot
    const { slotDate, slotTime } = bookingData;
    const guideData = await guideModel.findById(guideId);
    let slots_booked = guideData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter((s) => s !== slotTime);
    await guideModel.findByIdAndUpdate(guideId, { slots_booked });

    res.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Accept Booking (by guide) ─────────────────────────────────────────────
export const acceptBookingByGuide = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);
    if (!bookingData || bookingData.guideId !== guideId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (bookingData.cancelled) {
      return res.json({ success: false, message: "Booking already cancelled" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, { accepted: true });
    res.json({ success: true, message: "Booking accepted" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Confirm Cash Payment (by guide) ───────────────────────────────────────
export const confirmCashPayment = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);
    if (!bookingData || bookingData.guideId !== guideId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    if (bookingData.cancelled) {
      return res.json({ success: false, message: "Booking cancelled" });
    }

    if (bookingData.paymentStatus !== "cash_pending") {
      return res.json({ success: false, message: "No cash payment pending" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, {
      payment: true,
      paymentStatus: "paid",
    });

    res.json({ success: true, message: "Cash payment confirmed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Complete Booking ─────────────────────────────────────────────────────────
export const completeBooking = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const { bookingId } = req.body;

    const bookingData = await bookingModel.findById(bookingId);

    if (!bookingData || bookingData.guideId !== guideId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, { isCompleted: true });
    res.json({ success: true, message: "Tour marked as completed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Guide Dashboard Data ─────────────────────────────────────────────────────
export const getGuideDashboard = async (req, res) => {
  try {
    const { guideId } = req.guide;
    const bookings = await bookingModel.find({ guideId }).sort({ date: -1 });
    const guide = await guideModel.findById(guideId).select("rating reviewsCount");

    let earnings = 0;
    bookings.forEach((b) => {
      if (b.isCompleted || b.payment) earnings += b.amount;
    });

    const tourists = [...new Set(bookings.map((b) => b.userId))];

    const latestBookings = await Promise.all(
      bookings.slice(0, 5).map(async (b) => {
        const userData = await userModel.findById(b.userId).select("-password");
        return { ...b._doc, userData };
      })
    );

    const latestReviews = bookings
      .filter((b) => b.isReviewed)
      .slice(0, 10)
      .map((b) => ({
        bookingId: b._id,
        userName: b.userData?.name || "Traveler",
        rating: b.reviewRating,
        reviewText: b.reviewText || "",
        reviewedAt: b.reviewedAt,
        slotDate: b.slotDate,
      }));

    const dashData = {
      earnings,
      bookings: bookings.length,
      tourists: tourists.length,
      latestBookings,
      averageRating: guide?.rating || 0,
      reviewsCount: guide?.reviewsCount || 0,
      latestReviews,
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
