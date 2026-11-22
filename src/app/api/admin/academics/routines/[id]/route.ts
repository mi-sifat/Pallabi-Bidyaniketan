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
      titleBn,
      titleEn,
      routineType,
      classId,
      section,
      shift,
      year,
      contentBn,
      contentEn,
      fileUrl,
      isPublished,
    } = body;

    const updated = await prisma.routine.update({
      where: { id },
      data: {
        ...(titleBn !== undefined && { titleBn }),
        ...(titleEn !== undefined && { titleEn }),
        ...(routineType !== undefined && { routineType }),
        ...(classId !== undefined && { classId }),
        ...(section !== undefined && { section }),
        ...(shift !== undefined && { shift }),
        ...(year !== undefined && { year }),
        ...(contentBn !== undefined && { contentBn }),
        ...(contentEn !== undefined && { contentEn }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(isPublished !== undefined && {
          isPublished: Boolean(isPublished),
          status: isPublished ? "PUBLISHED" : "DRAFT",
        }),
      },
      include: { class: true },
    });

    return NextResponse.json({ success: true, routine: updated });
  } catch (error) {
    console.error("Update routine error:", error);
    return NextResponse.json({ error: "Failed to update routine" }, { status: 500 });
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
    await prisma.routine.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete routine error:", error);
    return NextResponse.json({ error: "Failed to delete routine" }, { status: 500 });
  }
}
