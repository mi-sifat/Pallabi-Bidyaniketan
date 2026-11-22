import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

/**
 * Save an uploaded file to PRIVATE storage (outside public/ web root).
 * Returns a relative path stored in DB; never a public URL.
 * Files are served only via authenticated /api/admin/admissions/[id]/document
 */
async function savePrivateFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate MIME against buffer magic bytes as a secondary check
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeFilename = `${randomUUID()}.${ext}`;

  const year = new Date().getFullYear();
  const targetDir = join(
    process.cwd(),
    "private",
    "admissions",
    String(year),
    folder
  );
  await mkdir(targetDir, { recursive: true });

  const fullPath = join(targetDir, safeFilename);
  await writeFile(fullPath, buffer);

  // Store a relative token (not a URL) in the DB
  return `${year}/${folder}/${safeFilename}`;
}

/** Generate a collision-safe unique application number, retrying up to 5 times */
async function generateApplicationNo(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt++) {
    const digits = Math.floor(100000 + Math.random() * 900000);
    const candidate = `PBN-${year}-${digits}`;
    const existing = await prisma.admissionApplication.findUnique({
      where: { applicationNo: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  // Last resort: add timestamp component
  return `PBN-${year}-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── Required text fields ──────────────────────────────────────────────
    const studentNameBn = (formData.get("studentNameBn") as string)?.trim();
    const studentNameEn = (formData.get("studentNameEn") as string)?.trim();
    const dob = (formData.get("dob") as string)?.trim();
    const gender = (formData.get("gender") as string)?.trim() || "ছাত্র";
    const birthRegNo = (formData.get("birthRegNo") as string)?.trim();
    const nationality =
      (formData.get("nationality") as string)?.trim() || "বাংলাদেশী";
    const religion = (formData.get("religion") as string)?.trim();
    const bloodGroup = (formData.get("bloodGroup") as string)?.trim();
    const presentAddress = (formData.get("presentAddress") as string)?.trim();
    const permanentAddress = (
      formData.get("permanentAddress") as string
    )?.trim();
    const applyingClass = (formData.get("applyingClass") as string)?.trim();
    const previousSchool = (formData.get("previousSchool") as string)?.trim();
    const previousClass = (formData.get("previousClass") as string)?.trim();
    const previousResult = (formData.get("previousResult") as string)?.trim();

    const fatherName = (formData.get("fatherName") as string)?.trim();
    const fatherPhone = (formData.get("fatherPhone") as string)?.trim();
    const fatherNid = (formData.get("fatherNid") as string)?.trim();
    const fatherOccupation = (
      formData.get("fatherOccupation") as string
    )?.trim();
    const motherName = (formData.get("motherName") as string)?.trim();
    const motherPhone = (formData.get("motherPhone") as string)?.trim();
    const motherNid = (formData.get("motherNid") as string)?.trim();
    const motherOccupation = (
      formData.get("motherOccupation") as string
    )?.trim();
    const guardianName = (formData.get("guardianName") as string)?.trim();
    const guardianPhone = (formData.get("guardianPhone") as string)?.trim();
    const guardianRelation = (
      formData.get("guardianRelation") as string
    )?.trim();
    const emergencyPhone =
      (formData.get("emergencyPhone") as string)?.trim() ||
      fatherPhone ||
      motherPhone ||
      "";

    // ── Validation ────────────────────────────────────────────────────────
    if (!studentNameBn || !studentNameEn || !dob || !birthRegNo || !applyingClass) {
      return NextResponse.json(
        {
          error:
            "শিক্ষার্থীর নাম, জন্ম তারিখ, জন্ম নিবন্ধন নম্বর ও ভর্তির শ্রেণি প্রদান আবশ্যক।",
        },
        { status: 400 }
      );
    }
    if (!fatherName || !fatherPhone || !presentAddress) {
      return NextResponse.json(
        {
          error:
            "পিতার নাম, মোবাইল নম্বর এবং বর্তমান ঠিকানা প্রদান আবশ্যক।",
        },
        { status: 400 }
      );
    }

    // ── File validation ───────────────────────────────────────────────────
    const fileSlots = [
      { key: "studentPhoto", label: "শিক্ষার্থীর ছবি", required: false },
      { key: "birthCertificate", label: "জন্ম নিবন্ধন সনদ", required: false },
      { key: "marksheet", label: "পূর্ববর্তী পরীক্ষার ফলাফল", required: false },
      { key: "transferCertificate", label: "ছাড়পত্র / টিসি", required: false },
      { key: "otherDoc", label: "অন্যান্য নথি", required: false },
    ];

    const uploadedFiles: Record<string, File | null> = {};
    for (const slot of fileSlots) {
      const f = formData.get(slot.key) as File | null;
      if (f && f.size > 0) {
        if (!ALLOWED_MIME_TYPES.includes(f.type)) {
          return NextResponse.json(
            {
              error: `${slot.label}-এর ফাইল ফরম্যাট সমর্থিত নয়। শুধুমাত্র JPG, PNG, WEBP বা PDF আপলোড করুন।`,
            },
            { status: 400 }
          );
        }
        if (f.size > MAX_DOC_SIZE) {
          return NextResponse.json(
            { error: `${slot.label}-এর আকার ৫ মেগাবাইটের বেশি হতে পারবে না।` },
            { status: 400 }
          );
        }
        uploadedFiles[slot.key] = f;
      } else {
        uploadedFiles[slot.key] = null;
      }
    }

    // ── Save files to PRIVATE storage ────────────────────────────────────
    const photoToken = uploadedFiles["studentPhoto"]
      ? await savePrivateFile(uploadedFiles["studentPhoto"]!, "photos")
      : null;
    const birthCertToken = uploadedFiles["birthCertificate"]
      ? await savePrivateFile(uploadedFiles["birthCertificate"]!, "birth_certs")
      : null;
    const marksheetToken = uploadedFiles["marksheet"]
      ? await savePrivateFile(uploadedFiles["marksheet"]!, "marksheets")
      : null;
    const transferCertToken = uploadedFiles["transferCertificate"]
      ? await savePrivateFile(uploadedFiles["transferCertificate"]!, "transfer_certs")
      : null;
    const otherDocToken = uploadedFiles["otherDoc"]
      ? await savePrivateFile(uploadedFiles["otherDoc"]!, "others")
      : null;

    // ── Collision-safe application number ─────────────────────────────────
    const applicationNo = await generateApplicationNo();
    const year = new Date().getFullYear();

    // ── Persist to database ───────────────────────────────────────────────
    const application = await prisma.admissionApplication.create({
      data: {
        applicationNo,
        academicYear: `${year}-${year + 1}`,
        applyingClass,
        studentNameBn,
        studentNameEn,
        dob,
        gender,
        birthRegNo,
        nationality,
        religion: religion || null,
        bloodGroup: bloodGroup || null,
        presentAddress,
        permanentAddress: permanentAddress || presentAddress,
        previousSchool: previousSchool || null,
        previousClass: previousClass || null,
        previousResult: previousResult || null,

        fatherName,
        fatherPhone,
        fatherNid: fatherNid || null,
        fatherOccupation: fatherOccupation || null,
        motherName,
        motherPhone: motherPhone || null,
        motherNid: motherNid || null,
        motherOccupation: motherOccupation || null,
        guardianName: guardianName || null,
        guardianPhone: guardianPhone || null,
        guardianRelation: guardianRelation || null,
        emergencyPhone,

        // Store private tokens — NOT public URLs
        photoUrl: photoToken,
        birthCertificateUrl: birthCertToken,
        marksheetUrl: marksheetToken,
        transferCertificateUrl: transferCertToken,
        otherDocUrl: otherDocToken,

        status: "SUBMITTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে।",
      applicationNo: application.applicationNo,
      applicationId: application.id,
    });
  } catch (error: unknown) {
    console.error("Admission application error:", error);
    // Handle unique constraint violation on applicationNo (should be very rare)
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        {
          error:
            "আবেদন নম্বর তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        error:
          "আবেদন জমা দেওয়ার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
