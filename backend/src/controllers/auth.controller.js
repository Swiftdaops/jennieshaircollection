import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS).json({ success: true });
};

export const logoutAdmin = async (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS).json({ success: true });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
