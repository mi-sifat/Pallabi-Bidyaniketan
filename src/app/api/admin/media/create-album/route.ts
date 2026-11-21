import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { randomUUID } from "crypto";

// POST /api/admin/media/create-album — create a gallery album from selected media IDs
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mediaIds, titleBn, titleEn, descriptionBn, descriptionEn } = body as {
      mediaIds: string[];
      titleBn: string;
      titleEn?: string;
      descriptionBn?: string;
      descriptionEn?: string;
    };

    if (!mediaIds || mediaIds.length === 0) {
      return NextResponse.json({ error: "No media IDs provided" }, { status: 400 });
    }
    if (!titleBn) {
      return NextResponse.json({ error: "Album title required" }, { status: 400 });
    }

    // Fetch media records
    const mediaItems = await prisma.media.findMany({ where: { id: { in: mediaIds } } });
    if (mediaItems.length === 0) {
      return NextResponse.json({ error: "No valid media items found" }, { status: 400 });
    }

    const baseSlug = slugify(titleEn || titleBn, { lower: true, strict: true });
    const slug = `${baseSlug}-${randomUUID().slice(0, 8)}`;

    const album = await prisma.galleryAlbum.create({
      data: {
        slug,
        titleBn,
        titleEn: titleEn || titleBn,
        descriptionBn,
        descriptionEn,
        coverImageUrl: mediaItems[0].url,
        isPublished: true,
        images: {
          create: mediaItems.map((m, i) => ({
            imageUrl: m.url,
            altText: m.caption || m.originalName,
            captionBn: m.caption,
            captionEn: m.caption,
            sortOrder: i,
            isPublished: true,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, album });
  } catch (error) {
    console.error("Create album error:", error);
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
