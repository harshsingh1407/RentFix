import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db.js";
import Complaint from "../../../models/Complaint.js";
import Notification from "../../../models/Notification.js";
import { getUserFromToken } from "../../../lib/auth.js";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB per file
const MAX_FILES = 5;

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized", complaints: [] }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token", complaints: [] }, { status: 401 });

    let complaints;
    if (user.role === "landlord") {
      complaints = await Complaint.find({ landlordId: user._id })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    } else if (user.role === "tenant") {
      complaints = await Complaint.find({ userId: user._id })
        .populate("landlordId", "name email")
        .sort({ createdAt: -1 });
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

    if (user.role !== "tenant")
      return NextResponse.json({ error: "Only tenants can create complaints" }, { status: 403 });

    if (!user.relatedUser)
      return NextResponse.json({ error: "Tenant does not have an assigned landlord" }, { status: 400 });

    const contentType = req.headers.get("content-type") || "";

    let title, description, category;
    let mediaFiles = [];

    // ─── Handle multipart/form-data (files + text fields) ───
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      title = formData.get("title");
      description = formData.get("description");
      category = formData.get("category") || "general";

      const files = formData.getAll("files");

      if (files.length > MAX_FILES) {
        return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed per complaint.` }, { status: 400 });
      }

      for (const file of files) {
        if (typeof file === "string" || !file?.name) continue;

        if (!ALLOWED_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `File type "${file.type}" is not supported.` },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (buffer.byteLength > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File "${file.name}" exceeds the 4 MB limit.` },
            { status: 400 }
          );
        }

        const base64 = buffer.toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;
        const fileType = ALLOWED_IMAGE_TYPES.includes(file.type) ? "image" : "video";

        mediaFiles.push({ url: dataUrl, type: fileType, filename: file.name });
      }
    } else {
      // ─── Handle plain JSON (no files) ───
      const body = await req.json();
      title = body.title;
      description = body.description;
      category = body.category || "general";
      mediaFiles = Array.isArray(body.mediaFiles) ? body.mediaFiles : [];
    }

    if (!title || !description)
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });

    const complaint = await Complaint.create({
      userId: user._id,
      landlordId: user.relatedUser,
      title,
      description,
      category,
      status: "pending",
      mediaFiles,
    });

    // Notify the landlord about the new tenant complaint
    try {
      await Notification.create({
        recipientId: user.relatedUser,
        senderId: user._id,
        complaintId: complaint._id,
        message: `New complaint "${title}" filed by ${user.name || user.email}`,
        type: "new_complaint",
      });
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    // Populate before returning
    await complaint.populate("userId", "name email");

    return NextResponse.json({ message: "Complaint created successfully", complaint });
  } catch (err) {
    console.error("POST complaint error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
