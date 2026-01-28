import express from "express";
import {
  checkoutOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { checkoutSchema } from "../validations/order.schema.js";

const router = express.Router();

// Customer (WhatsApp checkout)
router.post("/checkout", validate(checkoutSchema), checkoutOrder);

// Admin
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, adminOnly, getOrderById);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
