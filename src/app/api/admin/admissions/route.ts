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
  const q = searchParams.get("q")?.trim() || "";
  const applyingClass = searchParams.get("class");
  const status = searchParams.get("status") as any;

  try {
    const where: Record<string, unknown> = {
      ...(applyingClass && applyingClass !== "all" ? { applyingClass } : {}),
      ...(status && status !== "all" ? { status } : {}),
      ...(q
        ? {
            OR: [
              { applicationNo: { contains: q } },
              { studentNameBn: { contains: q } },
              { studentNameEn: { contains: q } },
              { fatherPhone: { contains: q } },
              { birthRegNo: { contains: q } },
            ],
          }
        : {}),
    };

    const applications = await prisma.admissionApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: await prisma.admissionApplication.count(),
      submitted: await prisma.admissionApplication.count({ where: { status: "SUBMITTED" } }),
      underReview: await prisma.admissionApplication.count({ where: { status: "UNDER_REVIEW" } }),
      contacted: await prisma.admissionApplication.count({ where: { status: "CONTACTED" } }),
      accepted: await prisma.admissionApplication.count({ where: { status: "ACCEPTED" } }),
      rejected: await prisma.admissionApplication.count({ where: { status: "REJECTED" } }),
    };

    return NextResponse.json({ success: true, applications, stats });
  } catch (error) {
    console.error("Fetch admissions error:", error);
    return NextResponse.json(
      { error: "আবেদন তালিকা লোড করা সম্ভব হয়নি" },
      { status: 500 }
    );
  }
}
