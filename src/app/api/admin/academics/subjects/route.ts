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
  const search = searchParams.get("search");

  try {
    const where: any = {};
    if (classId) {
      where.classId = classId;
    }
    if (search) {
      where.OR = [
        { nameBn: { contains: search } },
        { nameEn: { contains: search } },
        { code: { contains: search } },
      ];
    }

    const subjects = await prisma.subject.findMany({
      where,
      include: { class: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ success: true, subjects });
  } catch (error) {
    console.error("Fetch subjects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
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
      nameBn,
      nameEn,
      code,
      classId,
      classIds,
      subjectType,
      fullMarks,
      description,
      sortOrder,
      academicYear,
      isActive,
    } = body;

    if (!nameBn) {
      return NextResponse.json(
        { error: "বিষয়ের নাম (বাংলা) আবশ্যক" },
        { status: 400 }
      );
    }

    // Support single class or multiple classes
    const targetClassIds = Array.isArray(classIds) && classIds.length > 0
      ? classIds
      : classId ? [classId] : [];

    if (targetClassIds.length === 0) {
      return NextResponse.json(
        { error: "কমপক্ষে একটি শ্রেণি নির্বাচন করুন" },
        { status: 400 }
      );
    }

    const createdSubjects = await Promise.all(
      targetClassIds.map(async (cId: string, idx: number) => {
        return prisma.subject.create({
          data: {
            nameBn,
            nameEn: nameEn || nameBn,
            code: code || null,
            classId: cId,
            subjectType: subjectType || "COMPULSORY",
            fullMarks: typeof fullMarks === "number" ? fullMarks : 100,
            description: description || null,
            sortOrder: typeof sortOrder === "number" ? sortOrder + idx : 0,
            academicYear: academicYear || "2026",
            isActive: isActive !== undefined ? Boolean(isActive) : true,
          },
          include: { class: true },
        });
      })
    );

    return NextResponse.json({
      success: true,
      subject: createdSubjects[0],
      subjects: createdSubjects,
    });
  } catch (error) {
    console.error("Create subject error:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}
