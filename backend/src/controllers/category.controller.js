import Category from "../models/Category.js";

export const getCategories = async (_, res) => {
  const categories = await Category.find().sort("name");
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
