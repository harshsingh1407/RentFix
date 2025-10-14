export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { loginUser } from "../../../../lib/auth.js";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.email || !body.password)
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });

    const user = await loginUser(body);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
