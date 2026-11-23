import { prisma } from "@/lib/prisma";

let hasExecuted = false;

const DEFAULT_CLASSES = [
  { level: 0, nameBn: "শিশু শ্রেণি", nameEn: "Play Group", shift: "প্রভাতি শাখা (সকাল ৮:৩০ - ১১:৩০)", sortOrder: 0 },
  { level: 1, nameBn: "প্রথম শ্রেণি", nameEn: "Class 1", shift: "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)", sortOrder: 1 },
  { level: 2, nameBn: "দ্বিতীয় শ্রেণি", nameEn: "Class 2", shift: "প্রভাতি শাখা (সকাল ৮:০০ - ১২:০০)", sortOrder: 2 },
  { level: 3, nameBn: "তৃতীয় শ্রেণি", nameEn: "Class 3", shift: "দিবা শাখা (সকাল ১১:৩০ - ৪:৩০)", sortOrder: 3 },
  { level: 4, nameBn: "চতুর্থ শ্রেণি", nameEn: "Class 4", shift: "দিবা শাখা (সকাল ১১:৩০ - ৪:৩০)", sortOrder: 4 },
  { level: 5, nameBn: "পঞ্চম শ্রেণি", nameEn: "Class 5", shift: "দিবা শাখা (সকাল ১১:৩০ - ৪:৩০)", sortOrder: 5 },
  { level: 6, nameBn: "ষষ্ঠ শ্রেণি", nameEn: "Class 6", shift: "প্রভাতি ও দিবা শাখা", sortOrder: 6 },
  { level: 7, nameBn: "সপ্তম শ্রেণি", nameEn: "Class 7", shift: "প্রভাতি ও দিবা শাখা", sortOrder: 7 },
  { level: 8, nameBn: "অষ্টম শ্রেণি", nameEn: "Class 8", shift: "প্রভাতি ও দিবা শাখা", sortOrder: 8 },
  { level: 9, nameBn: "নবম শ্রেণি", nameEn: "Class 9", shift: "প্রভাতি ও দিবা শাখা", sortOrder: 9 },
  { level: 10, nameBn: "দশম শ্রেণি", nameEn: "Class 10", shift: "প্রভাতি ও দিবা শাখা", sortOrder: 10 },
];

