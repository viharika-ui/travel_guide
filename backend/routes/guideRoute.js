import express from "express";
import multer from "multer";
import {
  guideLogin,
  guideRegister,
  getGuideProfile,
  updateGuideProfile,
  getGuideBookings,
  cancelBookingByGuide,
  acceptBookingByGuide,
  confirmCashPayment,
  completeBooking,
  getGuideDashboard,
} from "../controllers/guideController.js";
import authGuide from "../middleware/authGuide.js";

const guideRouter = express.Router();

// Multer setup for profile image upload (reuse your existing storage config)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// ── Public ──────────────────────────────────────────────────────────────────
guideRouter.post("/login", guideLogin);guideRouter.post("/register", upload.single("image"), guideRegister);
// ── Protected (requires gToken) ─────────────────────────────────────────────
guideRouter.get("/profile",          authGuide, getGuideProfile);
guideRouter.post("/update-profile",  authGuide, upload.single("image"), updateGuideProfile);
guideRouter.get("/appointments",     authGuide, getGuideBookings);
guideRouter.post("/accept-booking",  authGuide, acceptBookingByGuide);
guideRouter.post("/cancel-booking",  authGuide, cancelBookingByGuide);
guideRouter.post("/confirm-payment", authGuide, confirmCashPayment);
guideRouter.post("/complete-booking",authGuide, completeBooking);
guideRouter.get("/dashboard",        authGuide, getGuideDashboard);

export default guideRouter;

// ─── HOW TO REGISTER IN server.js / index.js ───────────────────────────────
// import guideRouter from "./routes/guideRoute.js";
// app.use("/api/guide", guideRouter);
