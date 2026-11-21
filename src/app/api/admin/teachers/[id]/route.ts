import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return NextResponse.json({ error: "শিক্ষক পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 });
  }
}

export async function PATCH(
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
    const allowedFields = [
      "nameEn",
      "nameBn",
      "designationEn",
      "designationBn",
      "subjectEn",
      "subjectBn",
      "photoUrl",
      "qualificationsEn",
      "qualificationsBn",
      "displayOrder",
      "isPublished",
      "isCurrent",
      "status",
      "verificationStatus",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    const updated = await prisma.teacher.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update teacher error:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
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
    await prisma.teacher.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
