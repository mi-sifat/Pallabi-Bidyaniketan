import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, albums });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titleBn, titleEn, category, coverImageUrl, descriptionBn, images } = body;

    if (!titleBn) {
      return NextResponse.json({ error: "অ্যালবামের নাম আবশ্যক" }, { status: 400 });
    }

    const slug = `${generateSlug(titleEn || titleBn)}-${Date.now()}`;

    const album = await prisma.galleryAlbum.create({
      data: {
        slug,
        titleBn,
        titleEn: titleEn || titleBn,
        category: category || "Events",
        coverImageUrl: coverImageUrl || (images && images[0]) || undefined,
        descriptionBn,
        descriptionEn: descriptionBn,
        albumDate: new Date(),
        isPublished: true,
        status: "PUBLISHED",
        images: {
          create: Array.isArray(images)
            ? images.map((imgUrl: string, idx: number) => ({
                imageUrl: imgUrl,
                captionBn: titleBn,
                captionEn: titleEn || titleBn,
                sortOrder: idx,
                isPublished: true,
                status: "PUBLISHED",
              }))
            : [],
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
