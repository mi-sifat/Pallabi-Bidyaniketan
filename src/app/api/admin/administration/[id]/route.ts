import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    const updated = await prisma.adminProfile.update({
      where: { id },
      data: {
        ...(nameBn !== undefined && { nameBn }),
        ...(nameEn !== undefined && { nameEn }),
        ...(designationBn !== undefined && { designationBn }),
        ...(designationEn !== undefined && { designationEn }),
        ...(profileType !== undefined && { profileType }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(messageBn !== undefined && { messageBn }),
        ...(messageEn !== undefined && { messageEn }),
        ...(bioBn !== undefined && { bioBn }),
        ...(bioEn !== undefined && { bioEn }),
        ...(qualificationsBn !== undefined && { qualificationsBn }),
        ...(qualificationsEn !== undefined && { qualificationsEn }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Update admin profile error:", error);
    return NextResponse.json(
      { error: "প্রোফাইল আপডেট ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.adminProfile.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete admin profile error:", error);
    return NextResponse.json(
      { error: "প্রোফাইল মুছে ফেলা ব্যর্থ হয়েছে" },
      { status: 500 }
    );
  }
}
