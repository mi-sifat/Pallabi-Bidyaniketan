import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const slides = await prisma.homepageSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
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
      imageUrl,
      titleBn,
      titleEn,
      subtitleBn,
      subtitleEn,
      buttonTextBn,
      buttonTextEn,
      buttonUrl,
      sortOrder,
      isActive,
    } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "স্লাইডারের ছবি আবশ্যক" }, { status: 400 });
    }

    const slide = await prisma.homepageSlide.create({
      data: {
        imageUrl,
        titleBn,
        titleEn,
        subtitleBn,
        subtitleEn,
        buttonTextBn,
        buttonTextEn,
        buttonUrl,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, slide });
  } catch (error) {
    console.error("Create slide error:", error);
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
