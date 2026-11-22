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
    const syllabi = await prisma.syllabus.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, syllabi });
  } catch (error) {
    console.error("Fetch syllabi error:", error);
    return NextResponse.json({ error: "Failed to fetch syllabi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titleBn, titleEn, year, classLevel, subject, fileUrl, isPublished } = body;

    if (!titleBn || !classLevel) {
      return NextResponse.json({ error: "সিলেবাসের শিরোনাম ও শ্রেণি নির্বাচন আবশ্যক" }, { status: 400 });
    }

    const syllabus = await prisma.syllabus.create({
      data: {
        titleBn,
        titleEn: titleEn || titleBn,
        year: year || "2026",
        classLevel,
        subject: subject || "সকল বিষয়",
        fileUrl: fileUrl || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        status: isPublished ? "PUBLISHED" : "DRAFT",
      },
    });

    return NextResponse.json({ success: true, syllabus });
  } catch (error) {
    console.error("Create syllabus error:", error);
    return NextResponse.json({ error: "Failed to create syllabus" }, { status: 500 });
  }
}
