import express from "express";
import { register, login, googleAuth, logout, me, googleRedirect, googleCallback,
  adminLogin, 
  guideLogin, } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.post("/logout", auth, logout);
router.get("/me", auth, me);
router.post("/admin/login", adminLogin);
router.post("/guide/login", guideLogin);
export default router;
