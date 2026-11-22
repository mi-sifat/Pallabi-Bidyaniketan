import { NextResponse } from "next/server";
import { ensureDatabaseSchema } from "@/lib/auto-db-sync";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDatabaseSchema();

    // Check count of classes
    const classCount = await prisma.academicClass.count().catch(() => 0);

    return NextResponse.json({
      success: true,
      message: "Database schema verified and synced successfully.",
      classesCount: classCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to sync database",
      },
      { status: 500 }
    );
  }
}
