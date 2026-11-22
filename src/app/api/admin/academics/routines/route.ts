import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  try {
    const routines = await prisma.routine.findMany({
      where: classId ? { classId } : {},
      include: { class: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, routines });
  } catch (error) {
    console.error("Fetch routines error:", error);
    return NextResponse.json({ error: "Failed to fetch routines" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    if (!titleBn || !classId) {
      return NextResponse.json(
        { error: "রুটিনের শিরোনাম এবং শ্রেণি নির্বাচন আবশ্যক" },
        { status: 400 }
      );
    }

    const routine = await prisma.routine.create({
      data: {
        titleBn,
        titleEn: titleEn || titleBn,
        routineType: routineType || "CLASS_ROUTINE",
        classId,
        section: section || null,
        shift: shift || null,
        year: year || "2026",
        contentBn: contentBn || null,
        contentEn: contentEn || null,
        fileUrl: fileUrl || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        status: isPublished ? "PUBLISHED" : "DRAFT",
      },
      include: { class: true },
    });

    return NextResponse.json({ success: true, routine });
  } catch (error) {
    console.error("Create routine error:", error);
    return NextResponse.json({ error: "Failed to create routine" }, { status: 500 });
  }
}
