import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {
    isArchived: false,
    ...(search && {
      OR: [
        { nameEn: { contains: search } },
        { nameBn: { contains: search } },
        { designationEn: { contains: search } },
        { designationBn: { contains: search } },
        { subjectEn: { contains: search } },
      ],
    }),
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
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      nameEn,
      nameBn,
      designationEn,
      designationBn,
      subjectEn,
      subjectBn,
      photoUrl,
      qualificationsBn,
      qualificationsEn,
      displayOrder,
      isPublished,
      status,
    } = body;

    if (!nameEn) {
      return NextResponse.json({ error: "শিক্ষকের নাম (ইংরেজি) আবশ্যক" }, { status: 400 });
    }

    const teacher = await prisma.teacher.create({
      data: {
        nameEn,
        nameBn: nameBn || nameEn,
        designationEn: designationEn || null,
        designationBn: designationBn || null,
        subjectEn: subjectEn || null,
        subjectBn: subjectBn || null,
        photoUrl: photoUrl || null,
        qualificationsBn: qualificationsBn || null,
        qualificationsEn: qualificationsEn || qualificationsBn || null,
        displayOrder: Number(displayOrder) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        status: status || "PUBLISHED",
        verificationStatus: "VERIFIED",
        isCurrent: true,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Create teacher error:", error);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
