import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  toggleFavorite,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/favorites/:propertyId", protect, toggleFavorite);

export default router;
