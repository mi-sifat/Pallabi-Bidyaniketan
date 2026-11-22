import { prisma } from "@/lib/prisma";

let hasExecuted = false;

export async function ensureDatabaseSchema() {
  if (hasExecuted || !prisma) return;
  hasExecuted = true;

  try {
    // Only run on PostgreSQL
    const isPostgres = process.env.DATABASE_URL?.startsWith("postgres");
    if (!isPostgres) return;

    // 1. Add missing columns safely with IF NOT EXISTS
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "admin_profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
        ALTER TABLE "admin_profiles" ADD COLUMN IF NOT EXISTS "email" TEXT;
        ALTER TABLE "admin_profiles" ADD COLUMN IF NOT EXISTS "qualificationsEn" TEXT;
        ALTER TABLE "admin_profiles" ADD COLUMN IF NOT EXISTS "qualificationsBn" TEXT;
        
        ALTER TABLE "academic_classes" ADD COLUMN IF NOT EXISTS "shift" TEXT;
        ALTER TABLE "academic_classes" ADD COLUMN IF NOT EXISTS "academicYear" TEXT DEFAULT '2026';
        ALTER TABLE "academic_classes" ADD COLUMN IF NOT EXISTS "descriptionBn" TEXT;
        ALTER TABLE "academic_classes" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
        
        ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "subjectType" TEXT DEFAULT 'COMPULSORY';
        ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "fullMarks" INTEGER DEFAULT 100;
        ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "description" TEXT;
        ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0;
        ALTER TABLE "subjects" ADD COLUMN IF NOT EXISTS "academicYear" TEXT DEFAULT '2026';
        
        ALTER TABLE "routines" ADD COLUMN IF NOT EXISTS "section" TEXT;
        ALTER TABLE "routines" ADD COLUMN IF NOT EXISTS "shift" TEXT;
      EXCEPTION
        WHEN OTHERS THEN null;
      END $$;
    `).catch(() => {});

    // 2. Create AdmissionStatus enum and admission_applications table if not exists
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "AdmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'CONTACTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
      EXCEPTION
        WHEN duplicate_object THEN null;
        WHEN OTHERS THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS "admission_applications" (
        "id" TEXT PRIMARY KEY,
        "applicationNo" TEXT UNIQUE NOT NULL,
        "academicYear" TEXT NOT NULL DEFAULT '2026-2027',
        "applyingClass" TEXT NOT NULL,
        "studentNameBn" TEXT NOT NULL,
        "studentNameEn" TEXT NOT NULL,
        "dob" TEXT NOT NULL,
        "gender" TEXT NOT NULL,
        "birthRegNo" TEXT NOT NULL,
        "nationality" TEXT NOT NULL DEFAULT 'বাংলাদেশী',
        "religion" TEXT,
        "bloodGroup" TEXT,
        "presentAddress" TEXT NOT NULL,
        "permanentAddress" TEXT NOT NULL,
        "previousSchool" TEXT,
        "previousClass" TEXT,
        "previousResult" TEXT,
        "fatherName" TEXT NOT NULL,
        "fatherPhone" TEXT NOT NULL,
        "fatherNid" TEXT,
        "fatherOccupation" TEXT,
        "motherName" TEXT NOT NULL,
        "motherPhone" TEXT,
        "motherNid" TEXT,
        "motherOccupation" TEXT,
        "guardianName" TEXT,
        "guardianPhone" TEXT,
        "guardianRelation" TEXT,
        "emergencyPhone" TEXT NOT NULL,
        "photoUrl" TEXT,
        "birthCertificateUrl" TEXT,
        "marksheetUrl" TEXT,
        "transferCertificateUrl" TEXT,
        "otherDocUrl" TEXT,
        "status" "AdmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
        "contactedDate" TIMESTAMP(3),
        "contactedBy" TEXT,
        "internalNotes" TEXT,
        "decisionDate" TIMESTAMP(3),
        "finalDecision" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});
  } catch (err) {
    console.error("Auto DB schema sync check failed:", err);
  }
}
