import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// Log an admin action to audit trail
export async function logAction(params: {
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
  request?: NextRequest;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details,
        ipAddress: params.request?.headers.get("x-forwarded-for") ?? 
                   params.request?.headers.get("x-real-ip") ?? 
                   "unknown",
      },
    });
  } catch {
    // Non-critical — don't fail the request
    console.error("Failed to write audit log");
  }
}

// Get authenticated session or return 401
export async function requireAuth(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}

// Generate a URL-safe slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Role hierarchy
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  PRINCIPAL: "Principal",
  SCHOOL_ADMIN: "School Admin",
  CONTENT_EDITOR: "Content Editor",
  TEACHER_EDITOR: "Teacher Editor",
  GALLERY_MANAGER: "Gallery Manager",
  ALUMNI_MODERATOR: "Alumni Moderator",
};
