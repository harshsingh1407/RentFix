import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../lib/auth.js";

// Max file size: 4MB per file, max 5 files
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    if (user.role !== "tenant") {
      return NextResponse.json({ error: "Only tenants can upload media" }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      if (typeof file === "string") continue; // skip non-file entries

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type "${file.type}" is not allowed. Use JPG, PNG, GIF, WebP, MP4, WebM, or MOV.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.byteLength > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 4MB size limit.` },
          { status: 400 }
        );
      }

      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      const fileType = ALLOWED_IMAGE_TYPES.includes(file.type) ? "image" : "video";

      results.push({
        url: dataUrl,
        type: fileType,
        filename: file.name,
      });
    }

    return NextResponse.json({ mediaFiles: results });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
