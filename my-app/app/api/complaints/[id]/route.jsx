import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Complaint from "../../../../models/Complaint";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(req, { params }) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = params;
    const body = await req.json();

    const complaint = await Complaint.findById(id);
    if (!complaint) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });

    if (user.role !== "landlord" || complaint.landlordId.toString() !== user._id.toString())
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    complaint.status = body.status || complaint.status;
    await complaint.save();

    return NextResponse.json({ message: "Complaint updated", complaint });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
