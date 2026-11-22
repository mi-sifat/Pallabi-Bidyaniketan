import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

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
    { code: "609", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Studies", type: "COMPULSORY", marks: 50 },
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
    { code: "709", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Studies", type: "COMPULSORY", marks: 50 },
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
    { code: "809", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Studies", type: "COMPULSORY", marks: 50 },
    { code: "810", nameBn: "শিল্প ও সংস্কৃতি", nameEn: "Art & Culture", type: "COMPULSORY", marks: 50 },
  ],
  9: [
    { code: "901", nameBn: "বাংলা", nameEn: "Bangla", type: "COMPULSORY", marks: 100 },
    { code: "902", nameBn: "ইংরেজি", nameEn: "English", type: "COMPULSORY", marks: 100 },
    { code: "903", nameBn: "গণিত", nameEn: "Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "904", nameBn: "বিজ্ঞান", nameEn: "Science", type: "COMPULSORY", marks: 100 },
    { code: "905", nameBn: "ইতিহাস ও সামাজিক বিজ্ঞান", nameEn: "History & Social Science", type: "COMPULSORY", marks: 100 },
    { code: "906", nameBn: "ডিজিটাল প্রযুক্তি", nameEn: "Digital Technology", type: "COMPULSORY", marks: 50 },
    { code: "907", nameBn: "জীবন ও জীবিকা", nameEn: "Life & Livelihood", type: "COMPULSORY", marks: 50 },
    { code: "908", nameBn: "স্বাস্থ্য সুরক্ষা", nameEn: "Health Protection", type: "COMPULSORY", marks: 50 },
    { code: "909", nameBn: "ধর্ম শিক্ষা", nameEn: "Religious Studies", type: "COMPULSORY", marks: 50 },
    { code: "910", nameBn: "শিল্প ও সংস্কৃতি", nameEn: "Art & Culture", type: "COMPULSORY", marks: 50 },
  ],
  10: [
    { code: "101-102", nameBn: "বাংলা ১ম ও ২য় পত্র", nameEn: "Bangla 1st & 2nd", type: "COMPULSORY", marks: 200 },
    { code: "107-108", nameBn: "ইংরেজি ১ম ও ২য় পত্র", nameEn: "English 1st & 2nd", type: "COMPULSORY", marks: 200 },
    { code: "109", nameBn: "সাধারণ গণিত", nameEn: "General Mathematics", type: "COMPULSORY", marks: 100 },
    { code: "154", nameBn: "তথ্য ও যোগাযোগ প্রযুক্তি", nameEn: "ICT", type: "COMPULSORY", marks: 50 },
    { code: "126", nameBn: "পদার্থবিজ্ঞান / বিজ্ঞান", nameEn: "Physics / General Science", type: "COMPULSORY", marks: 100 },
    { code: "127", nameBn: "রসায়ন / ব্যবসায় উদ্যোগ / ভূগোল", nameEn: "Chemistry / Business Studies / Geography", type: "COMPULSORY", marks: 100 },
    { code: "128", nameBn: "জীববিজ্ঞান / ফিন্যান্স / পৌরনীতি", nameEn: "Biology / Finance / Civics", type: "COMPULSORY", marks: 100 },
    { code: "129", nameBn: "উচ্চতর গণিত / কৃষি শিক্ষা", nameEn: "Higher Mathematics / Agriculture", type: "OPTIONAL", marks: 100 },
    { code: "111", nameBn: "ধর্ম ও নৈতিক শিক্ষা", nameEn: "Religion & Moral Education", type: "COMPULSORY", marks: 100 },
  ],
};

export async function POST(request: NextRequest) {
  const sessionUser = await getAdminSession(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { classId } = await request.json();
    if (!classId) {
      return NextResponse.json({ error: "শ্রেণি নির্বাচন আবশ্যক" }, { status: 400 });
    }

    const cls = await prisma.academicClass.findUnique({ where: { id: classId } });
    if (!cls) {
      return NextResponse.json({ error: "শ্রেণি পাওয়া যায়নি" }, { status: 404 });
    }

    const level = cls.level ?? 6;
    const defaults = NCTB_STANDARDS[level] || NCTB_STANDARDS[6];

    // Check existing subjects for this class
    const existing = await prisma.subject.findMany({ where: { classId } });
    const existingCodes = new Set(existing.map((s) => s.code));

    const toCreate = defaults.filter((d) => !existingCodes.has(d.code));

    if (toCreate.length === 0) {
      return NextResponse.json({
        success: true,
        message: "এই শ্রেণির জন্য প্রমিত বিষয়াবলী ইতোমধ্যে যুক্ত আছে।",
        count: 0,
      });
    }

    await prisma.$transaction(
      toCreate.map((item, idx) =>
        prisma.subject.create({
          data: {
            nameBn: item.nameBn,
            nameEn: item.nameEn,
            code: item.code,
            classId,
            subjectType: item.type,
            fullMarks: item.marks,
            sortOrder: existing.length + idx,
            academicYear: cls.academicYear || "2026",
            isActive: true,
          },
        })
      )
    );

    const allSubjects = await prisma.subject.findMany({
      where: { classId },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: `${toCreate.length}টি NCTB প্রমিত বিষয় সফলভাবে লোড করা হয়েছে`,
      subjects: allSubjects,
    });
  } catch (error) {
    console.error("Seed subjects error:", error);
    return NextResponse.json({ error: "Failed to seed subjects" }, { status: 500 });
  }
}
