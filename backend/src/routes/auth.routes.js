import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getMe
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/auth.schema.js";

const router = express.Router();

router.post("/login", validate(loginSchema), loginAdmin);
router.post("/logout", protect, logoutAdmin);
router.get("/me", protect, getMe);

export default router;
