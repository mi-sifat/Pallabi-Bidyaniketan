import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const application = await prisma.admissionApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: "আবেদন পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Get admission error:", error);
    return NextResponse.json({ error: "আবেদন বিবরণ লোড ব্যর্থ" }, { status: 500 });
  }
}

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
    const { status, internalNotes, contactedDate, contactedBy, decisionDate, finalDecision } = body;

    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(internalNotes !== undefined && { internalNotes }),
        ...(contactedDate !== undefined && {
          contactedDate: contactedDate ? new Date(contactedDate) : null,
        }),
        ...(contactedBy !== undefined && { contactedBy }),
        ...(decisionDate !== undefined && {
          decisionDate: decisionDate ? new Date(decisionDate) : null,
        }),
        ...(finalDecision !== undefined && { finalDecision }),
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Update admission error:", error);
    return NextResponse.json({ error: "আবেদন আপডেট ব্যর্থ" }, { status: 500 });
  }
}
