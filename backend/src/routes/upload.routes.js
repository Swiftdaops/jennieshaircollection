import express from "express";
import multer from "multer";
import {
  uploadProductImages
} from "../controllers/upload.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post(
  "/product-images",
  protect,
  adminOnly,
  upload.array("images", 5),
  uploadProductImages
);

export default router;
