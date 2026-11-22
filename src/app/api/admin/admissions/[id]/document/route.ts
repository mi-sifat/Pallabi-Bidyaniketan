/**
 * Authenticated document serving endpoint.
 * Serves private admission documents (stored outside public/) to authorized admins only.
 *
 * GET /api/admin/admissions/[id]/document?field=photo|birthCert|marksheet|transferCert|otherDoc
 */
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

const FIELD_MAP: Record<string, string> = {
  photo: "photoUrl",
  birthCert: "birthCertificateUrl",
  marksheet: "marksheetUrl",
  transferCert: "transferCertificateUrl",
  otherDoc: "otherDocUrl",
};

const EXT_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Auth check — must be admin
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field") || "photo";

  const dbField = FIELD_MAP[field];
  if (!dbField) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  // 2. Load application
  const application = await prisma.admissionApplication.findUnique({
    where: { id },
    select: {
      photoUrl: true,
      birthCertificateUrl: true,
      marksheetUrl: true,
      transferCertificateUrl: true,
      otherDocUrl: true,
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const token = application[dbField as keyof typeof application] as string | null;
  if (!token) {
    return NextResponse.json({ error: "Document not available" }, { status: 404 });
  }

  // 3. Resolve absolute path in PRIVATE directory — prevent path traversal
  const safePath = token.replace(/\.\./g, "").replace(/\\/g, "/");
  const filePath = join(process.cwd(), "private", "admissions", safePath);

  // Ensure the resolved path starts with the private admissions dir
  const allowedBase = join(process.cwd(), "private", "admissions");
  if (!filePath.startsWith(allowedBase)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const mimeType = EXT_MIME[ext] || "application/octet-stream";

    const disposition =
      mimeType === "application/pdf"
        ? `inline; filename="document${ext}"`
        : `inline; filename="document${ext}"`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": disposition,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }
}
