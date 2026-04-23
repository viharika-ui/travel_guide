// import express from "express";
// import Destination from "../models/Destination.js";

// import {
//   getStates,
//   getDestinationsByState,
//   searchPlaces,
//   getDestination
// } from "../controllers/destinationController.js";

// const router = express.Router();
//  router.get("/detail/:id", async (req, res) => {
//   try {
//     // First try with populate
//     let destination = await Destination.findById(req.params.id).lean();

//     if (!destination) {
//       return res.status(404).json({ message: "Destination not found" });
//     }

//     // If state is an ObjectId, populate it manually
//     if (destination.state && typeof destination.state === "object" && destination.state._id) {
//       // already populated somehow
//     } else if (destination.state) {
//       // Try to get state name from State model
//       try {
//         const State = (await import("../models/State.js")).default;
//         const stateDoc = await State.findById(destination.state).lean();
//         if (stateDoc) {
//           destination.state  = stateDoc.name;
//           destination.region = stateDoc.region || "";
//         }
//       } catch (_) {}
//     }

//     res.json(destination);
//   } catch (err) {
//     console.error("Detail route error:", err); // ← will show exact error in terminal
//     res.status(500).json({ message: err.message });
//   }
// });
// router.get("/states", getStates);

// router.get("/destinations/:stateId", getDestinationsByState);

// router.get("/search", searchPlaces);

// router.get("/destination/:id", getDestination);

// export default router;

// backend/routes/destinations.js
import express from "express";
import Destination from "../models/Destination.js";
import State from "../models/State.js";

import {
  getStates,
  getDestinationsByState,
  searchPlaces,
  getDestination
} from "../controllers/destinationController.js";

const router = express.Router();

// ── GET /api/destinations/all  (used by Home.jsx) ─────────────────────────────
router.get("/all", async (req, res) => {
  try {
    const destinations = await Destination.find().lean();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/destinations/featured  (used by Home.jsx featured section) ───────
router.get("/featured", async (req, res) => {
  try {
    const destinations = await Destination.find().limit(6).lean();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/destinations/detail/:id ─────────────────────────────────────────
router.get("/detail/:id", async (req, res) => {
  try {
    let destination = await Destination.findById(req.params.id).lean();
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    if (destination.stateId) {
      try {
        const stateDoc = await State.findById(destination.stateId).lean();
        if (stateDoc) {
          destination.state = stateDoc.name;
          destination.regionId  = stateDoc.regionId || "";
        }
      } catch (_) {}
    }
    res.json(destination);
  } catch (err) {
    console.error("Detail route error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ── existing routes ───────────────────────────────────────────────────────────
router.get("/states", getStates);
router.get("/destinations/:stateId", getDestinationsByState);
router.get("/search", searchPlaces);
router.get("/destination/:id", getDestination);

export default router;