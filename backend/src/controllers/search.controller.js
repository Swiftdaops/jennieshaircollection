import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const searchProducts = async (req, res) => {
  const q = req.query.q || "";

  const products = await Product.find({
    $text: { $search: q },
  });

  res.json(products);
};

export const searchSuggestions = async (req, res) => {
  const q = req.query.q || "";

  const products = await Product.find({ name: new RegExp(q, "i") }).limit(5);
  const categories = await Category.find({ name: new RegExp(q, "i") }).limit(5);

  res.json({
    products: products.map(p => p.name),
    categories: categories.map(c => c.name),
    tags: [],
  });
};
