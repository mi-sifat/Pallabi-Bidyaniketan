import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [imports, stats] = await Promise.all([
    prisma.facebookImport.findMany({
      orderBy: { importedAt: "desc" },
      include: {
        album: true,
        news: true,
        event: true,
      },
    }),
    {
      total: await prisma.facebookImport.count(),
      pending: await prisma.facebookImport.count({ where: { status: "PENDING_APPROVAL" } }),
      approved: await prisma.facebookImport.count({ where: { status: "APPROVED" } }),
      published: await prisma.facebookImport.count({ where: { status: "PUBLISHED" } }),
    },
  ]);

  return NextResponse.json({ imports, stats });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      fbPostId,
      fbPostUrl,
      caption,
      postedAt,
      eventTitle,
      eventCategory,
      mediaUrls,
      createAlbum,
      createNews,
      createEvent,
    } = body;

    // Duplicate detection
    if (fbPostId || fbPostUrl) {
      const existing = await prisma.facebookImport.findFirst({
        where: {
          OR: [
            ...(fbPostId ? [{ fbPostId }] : []),
            ...(fbPostUrl ? [{ fbPostUrl }] : []),
          ],
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Duplicate post detected. This Facebook post has already been imported.", isDuplicate: true },
          { status: 409 }
        );
      }
    }

    const title = eventTitle || (caption ? caption.substring(0, 60) : "Facebook Post Event");
    const slug = `${generateSlug(title)}-${Date.now()}`;
    const parsedMediaUrls = Array.isArray(mediaUrls) ? mediaUrls : [];
    const coverImageUrl = parsedMediaUrls.length > 0 ? parsedMediaUrls[0] : null;

    let albumId: string | undefined;
    let newsId: string | undefined;
    let eventId: string | undefined;

    // 1. Create Gallery Album if requested
    if (createAlbum) {
      const album = await prisma.galleryAlbum.create({
        data: {
          slug: `album-${slug}`,
          titleBn: title,
          titleEn: title,
          descriptionBn: caption,
          descriptionEn: caption,
          coverImageUrl: coverImageUrl || undefined,
          category: eventCategory || "Event",
          albumDate: postedAt ? new Date(postedAt) : new Date(),
          status: "PUBLISHED",
          isPublished: true,
          images: {
            create: parsedMediaUrls.map((url: string, idx: number) => ({
              imageUrl: url,
              captionBn: `${title} - ছবি ${idx + 1}`,
              captionEn: `${title} - Photo ${idx + 1}`,
              sourceUrl: fbPostUrl || undefined,
              status: "PUBLISHED",
              isPublished: true,
            })),
          },
        },
      });
      albumId = album.id;
    }

    // 2. Create Event Record if requested
    if (createEvent) {
      const event = await prisma.schoolEvent.create({
        data: {
          slug: `event-${slug}`,
          titleBn: title,
          titleEn: title,
          descriptionBn: caption,
          descriptionEn: caption,
          eventDate: postedAt ? new Date(postedAt) : new Date(),
          category: eventCategory || "Event",
          coverImageUrl: coverImageUrl || undefined,
          albumId,
          status: "PUBLISHED",
          isPublished: true,
        },
      });
      eventId = event.id;

      // Update album with eventId
      if (albumId) {
        await prisma.galleryAlbum.update({
          where: { id: albumId },
          data: { eventId },
        });
      }
    }

    // 3. Create News/Blog Article if requested
    if (createNews) {
      const news = await prisma.news.create({
        data: {
          slug: `news-${slug}`,
          category: eventCategory || "Event",
          coverImageUrl: coverImageUrl || undefined,
          publishDate: postedAt ? new Date(postedAt) : new Date(),
          status: "PUBLISHED",
          isPublished: true,
          createdById: session.user.id,
          albumId,
          eventId,
          translations: {
            create: [
              {
                locale: "bn",
                title,
                content: caption || title,
                excerpt: caption ? caption.substring(0, 150) : title,
              },
              {
                locale: "en",
                title,
                content: caption || title,
                excerpt: caption ? caption.substring(0, 150) : title,
              },
            ],
          },
        },
      });
      newsId = news.id;

      // Update album with newsId
      if (albumId) {
        await prisma.galleryAlbum.update({
          where: { id: albumId },
          data: { newsId },
        });
      }
    }

    // 4. Save FacebookImport record with 3-way linked IDs
    const fbImport = await prisma.facebookImport.create({
      data: {
        fbPostId: fbPostId || `fb-${Date.now()}`,
        fbPostUrl,
        caption,
        postedAt: postedAt ? new Date(postedAt) : new Date(),
        eventTitle: title,
        eventCategory: eventCategory || "Event",
        sourceType: "MANUAL_OR_PUBLIC",
        mediaUrls: JSON.stringify(parsedMediaUrls),
        albumId,
        newsId,
        eventId,
        status: albumId || newsId || eventId ? "PUBLISHED" : "PENDING_APPROVAL",
        verificationStatus: "VERIFIED",
        isDuplicate: false,
      },
    });

    // Save migration log
    await prisma.migrationRecord.create({
      data: {
        sourceWebsite: fbPostUrl || "https://www.facebook.com/Bangabandhu1977",
        sourcePageUrl: fbPostUrl,
        contentType: "facebook_post",
        contentTitle: title,
        contentData: JSON.stringify({ caption, postedAt, eventCategory, mediaCount: parsedMediaUrls.length }),
        status: "IMPORTED",
        verificationStatus: "VERIFIED",
        adminNotes: `Imported with 3-way links (Album: ${albumId ? "Yes" : "No"}, News: ${newsId ? "Yes" : "No"}, Event: ${eventId ? "Yes" : "No"})`,
      },
    });

    return NextResponse.json({
      success: true,
      import: fbImport,
      albumId,
      newsId,
      eventId,
    });
  } catch (error) {
    console.error("Facebook import error:", error);
    return NextResponse.json({ error: "Failed to process Facebook import" }, { status: 500 });
  }
}
