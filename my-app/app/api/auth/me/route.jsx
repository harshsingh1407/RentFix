export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth.js";
import User from "../../../../models/User.js";
import Complaint from "../../../../models/Complaint.js";
import { connectDB } from "../../../../lib/db.js";
import bcrypt from "bcryptjs";

// GET user info
export async function GET(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No token provided");

    const token = authHeader.split(" ")[1];
    const user = await getUserFromToken(token);

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
}

// update name and email only
export async function PATCH(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No token provided");

    const token = authHeader.split(" ")[1];
    const user = await getUserFromToken(token);

    const { name, email } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// delete user and complaints
export async function DELETE(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No token provided");

    const token = authHeader.split(" ")[1];
    const user = await getUserFromToken(token);

    const { password } = await req.json();
    if (!password) throw new Error("Password is required");

    const dbUser = await User.findById(user._id).select("+password");
    if (!dbUser) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) throw new Error("Incorrect password");

    await Complaint.deleteMany({ userId: user._id });

    await User.findByIdAndDelete(user._id);

    return NextResponse.json({
      success: true,
      message: "Account and related complaints deleted successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
