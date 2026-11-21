import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const popups = await prisma.announcementPopup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, popups });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch popups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      titleBn,
      titleEn,
      descriptionBn,
      descriptionEn,
      imageUrl,
      buttonTextBn,
      buttonTextEn,
      buttonUrl,
      isActive,
      startDate,
      endDate,
    } = body;

    if (!titleBn) {
      return NextResponse.json({ error: "পপ-আপের শিরোনাম আবশ্যক" }, { status: 400 });
    }

    // If setting active, optionally deactivate other popups
    if (isActive) {
      await prisma.announcementPopup.updateMany({
        data: { isActive: false },
      });
    }

    const popup = await prisma.announcementPopup.create({
      data: {
        titleBn,
        titleEn: titleEn || titleBn,
        descriptionBn,
        descriptionEn: descriptionEn || descriptionBn,
        imageUrl: imageUrl || null,
        buttonTextBn: buttonTextBn || "বিস্তারিত দেখুন",
        buttonTextEn: buttonTextEn || "View Details",
        buttonUrl: buttonUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ success: true, popup });
  } catch (error) {
    console.error("Create popup error:", error);
    return NextResponse.json({ error: "Failed to save popup" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, isActive, ...otherFields } = body;
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (isActive) {
      // deactivate all other popups
      await prisma.announcementPopup.updateMany({
        where: { id: { not: id } },
        data: { isActive: false },
      });
    }

    const updated = await prisma.announcementPopup.update({
      where: { id },
      data: {
        isActive,
        ...otherFields,
      },
    });

    return NextResponse.json({ success: true, popup: updated });
  } catch (error) {
    console.error("Update popup error:", error);
    return NextResponse.json({ error: "Failed to update popup" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await prisma.announcementPopup.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
