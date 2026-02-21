import express from "express";
import Booking from "../models/Booking.js";
import { auth } from "../middleware/auth.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const router = express.Router();

/* CREATE BOOKING AFTER PAYMENT SUCCESS */
router.post("/", auth, async (req, res) => {
  try {
    const bookingData = req.body;

    const booking = await Booking.create({
      user: req.user.userId,
      ...bookingData,
      status: "confirmed",
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* GET USER BOOKINGS */
router.get("/my", auth, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.userId })
    .sort({ createdAt: -1 });

  res.json(bookings);
});
router.get("/key", (req,res)=>{
  console.log("KEY SENT:", process.env.RAZORPAY_KEY_ID);
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});
router.post("/verify", auth, async (req, res) => {
  try {
    const { paymentId, bookingData } = req.body;

    // Here we just save booking after payment success
    const booking = await Booking.create({
      user: req.user.userId,
      ...bookingData,
      paymentId,
      status: "confirmed",
    });

    res.json({ success: true, booking });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Verification failed" });
  }
});


export default router;
