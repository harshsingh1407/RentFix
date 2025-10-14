export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth.js";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No token provided");

    const token = authHeader.split(" ")[1]; // Bearer token
    const user = await getUserFromToken(token);

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
}
