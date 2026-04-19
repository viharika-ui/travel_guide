import jwt from "jsonwebtoken";

// Add this middleware to your existing middlewares folder (authMiddleware.js or similar)
// Usage: import { authGuide } from "../middlewares/authMiddleware.js"

const authGuide = async (req, res, next) => {
  try {
    const { gtoken } = req.headers;

    if (!gtoken) {
      return res.json({ success: false, message: "Not authorized. Login again." });
    }

    const token_decode = jwt.verify(gtoken, process.env.JWT_SECRET);
    req.guide = { guideId: token_decode.id };
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default authGuide;
