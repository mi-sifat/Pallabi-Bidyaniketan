import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.schoolEvent.findMany({
      include: {
        album: {
          include: { images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      titleBn,
      titleEn,
      category,
      eventDate,
      location,
      descriptionBn,
      descriptionEn,
      coverImageUrl,
      additionalPhotos,
    } = body;

    if (!titleBn) {
      return NextResponse.json({ error: "অনুষ্ঠানের নাম আবশ্যক" }, { status: 400 });
    }

    const slug = `${generateSlug(titleEn || titleBn)}-${Date.now()}`;

    // Auto-create gallery album if photos are provided or requested
    let albumId: string | undefined = undefined;
    if (coverImageUrl || (additionalPhotos && additionalPhotos.length > 0)) {
      const albumSlug = `album-${slug}`;
      const photos: string[] = [];
      if (coverImageUrl) photos.push(coverImageUrl);
      if (Array.isArray(additionalPhotos)) {
        photos.push(...additionalPhotos);
      }
      const uniquePhotos = Array.from(new Set(photos.filter(Boolean)));

      const album = await prisma.galleryAlbum.create({
        data: {
          slug: albumSlug,
          titleBn,
          titleEn: titleEn || titleBn,
          descriptionBn,
          descriptionEn: descriptionEn || descriptionBn,
          coverImageUrl: coverImageUrl || uniquePhotos[0] || undefined,
          category: category || "Events",
          albumDate: eventDate ? new Date(eventDate) : new Date(),
          isPublished: true,
          status: "PUBLISHED",
          images: {
            create: uniquePhotos.map((url, idx) => ({
              imageUrl: url,
              captionBn: titleBn,
              captionEn: titleEn || titleBn,
              sortOrder: idx,
              isPublished: true,
              status: "PUBLISHED",
            })),
          },
        },
      });
      albumId = album.id;
    }

    const event = await prisma.schoolEvent.create({
      data: {
        slug,
        titleBn,
        titleEn: titleEn || titleBn,
        category: category || "সাংস্কৃতিক অনুষ্ঠান",
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        location: location || "বিদ্যালয় প্রাঙ্গণ, মিরপুর-৭",
        descriptionBn,
        descriptionEn: descriptionEn || descriptionBn,
        coverImageUrl: coverImageUrl || undefined,
        albumId,
        isPublished: true,
        status: "PUBLISHED",
      },
      include: {
        album: {
          include: { images: true },
        },
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
