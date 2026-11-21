import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      include: { translations: true, album: true, event: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
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
      excerptBn,
      contentBn,
      coverImageUrl,
      category,
      albumId,
      eventId,
      isPublished,
    } = body;

    if (!titleBn) {
      return NextResponse.json({ error: "সংবাদের শিরোনাম আবশ্যক" }, { status: 400 });
    }

    const slug = `${generateSlug(titleEn || titleBn)}-${Date.now()}`;

    const news = await prisma.news.create({
      data: {
        slug,
        category: category || "General",
        coverImageUrl: coverImageUrl || null,
        albumId: albumId || null,
        eventId: eventId || null,
        isPublished: isPublished !== undefined ? isPublished : true,
        status: isPublished ? "PUBLISHED" : "DRAFT",
        createdById: session.user.id,
        translations: {
          create: [
            {
              locale: "bn",
              title: titleBn,
              excerpt: excerptBn || null,
              content: contentBn || null,
            },
            {
              locale: "en",
              title: titleEn || titleBn,
              excerpt: excerptBn || null,
              content: contentBn || null,
            },
          ],
        },
      },
      include: { translations: true, album: true, event: true },
    });

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error("Create news error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
