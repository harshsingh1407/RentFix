import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import Notification from "../../../models/Notification.js";
import { getUserFromToken } from "../../../lib/auth.js";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized", notifications: [], unreadCount: 0 }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token", notifications: [], unreadCount: 0 }, { status: 401 });

    const notifications = await Notification.find({ recipientId: user._id })
      .populate("senderId", "name email")
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ recipientId: user._id, read: false });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error("GET notifications error:", err);
    return NextResponse.json({ error: err.message, notifications: [], unreadCount: 0 }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json().catch(() => ({}));

    if (body.notificationId) {
      await Notification.updateOne(
        { _id: body.notificationId, recipientId: user._id },
        { $set: { read: true } }
      );
    } else {
      // Mark all as read
      await Notification.updateMany(
        { recipientId: user._id, read: false },
        { $set: { read: true } }
      );
    }

    const unreadCount = await Notification.countDocuments({ recipientId: user._id, read: false });

    return NextResponse.json({ message: "Notifications updated", unreadCount });
  } catch (err) {
    console.error("PATCH notifications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
