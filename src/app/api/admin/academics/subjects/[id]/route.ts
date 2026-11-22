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
      code,
      classId,
      subjectType,
      fullMarks,
      description,
      sortOrder,
      academicYear,
      isActive,
    } = body;

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(nameBn !== undefined && { nameBn }),
        ...(nameEn !== undefined && { nameEn }),
        ...(code !== undefined && { code }),
        ...(classId !== undefined && { classId }),
        ...(subjectType !== undefined && { subjectType }),
        ...(fullMarks !== undefined && { fullMarks: typeof fullMarks === "number" ? fullMarks : parseInt(fullMarks) || 100 }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder: typeof sortOrder === "number" ? sortOrder : parseInt(sortOrder) || 0 }),
        ...(academicYear !== undefined && { academicYear }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: { class: true },
    });

    return NextResponse.json({ success: true, subject: updated });
  } catch (error) {
    console.error("Update subject error:", error);
    return NextResponse.json(
      { error: "Failed to update subject" },
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
    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "বিষয়টি সফলভাবে ডিলিট করা হয়েছে",
    });
  } catch (error) {
    console.error("Delete subject error:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}