const NCTB_STANDARDS: Record<number, Array<{ code: string; nameBn: string; nameEn: string; type: string; marks: number }>> = {
  0: [
    { code: "PP-101", nameBn: "আমার বাংলা বই ও ছড়া", nameEn: "Bangla & Rhymes", type: "COMPULSORY", marks: 100 },
    { code: "PP-102", nameBn: "মজার ইংরেজি ও বর্ণমালা", nameEn: "Fun English", type: "COMPULSORY", marks: 100 },
    { code: "PP-103", nameBn: "গণিত ও সংখ্যা গণনা", nameEn: "Early Math & Counting", type: "COMPULSORY", marks: 100 },
    { code: "PP-104", nameBn: "চিত্রাঙ্কন ও চারুকারু", nameEn: "Drawing & Art", type: "COMPULSORY", marks: 50 },
  ],
  1: [
    { code: "101", nameBn: "আমার বাংলা বই", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "102", nameBn: "English for Today", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "103", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "104", nameBn: "চারু ও কারুকলা", nameEn: "Arts & Crafts", type: "COMPULSORY", marks: 50 },
  ],
  2: [
    { code: "201", nameBn: "আমার বাংলা বই", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "202", nameBn: "English for Today", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "203", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "204", nameBn: "চারু ও কারুকলা", nameEn: "Arts & Crafts", type: "COMPULSORY", marks: 50 },
  ],
  3: [
    { code: "301", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "302", nameBn: "English", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "303", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "304", nameBn: "প্রাথমিক বিজ্ঞান", nameEn: "Elementary Science", type: "COMPULSORY", marks: 100 },
    { code: "305", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", nameEn: "Bangladesh & Global Studies", type: "COMPULSORY", marks: 100 },
    { code: "306", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Education", type: "COMPULSORY", marks: 100 },
  ],
  4: [
    { code: "401", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "402", nameBn: "English", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "403", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "404", nameBn: "প্রাথমিক বিজ্ঞান", nameEn: "Elementary Science", type: "COMPULSORY", marks: 100 },
    { code: "405", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", nameEn: "Bangladesh & Global Studies", type: "COMPULSORY", marks: 100 },
    { code: "406", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Education", type: "COMPULSORY", marks: 100 },
  ],
  5: [
    { code: "501", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "502", nameBn: "English", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "503", nameBn: "প্রাথমিক গণিত", nameEn: "Elementary Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "504", nameBn: "প্রাথমিক বিজ্ঞান", nameEn: "Elementary Science", type: "COMPULSORY", marks: 100 },
    { code: "505", nameBn: "বাংলাদেশ ও বিশ্বপরিচয়", nameEn: "Bangladesh & Global Studies", type: "COMPULSORY", marks: 100 },
    { code: "506", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Education", type: "COMPULSORY", marks: 100 },
  ],
  6: [
    { code: "601", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "602", nameBn: "ইংরেজি", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "603", nameBn: "গণিত", nameEn: "Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "604", nameBn: "বিজ্ঞান", nameEn: "Science", type: "COMPULSORY", marks: 100 },
    { code: "605", nameBn: "ইতিহাস ও সামাজিক বিজ্ঞান", nameEn: "History & Social Science", type: "COMPULSORY", marks: 100 },
    { code: "606", nameBn: "ডিজিটাল প্রযুক্তি", nameEn: "Digital Technology", type: "COMPULSORY", marks: 50 },
    { code: "607", nameBn: "জীবন ও জীবিকা", nameEn: "Life & Livelihood", type: "COMPULSORY", marks: 50 },
    { code: "608", nameBn: "স্বাস্থ্য সুরক্ষা", nameEn: "Health Protection", type: "COMPULSORY", marks: 50 },
    { code: "609", nameBn: "ধর্ম শিক্ষা", nameEn: "Religious Studies", type: "COMPULSORY", marks: 50 },
    { code: "610", nameBn: "শিল্প ও সংস্কৃতি", nameEn: "Art & Culture", type: "COMPULSORY", marks: 50 },
  ],
  7: [
    { code: "701", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "702", nameBn: "ইংরেজি", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "703", nameBn: "গণিত", nameEn: "Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "704", nameBn: "বিজ্ঞান", nameEn: "Science", type: "COMPULSORY", marks: 100 },
    { code: "705", nameBn: "ইতিহাস ও সামাজিক বিজ্ঞান", nameEn: "History & Social Science", type: "COMPULSORY", marks: 100 },
    { code: "706", nameBn: "ডিজিটাল প্রযুক্তি", nameEn: "Digital Technology", type: "COMPULSORY", marks: 50 },
    { code: "707", nameBn: "জীবন ও জীবিকা", nameEn: "Life & Livelihood", type: "COMPULSORY", marks: 50 },
    { code: "708", nameBn: "স্বাস্থ্য সুরক্ষা", nameEn: "Health Protection", type: "COMPULSORY", marks: 50 },
    { code: "709", nameBn: "ধর্ম শিক্ষা", nameEn: "Religious Studies", type: "COMPULSORY", marks: 50 },
    { code: "710", nameBn: "শিল্প ও সংস্কৃতি", nameEn: "Art & Culture", type: "COMPULSORY", marks: 50 },
  ],
  8: [
    { code: "801", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "802", nameBn: "ইংরেজি", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "803", nameBn: "গণিত", nameEn: "Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "804", nameBn: "বিজ্ঞান", nameEn: "Science", type: "COMPULSORY", marks: 100 },
    { code: "805", nameBn: "ইতিহাস ও সামাজিক বিজ্ঞান", nameEn: "History & Social Science", type: "COMPULSORY", marks: 100 },
    { code: "806", nameBn: "ডিজিটাল প্রযুক্তি", nameEn: "Digital Technology", type: "COMPULSORY", marks: 50 },
    { code: "807", nameBn: "জীবন ও জীবিকা", nameEn: "Life & Livelihood", type: "COMPULSORY", marks: 50 },
    { code: "808", nameBn: "স্বাস্থ্য সুরক্ষা", nameEn: "Health Protection", type: "COMPULSORY", marks: 50 },
    { code: "809", nameBn: "ধর্ম শিক্ষা", nameEn: "Religious Studies", type: "COMPULSORY", marks: 50 },
    { code: "810", nameBn: "শিল্প ও সংস্কৃতি", nameEn: "Art & Culture", type: "COMPULSORY", marks: 50 },
  ],
  9: [
    { code: "101-102", nameBn: "বাংলা ১ম ও ২য় পত্র", nameEn: "Bangla 1st & 2nd", type: "COMPULSORY", marks: 200 },
    { code: "107-108", nameBn: "ইংরেজি ১ম ও ২য় পত্র", nameEn: "English 1st & 2nd", type: "COMPULSORY", marks: 200 },
    { code: "109", nameBn: "সাধারণ গণিত", nameEn: "General Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "154", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি", nameEn: "ICT", type: "COMPULSORY", marks: 50 },
    { code: "111", nameBn: "ইসলাম ও নৈতিক শিক্ষা", nameEn: "Islam & Moral Education", type: "COMPULSORY", marks: 100 },
    { code: "136", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", type: "COMPULSORY", marks: 100 },
    { code: "137", nameBn: "রসায়ন", nameEn: "Chemistry", type: "COMPULSORY", marks: 100 },
    { code: "138", nameBn: "জীববিজ্ঞান", nameEn: "Biology", type: "COMPULSORY", marks: 100 },
    { code: "126", nameBn: "উচ্চতর গণিত", nameEn: "Higher Mathematics", type: "OPTIONAL", marks: 100 },
  ],
  10: [
    { code: "101-102", nameBn: "বাংলা ১ম ও ২য় পত্র", nameEn: "Bangla 1st & 2nd", type: "COMPULSORY", marks: 200 },
    { code: "107-108", nameBn: "ইংরেজি ১ম ও ২য় পত্র", nameEn: "English 1st & 2nd", type: "COMPULSORY", marks: 200 },
    { code: "109", nameBn: "সাধারণ গণিত", nameEn: "General Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "154", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি", nameEn: "ICT", type: "COMPULSORY", marks: 50 },
    { code: "111", nameBn: "ইসলাম ও নৈতিক শিক্ষা", nameEn: "Islam & Moral Education", type: "COMPULSORY", marks: 100 },
    { code: "136", nameBn: "পদার্থবিজ্ঞান", nameEn: "Physics", type: "COMPULSORY", marks: 100 },
    { code: "137", nameBn: "রসায়ন", nameEn: "Chemistry", type: "COMPULSORY", marks: 100 },
    { code: "138", nameBn: "জীববিজ্ঞান", nameEn: "Biology", type: "COMPULSORY", marks: 100 },
    { code: "126", nameBn: "উচ্চতর গণিত", nameEn: "Higher Mathematics", type: "OPTIONAL", marks: 100 },
  ],
};

const DEFAULT_WORKING_DAYS = [
  { key: "sun", nameBn: "রবিবার", enabled: true },
  { key: "mon", nameBn: "সোমবার", enabled: true },
  { key: "tue", nameBn: "মঙ্গলবার", enabled: true },
  { key: "wed", nameBn: "বুধবার", enabled: true },
  { key: "thu", nameBn: "বৃহস্পতিবার", enabled: true },
];

const DEFAULT_PERIODS = [
  { id: "p1", period: "১ম পিরিয়ড", time: "০৮:০০ - ০৮:৫০" },
  { id: "p2", period: "২য় পিরিয়ড", time: "০৮:৫০ - ০৯:৪০" },
  { id: "p3", period: "৩য় পিরিয়ড", time: "০৯:৪০ - ১০:৩০" },
  { id: "break", period: "বিরতি", time: "১০:৩০ - ১১:০০", isBreak: true },
  { id: "p4", period: "৪র্থ পিরিয়ড", time: "১১:০০ - ১১:৫০" },
  { id: "p5", period: "৫ম পিরিয়ড", time: "১১:৫০ - ১২:৪০" },
];

export async function ensureDatabaseSchema() {
  if (hasExecuted || !prisma) return;
  hasExecuted = true;

  try {
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

    // 3. Auto-populate classes & routines on Neon if empty
    const existingClassesCount = await prisma.academicClass.count().catch(() => 0);
    if (existingClassesCount < 11) {
      for (const def of DEFAULT_CLASSES) {
        const existing = await prisma.academicClass.findFirst({
          where: { level: def.level },
        });

        let classId = existing?.id;
        if (!existing) {
          const created = await prisma.academicClass.create({
            data: {
              level: def.level,
              nameBn: def.nameBn,
              nameEn: def.nameEn,
              shift: def.shift,
              academicYear: "2026",
              isActive: true,
              sortOrder: def.sortOrder,
            },
          });
          classId = created.id;
        }

        if (classId) {
          // Check subjects
          const subCount = await prisma.subject.count({ where: { classId } });
          const stdSubjects = NCTB_STANDARDS[def.level] || [];
          if (subCount === 0 && stdSubjects.length > 0) {
            for (let idx = 0; idx < stdSubjects.length; idx++) {
              const sub = stdSubjects[idx];
              await prisma.subject.create({
                data: {
                  code: sub.code,
                  nameBn: sub.nameBn,
                  nameEn: sub.nameEn,
                  subjectType: sub.type,
                  fullMarks: sub.marks,
                  sortOrder: idx,
                  academicYear: "2026",
                  classId,
                  isActive: true,
                },
              }).catch(() => {});
            }
          }

          // Check routine
          const routineCount = await prisma.routine.count({ where: { classId } });
          if (routineCount === 0) {
            const entries: any[] = [];
            let sIdx = 0;
            for (const d of DEFAULT_WORKING_DAYS) {
              for (const p of DEFAULT_PERIODS) {
                if (p.isBreak) continue;
                const sub = stdSubjects[sIdx % stdSubjects.length];
                sIdx++;
                entries.push({
                  dayKey: d.key,
                  periodId: p.id,
                  subjectBn: sub?.nameBn || "সাধারণ বিষয়",
                  teacherName: "বিষয় শিক্ষক",
                  roomNo: `${100 + (def.level || 1)}`,
                });
              }
            }

            await prisma.routine.create({
              data: {
                titleEn: `${def.nameEn} Weekly Routine`,
                titleBn: `${def.nameBn} সাপ্তাহিক ক্লাস রুটিন`,
                routineType: "CLASS_ROUTINE",
                classId,
                shift: def.shift,
                year: "2026",
                contentBn: JSON.stringify({
                  workingDays: DEFAULT_WORKING_DAYS,
                  periods: DEFAULT_PERIODS,
                  entries,
                }),
                status: "PUBLISHED",
                isPublished: true,
              },
            }).catch(() => {});
          }
        }
      }
    }
  } catch (err) {
    console.error("Auto DB schema sync check failed:", err);
  }
}
