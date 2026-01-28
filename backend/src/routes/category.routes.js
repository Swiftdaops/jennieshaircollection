import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllCategories);

// Admin
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
