import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { UserRole } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(teacher);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userRole = (session.user as { role?: UserRole })?.role;
  if (!userRole || !hasPermission(userRole, "MANAGE_TEACHERS")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();

    // Check if publishing - requires publish permission
    if (body.isPublished && (!userRole || !hasPermission(userRole, "PUBLISH_TEACHERS"))) {
      return NextResponse.json({ error: "You don't have permission to publish teachers" }, { status: 403 });
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: { ...body, updatedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: body.isPublished ? "PUBLISH_TEACHER" : "UPDATE_TEACHER",
        entity: "Teacher",
        entityId: id,
        details: `Updated teacher: ${teacher.nameEn}`,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Update teacher error:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
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
  const userRole = (session.user as { role?: UserRole })?.role;
  if (!userRole || !hasPermission(userRole, "MANAGE_TEACHERS")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  // Soft delete — archive instead
  const teacher = await prisma.teacher.update({
    where: { id },
    data: { isArchived: true, isPublished: false },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ARCHIVE_TEACHER",
      entity: "Teacher",
      entityId: id,
      details: `Archived teacher: ${teacher.nameEn}`,
    },
  });

  return NextResponse.json({ success: true });
}
