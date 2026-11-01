import express from "express";
import {
  getProperties,
  getPropertyById,
  getCitiesSummary,
  createProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/cities-summary", getCitiesSummary);
router.get("/:id", getPropertyById);
router.post("/", protect, createProperty);

export default router;
