import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalNotices,
    totalTeachers,
    totalNews,
    totalGalleryAlbums,
    totalDownloads,
    pendingTeachers,
    pendingNotices,
    unreadMessages,
    recentActivity,
  ] = await Promise.all([
    prisma.notice.count({ where: { isPublished: true } }),
    prisma.teacher.count({ where: { isPublished: true, isArchived: false } }),
    prisma.news.count({ where: { isPublished: true } }),
    prisma.galleryAlbum.count({ where: { isPublished: true } }),
    prisma.download.count({ where: { isPublished: true } }),
    prisma.teacher.count({ where: { isPublished: false, isArchived: false } }),
    prisma.notice.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalNotices,
      totalTeachers,
      totalNews,
      totalGalleryAlbums,
      totalDownloads,
      pendingItems: pendingTeachers + pendingNotices,
      unreadMessages,
    },
    recentActivity,
  });
}
