import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Complaint from "../../../../models/Complaint";
import Notification from "../../../../models/Notification";
import { getUserFromToken } from "../../../../lib/auth";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;

    const complaint = await Complaint.findById(id)
      .populate("userId", "name email")
      .populate("landlordId", "name email");

    if (!complaint) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });

    // Only the tenant who filed it or the landlord it belongs to can view it
    const isOwnerTenant = complaint.userId._id.toString() === user._id.toString();
    const isOwnerLandlord = complaint.landlordId._id.toString() === user._id.toString();

    if (!isOwnerTenant && !isOwnerLandlord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ complaint, role: user.role });
  } catch (error) {
    console.error("GET complaint by ID error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const complaint = await Complaint.findById(id);
    if (!complaint) return NextResponse.json({ error: "Complaint not found" }, { status: 404 });

    if (user.role !== "landlord" || complaint.landlordId.toString() !== user._id.toString())
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const oldStatus = complaint.status;
    const newStatus = body.status || oldStatus;

    complaint.status = newStatus;
    await complaint.save();

    // Notify tenant if status has changed
    if (oldStatus !== newStatus) {
      try {
        await Notification.create({
          recipientId: complaint.userId,
          senderId: user._id,
          complaintId: complaint._id,
          message: `Status of complaint "${complaint.title}" updated to "${newStatus}"`,
          type: "status_change",
        });
      } catch (notifErr) {
        console.error("Failed to create notification:", notifErr);
      }
    }

    return NextResponse.json({ message: "Complaint updated", complaint });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
