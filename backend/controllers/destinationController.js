import Destination from "../models/Destination.js";
import { translateDoc, translateList } from "../utils/translate.js";

const MULTILINGUAL_FIELDS = ["name", "description"];

export async function list(req, res, next) {
  try {
    const lang = req.lang;
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    const { stateId, regionId } = req.query;
    const filter = {};
    if (stateId) filter.stateId = stateId;
    if (regionId) {
      const State = (await import("../models/State.js")).default;
      const stateIds = await State.find({ regionId }).distinct("_id");
      filter.stateId = { $in: stateIds };
    }
    const destinations = await Destination.find(filter).populate("stateId").sort({ createdAt: -1 }).lean();
    const translated = raw ? destinations : translateList(destinations, MULTILINGUAL_FIELDS, lang);
    res.json({ destinations: translated });
  } catch (err) {
    next(err);
  }
}

export async function listByRegion(req, res, next) {
  try {
    const State = (await import("../models/State.js")).default;
    const stateIds = await State.find({ regionId: req.params.regionId }).distinct("_id");
    const destinations = await Destination.find({ stateId: { $in: stateIds } })
      .populate("stateId")
      .sort({ createdAt: -1 })
      .lean();
    const translated = translateList(destinations, MULTILINGUAL_FIELDS, req.lang);
    res.json({ destinations: translated });
  } catch (err) {
    next(err);
  }
}

export const getOne = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const destination = await Destination.findOne({ id: id });

    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function create(req, res, next) {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ destination });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json({ destination });
  } catch (err) {
    next(err);
  }
}

export async function addImages(req, res, next) {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    const newPaths = req.body.images || [];
    destination.images = [...(destination.images || []), ...newPaths];
    await destination.save();
    res.json({ destination });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}
