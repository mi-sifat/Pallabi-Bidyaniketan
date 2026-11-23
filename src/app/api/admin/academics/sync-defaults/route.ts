import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSchema } from "@/lib/auto-db-sync";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureDatabaseSchema();

    const [classes, routines] = await Promise.all([
      prisma.academicClass.findMany({
        include: {
          subjects: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
          routines: true,
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.routine.findMany({
        include: { class: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "ডিফল্ট ক্লাস ও রুটিন সফলভাবে ডাটাবেজে সিঙ্ক করা হয়েছে।",
      classes,
      routines,
    });
  } catch (error: any) {
    console.error("Sync defaults error:", error);
    return NextResponse.json(
      { error: "সিঙ্ক প্রক্রিয়া সম্পন্ন করতে ত্রুটি হয়েছে: " + error.message },
      { status: 500 }
    );
  }
}