import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const getRedirectUri = () => {
  const base = process.env.API_URL || process.env.BACKEND_URL || "http://localhost:5000";
  return `${base}/api/auth/google/callback`;
};
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  getRedirectUri()
);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function sendToken(res, user) {
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
  res.cookie("token", token, cookieOptions);
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      avatar: user.avatar,
    },
    token,
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already registered" });
    user = await User.create({ name, email, password });
    sendToken(res, user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    sendToken(res, user);
  } catch (err) {
    next(err);
  }
}

export async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.findOne({ email: payload.email });
      if (user) {
        user.googleId = payload.sub;
        await user.save();
      } else {
        user = await User.create({
          name: payload.name || payload.email,
          email: payload.email,
          googleId: payload.sub,
        });
      }
    }
    sendToken(res, user);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function googleRedirect(req, res, next) {
  try {
    const authUrl = client.generateAuthUrl({
      redirect_uri: getRedirectUri(),
      scope: ["profile", "email"],
      access_type: "offline",
      prompt: "consent",
    });
    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
}

export async function googleCallback(req, res, next) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const { code } = req.query;
    if (!code) return res.redirect(frontendUrl + "/login?error=no_code");
    const { tokens } = await client.getToken({ code, redirect_uri: getRedirectUri() });
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.findOne({ email: payload.email });
      if (user) {
        user.googleId = payload.sub;
        await user.save();
      } else {
        user = await User.create({
          name: payload.name || payload.email,
          email: payload.email,
          googleId: payload.sub,
        });
      }
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { ...cookieOptions, domain: undefined });
    res.redirect(frontendUrl + "/auth/google/callback?token=" + token);
  } catch (err) {
    next(err);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid admin credentials" });
    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ message: "Invalid admin credentials" });
    sendToken(res, user);
  } catch (err) {
    next(err);
  }
}

export async function guideLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "guide" });
    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid guide credentials" });
    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ message: "Invalid guide credentials" });
    sendToken(res, user);
  } catch (err) {
    next(err);
  }
}
