import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

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
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
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
        buttonTextBn: buttonTextBn || "ভর্তি তথ্য ও ফরম দেখুন",
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
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action, removeImage, isActive, imageUrl, ...otherFields } = body;
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // Explicit Remove Image Action
    if (action === "remove_image" || removeImage === true) {
      const updated = await prisma.announcementPopup.update({
        where: { id },
        data: { imageUrl: null },
      });
      return NextResponse.json({
        success: true,
        message: "পপ-আপ থেকে ছবি সফলভাবে সরানো হয়েছে",
        popup: updated,
      });
    }

    if (isActive) {
      // deactivate all other popups
      await prisma.announcementPopup.updateMany({
        where: { id: { not: id } },
        data: { isActive: false },
      });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      ...otherFields,
    };

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Explicitly handle imageUrl (null if empty string or explicitly null)
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl === "" || imageUrl === null ? null : imageUrl;
    }

    if (otherFields.startDate !== undefined) {
      updateData.startDate = otherFields.startDate ? new Date(otherFields.startDate as string) : null;
    }
    if (otherFields.endDate !== undefined) {
      updateData.endDate = otherFields.endDate ? new Date(otherFields.endDate as string) : null;
    }

    const updated = await prisma.announcementPopup.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, popup: updated });
  } catch (error) {
    console.error("Update popup error:", error);
    return NextResponse.json({ error: "Failed to update popup" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    // If action is remove-image, only remove the image reference from the popup, keep the popup record
    if (action === "remove-image") {
      const updated = await prisma.announcementPopup.update({
        where: { id },
        data: { imageUrl: null },
      });
      return NextResponse.json({
        success: true,
        message: "পপ-আপ থেকে ছবি সরানো হয়েছে (মূল মিডিয়া সংরক্ষিত আছে)",
        popup: updated,
      });
    }

    // Permanent delete of popup record
    await prisma.announcementPopup.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "পপ-আপ সফলভাবে মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Delete popup error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
