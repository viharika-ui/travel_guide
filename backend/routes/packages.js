import express from "express";
import Package from "../models/Package.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Package.find();
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const data = await Package.findById(req.params.id);
  res.json(data);
});

export default router;

