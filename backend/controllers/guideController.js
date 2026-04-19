import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import guideModel from "../models/guideModel.js";
import bookingModel from "../models/bookingModel.js"; // same as appointmentModel — rename/alias as needed
import userModel from "../models/userModel.js";

// ─── Guide Login ──────────────────────────────────────────────────────────────
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
    const { about, fee, address, available } = req.body;
    const imageFile = req.file;

    await guideModel.findByIdAndUpdate(guideId, {
      about,
      fee,
      address: JSON.parse(address),
      available: available === "true",
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      await guideModel.findByIdAndUpdate(guideId, {
        image: imageUpload.secure_url,
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
    const bookings = await bookingModel.find({ guideId });

    let earnings = 0;
    bookings.forEach((b) => {
      if (b.isCompleted || b.payment) earnings += b.amount;
    });

    const tourists = [...new Set(bookings.map((b) => b.userId))];

    const latestBookings = await Promise.all(
      bookings.slice(-5).map(async (b) => {
        const userData = await userModel.findById(b.userId).select("-password");
        return { ...b._doc, userData };
      })
    );

    const dashData = {
      earnings,
      bookings: bookings.length,
      tourists: tourists.length,
      latestBookings: latestBookings.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
