import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { UserRole } from "@prisma/client";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = search
    ? {
        OR: [
          { translations: { some: { title: { contains: search } } } },
        ],
      }
    : {};

  const [notices, total] = await Promise.all([
    prisma.notice.findMany({
      where,
      include: { translations: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notice.count({ where }),
  ]);

  return NextResponse.json({
    notices,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userRole = (session.user as { role?: UserRole })?.role;
  if (!userRole || !hasPermission(userRole, "MANAGE_NOTICES")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { titleBn, titleEn, contentBn, contentEn, ...rest } = body;

    const slugBase = titleEn || titleBn || "notice";
    let slug = generateSlug(slugBase);
    // Ensure unique slug
    const existing = await prisma.notice.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const notice = await prisma.notice.create({
      data: {
        slug,
        ...rest,
        createdById: session.user.id,
        translations: {
          create: [
            ...(titleBn ? [{ locale: "bn", title: titleBn, content: contentBn }] : []),
            ...(titleEn ? [{ locale: "en", title: titleEn, content: contentEn }] : []),
          ],
        },
      },
      include: { translations: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_NOTICE",
        entity: "Notice",
        entityId: notice.id,
        details: `Created notice: ${titleBn || titleEn}`,
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Create notice error:", error);
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
  }
}
