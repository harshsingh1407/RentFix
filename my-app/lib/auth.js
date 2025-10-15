import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./db.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function registerUser({ name, email, password, role, landlordCode }) {
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;

  if (role === "tenant") {
    if (!landlordCode) throw new Error("Tenant must provide landlord code");
    console.log("Tenant registration with code:", landlordCode);
    const landlord = await User.findOne({ role: "landlord", landlordCode });
    if (!landlord) {
    console.log("Invalid landlord code!");
    throw new Error("Invalid landlord code");
  }

    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "tenant",
      relatedUser: landlord._id,
    });
  } else if (role === "landlord") {
    const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "landlord",
      landlordCode: uniqueCode,
    });
  } else {
    throw new Error("Invalid role");
  }

  const token = generateToken(newUser._id);

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token,
    landlordCode: newUser.landlordCode || null,
  };
}

export async function loginUser({ email, password }) {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = generateToken(user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
    landlordCode: user.landlordCode || null,
  };
}

export async function getUserFromToken(token) {
  await connectDB();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
