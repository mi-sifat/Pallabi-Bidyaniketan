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
    const { titleBn, titleEn, year, classLevel, subject, fileUrl, isPublished } = body;

    const updated = await prisma.syllabus.update({
      where: { id },
      data: {
        ...(titleBn !== undefined && { titleBn }),
        ...(titleEn !== undefined && { titleEn }),
        ...(year !== undefined && { year }),
        ...(classLevel !== undefined && { classLevel }),
        ...(subject !== undefined && { subject }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(isPublished !== undefined && {
          isPublished: Boolean(isPublished),
          status: isPublished ? "PUBLISHED" : "DRAFT",
        }),
      },
    });

    return NextResponse.json({ success: true, syllabus: updated });
  } catch (error) {
    console.error("Update syllabus error:", error);
    return NextResponse.json({ error: "Failed to update syllabus" }, { status: 500 });
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
    await prisma.syllabus.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete syllabus error:", error);
    return NextResponse.json({ error: "Failed to delete syllabus" }, { status: 500 });
  }
}
