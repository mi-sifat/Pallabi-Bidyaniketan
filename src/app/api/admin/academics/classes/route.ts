import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const classes = await prisma.academicClass.findMany({
      include: {
        subjects: { orderBy: { sortOrder: "asc" } },
        routines: true,
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, classes });
  } catch (error) {
    console.error("Fetch academic classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
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
      level,
      section,
      shift,
      academicYear,
      descriptionBn,
      descriptionEn,
      sortOrder,
      isActive,
    } = body;

    if (!nameEn) {
      return NextResponse.json(
        { error: "শ্রেণির নাম (ইংরেজি) আবশ্যক" },
        { status: 400 }
      );
    }

    const newClass = await prisma.academicClass.create({
      data: {
        nameEn,
        nameBn: nameBn || nameEn,
        level: typeof level === "number" ? level : 0,
        section: section || null,
        shift: shift || "প্রভাতি শাখা",
        academicYear: academicYear || "2026",
        descriptionBn: descriptionBn || null,
        descriptionEn: descriptionEn || null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: {
        subjects: true,
        routines: true,
      },
    });

    return NextResponse.json({ success: true, academicClass: newClass });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}
