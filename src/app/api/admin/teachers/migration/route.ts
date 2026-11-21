import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reportPath = path.join(process.cwd(), "scratch", "teacher_migration_report.json");
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({ error: "No migration report found" }, { status: 404 });
    }

    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const migrationRecords = await prisma.migrationRecord.findMany({
      where: {
        contentType: { in: ["teacher_update", "teacher_new"] },
      },
      orderBy: { retrievedAt: "desc" },
    });

    return NextResponse.json({ success: true, report, migrationRecords });
  } catch (error) {
    console.error("Migration report fetch error:", error);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, item, items } = body;

    // Approve a matched teacher update
    if (action === "approve_matched" && item) {
      const { dbId, updates, newPhotoFilename } = item;
      const photoUrl = newPhotoFilename ? `/uploads/teachers/${newPhotoFilename}` : undefined;

      const updateData: Record<string, unknown> = {};
      if (updates?.designationEn) {
        updateData.designationEn = updates.designationEn;
        updateData.designationBn = updates.designationEn;
      }
      if (photoUrl) {
        updateData.photoUrl = photoUrl;
      }
      if (updates?.phone || updates?.email) {
        updateData.sourceReference = `Mobile: ${updates.phone || "N/A"}, Email: ${updates.email || "N/A"}`;
      }

      await prisma.teacher.update({
        where: { id: dbId },
        data: updateData,
      });

      // Update migration record status
      await prisma.migrationRecord.updateMany({
        where: { linkedRecordId: dbId, contentType: "teacher_update" },
        data: {
          verificationStatus: "VERIFIED",
          status: "IMPORTED",
        },
      });

      return NextResponse.json({ success: true, message: "শিক্ষকের তথ্য ও ছবি সফলভাবে আপডেট করা হয়েছে" });
    }

    // Approve all matched teachers
    if (action === "approve_all_matched" && Array.isArray(items)) {
      for (const t of items) {
        if (!t.dbId) continue;
        const photoUrl = t.newPhotoFilename ? `/uploads/teachers/${t.newPhotoFilename}` : undefined;
        const updateData: Record<string, unknown> = {};
        if (t.updates?.designationEn) {
          updateData.designationEn = t.updates.designationEn;
          updateData.designationBn = t.updates.designationEn;
        }
        if (photoUrl) updateData.photoUrl = photoUrl;
        if (t.updates?.phone || t.updates?.email) {
          updateData.sourceReference = `Mobile: ${t.updates.phone || "N/A"}, Email: ${t.updates.email || "N/A"}`;
        }

        await prisma.teacher.update({
          where: { id: t.dbId },
          data: updateData,
        });

        await prisma.migrationRecord.updateMany({
          where: { linkedRecordId: t.dbId },
          data: { verificationStatus: "VERIFIED", status: "IMPORTED" },
        });
      }

      return NextResponse.json({ success: true, count: items.length });
    }

    // Approve a new teacher
    if (action === "approve_new" && item) {
      const photoUrl = item.imageFilename ? `/uploads/teachers/${item.imageFilename}` : null;
      const highest = await prisma.teacher.findFirst({ orderBy: { displayOrder: "desc" } });
      const nextOrder = (highest?.displayOrder || 0) + 1;

      const newTeacher = await prisma.teacher.create({
        data: {
          nameEn: item.name,
          nameBn: item.name,
          designationEn: item.designation,
          designationBn: item.designation,
          photoUrl,
          photoSourceUrl: item.originalImageUrl || null,
          sourceReference: `Mobile: ${item.mobile || "N/A"}, Email: ${item.email || "N/A"}`,
          displayOrder: nextOrder,
          status: "PUBLISHED",
          isPublished: true,
          verificationStatus: "VERIFIED",
        },
      });

      await prisma.migrationRecord.updateMany({
        where: { contentTitle: item.name, contentType: "teacher_new" },
        data: {
          verificationStatus: "VERIFIED",
          status: "IMPORTED",
          linkedRecordId: newTeacher.id,
        },
      });

      return NextResponse.json({ success: true, teacher: newTeacher });
    }

    // Reject an item
    if (action === "reject" && item) {
      await prisma.migrationRecord.updateMany({
        where: { contentTitle: item.name || item.extractedName },
        data: { verificationStatus: "REJECTED", status: "NEEDS_REVIEW" },
      });
      return NextResponse.json({ success: true, message: "প্রস্তাবিত আপডেট বাতিল করা হয়েছে" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Migration approval error:", error);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
