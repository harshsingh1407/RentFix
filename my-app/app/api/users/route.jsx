import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import User from "../../../models/User.js";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    if (!role) return NextResponse.json({ users: [] });

    const users = await User.find({ role }).select("name email");
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
