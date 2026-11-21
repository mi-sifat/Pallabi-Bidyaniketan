import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

// Helper to check where a media URL is currently used in the system
async function checkMediaUsage(url: string) {
  const [
    teachers,
    slides,
    popups,
    events,
    albums,
    galleryImages,
    news,
  ] = await Promise.all([
    prisma.teacher.findMany({ where: { photoUrl: url }, select: { nameBn: true, nameEn: true } }),
    prisma.homepageSlide.findMany({ where: { imageUrl: url }, select: { titleBn: true, titleEn: true } }),
    prisma.announcementPopup.findMany({ where: { imageUrl: url }, select: { titleBn: true, titleEn: true } }),
    prisma.schoolEvent.findMany({ where: { coverImageUrl: url }, select: { titleBn: true, titleEn: true } }),
    prisma.galleryAlbum.findMany({ where: { coverImageUrl: url }, select: { titleBn: true, titleEn: true } }),
    prisma.galleryImage.findMany({ where: { imageUrl: url }, select: { captionBn: true, album: { select: { titleBn: true } } } }),
    prisma.news.findMany({ where: { coverImageUrl: url }, select: { slug: true } }),
  ]);

  const places: string[] = [];
  if (teachers.length > 0) places.push(`শিক্ষক প্রোফাইল (${teachers.map((t) => t.nameBn || t.nameEn).slice(0, 3).join(", ")})`);
  if (slides.length > 0) places.push(`হোমপেজ স্লাইডার (${slides.length}টি স্লাইড)`);
  if (popups.length > 0) places.push(`জরুরি ঘোষণা পপ-আপ (${popups.length}টি)`);
  if (events.length > 0) places.push(`ইভেন্ট কভার (${events.length}টি)`);
  if (albums.length > 0) places.push(`গ্যালারি অ্যালবাম কভার (${albums.length}টি)`);
  if (galleryImages.length > 0) places.push(`গ্যালারি আলোকচিত্র (${galleryImages.length}টি)`);
  if (news.length > 0) places.push(`সংবাদ/ব্লগ কভার (${news.length}টি)`);

  return places;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const checkUsageUrl = searchParams.get("checkUsage");
  const limit = parseInt(searchParams.get("limit") || "100");

  if (checkUsageUrl) {
    const places = await checkMediaUsage(checkUsageUrl);
    return NextResponse.json({ success: true, inUse: places.length > 0, places });
  }

  const where: Record<string, unknown> = {
    ...(category && category !== "all" ? { category } : {}),
    ...(q
      ? {
          OR: [
            { originalName: { contains: q } },
            { caption: { contains: q } },
            { altText: { contains: q } },
          ],
        }
      : {}),
  };

  try {
    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error("Fetch media error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";
    const caption = (formData.get("caption") as string) || "";
    const altText = (formData.get("altText") as string) || caption || "";
    const folder = (formData.get("folder") as string) || category || "media";

    if (!file) {
      return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "শুধুমাত্র ছবি আপলোড করতে পারবেন (JPG, PNG, WebP)" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `ফাইলের আকার সর্বোচ্চ ${process.env.MAX_FILE_SIZE_MB || 10}MB হতে পারবে` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeFilename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, safeFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeFilename}`;

    const media = await prisma.media.create({
      data: {
        filename: safeFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: publicUrl,
        folder,
        category,
        caption: caption || file.name,
        altText: altText || file.name,
        uploadedById: session.user.id,
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      media,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "ছবি আপলোড ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, caption, altText, category } = body;
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updated = await prisma.media.update({
      where: { id },
      data: {
        ...(caption !== undefined ? { caption } : {}),
        ...(altText !== undefined ? { altText } : {}),
        ...(category !== undefined ? { category } : {}),
      },
    });

    return NextResponse.json({ success: true, media: updated });
  } catch (error) {
    console.error("Update media error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const force = searchParams.get("force") === "true";

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "ছবি পাওয়া যায়নি" }, { status: 404 });
    }

    // Safety check: is this image in use?
    const inUsePlaces = await checkMediaUsage(media.url);
    if (inUsePlaces.length > 0 && !force) {
      return NextResponse.json(
        {
          error: `এই ছবিটি বর্তমানে ব্যবহৃত হচ্ছে: ${inUsePlaces.join("; ")}। ডিলিট করার আগে সংশ্লিষ্ট সেকশন থেকে ছবিটি পরিবর্তন করুন।`,
          inUse: true,
          places: inUsePlaces,
        },
        { status: 409 }
      );
    }

    try {
      const filePath = join(process.cwd(), "public", media.url);
      await unlink(filePath);
    } catch {
      // file might not exist on disk
    }

    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "ছবি সফলভাবে মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
