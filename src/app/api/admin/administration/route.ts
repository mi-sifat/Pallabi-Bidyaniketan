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
    const profiles = await prisma.adminProfile.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error("Fetch admin profiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch administrative profiles" },
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
      designationBn,
      designationEn,
      profileType,
      photoUrl,
      messageBn,
      messageEn,
      bioBn,
      bioEn,
      qualificationsBn,
      qualificationsEn,
      phone,
      email,
      displayOrder,
      isPublished,
    } = body;

    if (!nameBn) {
      return NextResponse.json(
        { error: "নাম প্রদান করা আবশ্যক (Name is required)" },
        { status: 400 }
      );
    }

    const profile = await prisma.adminProfile.create({
      data: {
        nameBn,
        nameEn: nameEn || nameBn,
        designationBn: designationBn || "প্রশাসনিক সদস্য",
        designationEn: designationEn || "Administrative Member",
        profileType: profileType || "COMMITTEE_MEMBER",
        photoUrl: photoUrl || null,
        messageBn: messageBn || null,
        messageEn: messageEn || null,
        bioBn: bioBn || null,
        bioEn: bioEn || null,
        qualificationsBn: qualificationsBn || null,
        qualificationsEn: qualificationsEn || null,
        phone: phone || null,
        email: email || null,
        displayOrder: typeof displayOrder === "number" ? displayOrder : 10,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        status: "PUBLISHED",
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Create admin profile error:", error);
    return NextResponse.json(
      { error: "প্রশাসনিক প্রোফাইল তৈরি ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}
