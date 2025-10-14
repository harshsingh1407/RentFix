export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth.js";
import User from "../../../../models/User.js";
import { connectDB } from "../../../../lib/db.js";

// ✅ GET user info
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

// ✅ PATCH - update name and email only
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
