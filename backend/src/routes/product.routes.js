import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getBestSellers,
  getDiscountedProducts,
  getProductSuggestions,
  updateStock,
  updateFrequentlyBought
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/best-sellers", getBestSellers);
router.get("/discounts", getDiscountedProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id/suggestions", getProductSuggestions);

// Admin
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.put("/:id/stock", protect, adminOnly, updateStock);
router.put("/:id/frequently-bought", protect, adminOnly, updateFrequentlyBought);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
