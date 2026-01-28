import Product from "../models/Product.js";
import { calculateFinalPrice } from "../services/pricing.service.js";
import { getSuggestions } from "../services/suggestion.service.js";

export const getProducts = async (_, res) => {
  const products = await Product.find().populate("category");
  res.json(products.map(p => calculateFinalPrice(p)));
};

export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category");
  if (!product) return res.status(404).json({ message: "Not found" });

  res.json(calculateFinalPrice(product));
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export const getProductSuggestions = async (req, res) => {
  const suggestions = await getSuggestions(req.params.id);
  res.json(suggestions);
};

export const getBestSellers = async (_, res) => {
  const products = await Product.find({ isBestSeller: true });
  res.json(products);
};

export const getDiscountedProducts = async (_, res) => {
  const products = await Product.find({ "discount.isActive": true });
  res.json(products.map(p => calculateFinalPrice(p)));
};
