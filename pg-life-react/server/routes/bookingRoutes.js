import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createBooking);
router.get("/my", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

export default router;
