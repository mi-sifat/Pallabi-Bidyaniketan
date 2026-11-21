import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { createHash } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdmZip from "adm-zip";

const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
const MAX_ZIP_SIZE = 200 * 1024 * 1024; // 200MB

// Auto-classify photo based on filename patterns
function classifyPhoto(filename: string): string {
  const lower = filename.toLowerCase();
  if (/sport|cricket|football|game|race|run|jump|athletic|খেলা|ক্রীড়া/.test(lower)) return "Annual Sports";
  if (/cultural|culture|dance|music|নাচ|সংগীত|সাংস্কৃতিক|program|programme/.test(lower)) return "Cultural Programs";
  if (/science|fair|বিজ্ঞান|lab|experiment/.test(lower)) return "Science Fair";
  if (/national|day|independence|victory|martyr|বিজয়|স্বাধীন|শহীদ|একুশে|২১/.test(lower)) return "National Days";
  if (/tour|trip|visit|পর্যটন|ভ্রমণ/.test(lower)) return "Study Tours";
  if (/prize|award|result|পুরস্কার|পদক|সনদ|certificate/.test(lower)) return "Prize Giving";
  if (/teacher|staff|faculty|শিক্ষক/.test(lower)) return "Teachers";
  if (/student|শিক্ষার্থী|ছাত্র/.test(lower)) return "Students";
  if (/class|classroom|শ্রেণি/.test(lower)) return "Classroom";
  if (/library|গ্রন্থাগার/.test(lower)) return "Library";
  if (/computer|কম্পিউটার/.test(lower)) return "Computer Lab";
  if (/campus|building|school|বিদ্যালয়|স্কুল/.test(lower)) return "School Campus";
  return "School Events";
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const zipFile = formData.get("zipFile") as File | null;

    if (!zipFile) {
      return NextResponse.json({ error: "No ZIP file provided" }, { status: 400 });
    }

    if (zipFile.size > MAX_ZIP_SIZE) {
      return NextResponse.json({ error: "ZIP file too large (max 200MB)" }, { status: 400 });
    }

    const zipBuffer = Buffer.from(await zipFile.arrayBuffer());
    const zip = new AdmZip(zipBuffer);
    const entries = zip.getEntries();

    const uploadDir = join(process.cwd(), "public", "uploads", "imported");
    await mkdir(uploadDir, { recursive: true });

    const results = [];
    const skipped = [];

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryName = entry.entryName;
      const ext = entryName.split(".").pop()?.toLowerCase() || "";

      if (!ALLOWED_IMAGE_EXTS.includes(ext)) continue;

      const entryData = entry.getData();

      // Duplicate detection by MD5 hash
      const hash = createHash("md5").update(entryData).digest("hex");
      const existing = await prisma.media.findFirst({ where: { altText: `hash:${hash}` } });
      if (existing) {
        skipped.push({ name: entryName, reason: "duplicate" });
        continue;
      }

      const originalName = entryName.split("/").pop() || entryName;
      const safeFilename = `${randomUUID()}.${ext}`;
      const filePath = join(uploadDir, safeFilename);
      await writeFile(filePath, entryData);

      const publicUrl = `/uploads/imported/${safeFilename}`;
      const suggestedCategory = classifyPhoto(originalName);

      const mediaRecord = await prisma.media.create({
        data: {
          filename: safeFilename,
          originalName,
          mimeType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          size: entryData.length,
          url: publicUrl,
          folder: "imported",
          category: suggestedCategory,
          caption: originalName,
          altText: `hash:${hash}`,
          uploadedById: session.user.id,
          verificationStatus: "PENDING_VERIFICATION",
          isPublished: false,
        },
      });

      results.push({
        ...mediaRecord,
        suggestedCategory,
      });
    }

    return NextResponse.json({
      success: true,
      imported: results.length,
      skipped: skipped.length,
      files: results,
      skippedFiles: skipped,
    });
  } catch (error) {
    console.error("ZIP import error:", error);
    return NextResponse.json({ error: "ZIP import failed" }, { status: 500 });
  }
}
