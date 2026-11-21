import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/media/approve — bulk approve media items
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids, category, caption } = body as {
      ids: string[];
      category?: string;
      caption?: string;
    };

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      verificationStatus: "VERIFIED",
      isPublished: true,
    };
    if (category) updateData.category = category;
    if (caption) updateData.caption = caption;

    await prisma.media.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    return NextResponse.json({ success: true, updatedCount: ids.length });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }
}

// DELETE /api/admin/media/approve — bulk delete rejected items
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids } = body as { ids: string[] };

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    await prisma.media.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
