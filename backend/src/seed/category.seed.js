import mongoose from "mongoose";
import Category from "../models/Category.js";
import dotenv from "dotenv";

dotenv.config();

const categories = [
  { name: "Wigs", description: "Luxury human hair wigs" },
  { name: "Hair Extensions", description: "Premium hair bundles" },
  { name: "Accessories", description: "Wig caps, combs, brushes" },
  { name: "Hair Creams", description: "Styling and treatment creams" },
];

const seedCategories = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Category.deleteMany();
  await Category.insertMany(categories);

  console.log("Categories seeded");
  process.exit();
};

seedCategories();
