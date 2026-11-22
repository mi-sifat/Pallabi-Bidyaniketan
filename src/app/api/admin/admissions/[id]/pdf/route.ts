import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const app = await prisma.admissionApplication.findFirst({
    where: {
      OR: [{ id }, { applicationNo: id }],
    },
  });

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Redirect to full high-definition multi-page A4 print/PDF view
  const url = new URL(`/admission/print/${app.applicationNo}?download=true`, request.url);
  return NextResponse.redirect(url);
}
