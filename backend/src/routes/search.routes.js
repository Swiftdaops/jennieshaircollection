import express from "express";
import {
  searchProducts,
  searchSuggestions
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", searchProducts);
router.get("/suggestions", searchSuggestions);

export default router;
