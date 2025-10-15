import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { registerUser } from "../../../../lib/auth";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password, role, landlordCode } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, password, role, landlordCode });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
