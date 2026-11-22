import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      nameBn,
      nameEn,
      level,
      section,
      shift,
      academicYear,
      descriptionBn,
      descriptionEn,
      sortOrder,
      isActive,
    } = body;

    const updated = await prisma.academicClass.update({
      where: { id },
      data: {
        ...(nameEn !== undefined && { nameEn }),
        ...(nameBn !== undefined && { nameBn }),
        ...(level !== undefined && { level }),
        ...(section !== undefined && { section }),
        ...(shift !== undefined && { shift }),
        ...(academicYear !== undefined && { academicYear }),
        ...(descriptionBn !== undefined && { descriptionBn }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: {
        subjects: { orderBy: { sortOrder: "asc" } },
        routines: true,
      },
    });

    return NextResponse.json({ success: true, academicClass: updated });
  } catch (error) {
    console.error("Update class error:", error);
    return NextResponse.json(
      { error: "Failed to update class" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.academicClass.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete class error:", error);
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    );
  }
}
