import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const isCurrent = searchParams.get("isCurrent");

  const where: Record<string, unknown> = {
    isArchived: false,
    ...(search && {
      OR: [
        { nameEn: { contains: search, mode: "insensitive" } },
        { nameBn: { contains: search } },
        { designationEn: { contains: search, mode: "insensitive" } },
        { subjectEn: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(status && { status }),
    ...(isCurrent !== null && { isCurrent: isCurrent === "true" }),
  };

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { nameEn: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.teacher.count({ where }),
  ]);

  return NextResponse.json({
    teachers,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userRole = (session.user as { role?: UserRole })?.role;
  if (!userRole || !hasPermission(userRole, "MANAGE_TEACHERS")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const teacher = await prisma.teacher.create({
      data: {
        ...body,
        createdById: session.user.id,
        status: "PENDING_VERIFICATION",
        isPublished: false,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_TEACHER",
        entity: "Teacher",
        entityId: teacher.id,
        details: `Created teacher: ${teacher.nameEn}`,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Create teacher error:", error);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
