import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    passwordHash: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created");
  process.exit();
};

seedAdmin();
