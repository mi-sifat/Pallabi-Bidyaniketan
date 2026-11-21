import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { titleBn, contentBn, excerptBn, isPublished, ...rest } = body;

    if (titleBn || contentBn || excerptBn) {
      await prisma.newsTranslation.upsert({
        where: { newsId_locale: { newsId: id, locale: "bn" } },
        update: {
          title: titleBn,
          content: contentBn,
          excerpt: excerptBn,
        },
        create: {
          newsId: id,
          locale: "bn",
          title: titleBn || "শিরোনাম",
          content: contentBn,
          excerpt: excerptBn,
        },
      });
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        ...rest,
        isPublished,
        status: isPublished ? "PUBLISHED" : "DRAFT",
      },
      include: { translations: true, album: true, event: true },
    });

    return NextResponse.json({ success: true, news: updated });
  } catch (error) {
    console.error("Update news error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
