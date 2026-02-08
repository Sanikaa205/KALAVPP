import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 files allowed" }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, WebP, GIF, AVIF allowed.`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large. Maximum 5MB allowed.`);
        continue;
      }

      // Generate unique filename
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}_${random}.${ext}`;

      // Write file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      uploadedUrls.push(`/uploads/${filename}`);
    }

    if (uploadedUrls.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    return NextResponse.json({
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
