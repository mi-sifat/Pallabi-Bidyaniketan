import { prisma } from "@/lib/prisma";
import MigrationReviewClient from "./MigrationReviewClient";
import fs from "fs";
import path from "path";

export default async function TeacherMigrationReviewPage() {
  const reportPath = path.join(process.cwd(), "scratch", "teacher_migration_report.json");
  let report = {
    exactMatches: [],
    newTeachers: [],
    totalExtracted: 0,
    totalExistingDb: 0,
    duplicatePhotosFound: [],
  };

  if (fs.existsSync(reportPath)) {
    try {
      report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    } catch (e) {
      // ignore
    }
  }

  const existingTeachers = await prisma.teacher.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          শিক্ষক ডেটা ও ফটো মাইগ্রেশন রিভিউ (Teacher Migration Review)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          অফিসিয়াল ওয়েবসাইট (pbn.edu.bd) থেকে সংগৃহীত শিক্ষকগণের ছবি ও তথ্যের তুলনামূলক যাচাই ও অনুমোদন প্যানেল
        </p>
      </div>

      <MigrationReviewClient report={report} existingTeachers={existingTeachers} />
    </div>
  );
}
