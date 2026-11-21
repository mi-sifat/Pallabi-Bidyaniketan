import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = ["application/pdf"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

export async function POST(request: NextRequest) {
  // Auth check
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed. Allowed: images (JPEG, PNG, WebP) and PDF.` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${process.env.MAX_FILE_SIZE_MB || 10}MB` },
        { status: 400 }
      );
    }

    // Generate safe filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const safeFilename = `${randomUUID()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", folder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(uploadDir, safeFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeFilename}`;

    // Store in media library
    const media = await prisma.media.create({
      data: {
        filename: safeFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: publicUrl,
        folder,
        uploadedById: sessionUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaId: media.id,
      filename: safeFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}
