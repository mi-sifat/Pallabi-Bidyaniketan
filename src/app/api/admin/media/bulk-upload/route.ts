import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const category = (formData.get("category") as string) || "general";
    const folder = (formData.get("folder") as string) || "media";
    const caption = (formData.get("caption") as string) || "";
    const sourcePostUrl = (formData.get("sourcePostUrl") as string) || "";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const results = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        continue;
      }
      if (file.size > MAX_SIZE) {
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeFilename = `${randomUUID()}.${ext}`;
      const filePath = join(uploadDir, safeFilename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${folder}/${safeFilename}`;

      const mediaRecord = await prisma.media.create({
        data: {
          filename: safeFilename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: publicUrl,
          folder,
          category,
          caption: caption || file.name,
          altText: caption || file.name,
          sourcePostUrl: sourcePostUrl || undefined,
          uploadedById: session.user.id,
          verificationStatus: "VERIFIED",
          isPublished: true,
        },
      });

      results.push(mediaRecord);
    }

    return NextResponse.json({
      success: true,
      uploadedCount: results.length,
      files: results,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: "Bulk upload failed" }, { status: 500 });
  }
}
