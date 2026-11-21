import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { newImages, ...otherFields } = body;

    // If new images added
    if (Array.isArray(newImages) && newImages.length > 0) {
      await prisma.galleryImage.createMany({
        data: newImages.map((url: string, idx: number) => ({
          albumId: id,
          imageUrl: url,
          sortOrder: idx,
          isPublished: true,
          status: "PUBLISHED",
        })),
      });
    }

    const updated = await prisma.galleryAlbum.update({
      where: { id },
      data: otherFields,
      include: { images: true },
    });

    return NextResponse.json({ success: true, album: updated });
  } catch (error) {
    console.error("Update album error:", error);
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");

  try {
    if (imageId) {
      await prisma.galleryImage.delete({ where: { id: imageId } });
      return NextResponse.json({ success: true });
    }

    await prisma.galleryAlbum.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete album error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
