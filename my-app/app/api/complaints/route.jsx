import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import Complaint from "../../../models/Complaint.js";
import { getUserFromToken } from "../../../lib/auth.js";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized", complaints: [] }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token", complaints: [] }, { status: 401 });

    let complaints;
    if (user.role === "landlord") {
      complaints = await Complaint.find({ landlordId: user._id }).populate("userId", "name email");
    } else if (user.role === "tenant") {
      complaints = await Complaint.find({ userId: user._id }).populate("landlordId", "name email");
    } else {
      complaints = [];
    }

    return NextResponse.json({ complaints });
  } catch (err) {
    console.error("GET complaints error:", err);
    return NextResponse.json({ error: err.message, complaints: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    if (user.role !== "tenant") return NextResponse.json({ error: "Only tenants can create complaints" }, { status: 403 });

    const { title, description, category } = await req.json();
    if (!title || !description) return NextResponse.json({ error: "Title and description are required" }, { status: 400 });

    if (!user.relatedUser) return NextResponse.json({ error: "Tenant does not have an assigned landlord" }, { status: 400 });

    const complaint = await Complaint.create({
      userId: user._id,
      landlordId: user.relatedUser,
      title,
      description,
      category: category || "general",
      status: "pending",
    });

    return NextResponse.json({ message: "Complaint created successfully", complaint });
  } catch (err) {
    console.error("POST complaint error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
