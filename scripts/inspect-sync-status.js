const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function inspect() {
  console.log("=== INSPECTING PROJECT STATE ===");

  // 1. Database Counts (Local SQLite)
  const [
    classesCount,
    subjectsCount,
    routinesCount,
    syllabiCount,
    teachersCount,
    adminProfilesCount,
    admissionsCount,
    mediaCount,
    sliderCount,
    noticesCount,
    eventsCount,
    newsCount,
    galleryCount,
    schoolProfile,
  ] = await Promise.all([
    prisma.academicClass.count(),
    prisma.subject.count(),
    prisma.routine.count(),
    prisma.syllabus.count(),
    prisma.teacher.count(),
    prisma.adminProfile.count(),
    prisma.admissionApplication.count(),
    prisma.media.count(),
    prisma.homepageSlide.count(),
    prisma.notice.count(),
    prisma.schoolEvent.count(),
    prisma.news.count(),
    prisma.galleryAlbum.count(),
    prisma.schoolProfile.findFirst(),
  ]);

  console.log("\n--- LOCAL DATABASE COUNTS ---");
  console.log(`Academic Classes: ${classesCount}`);
  console.log(`Subjects: ${subjectsCount}`);
  console.log(`Routines: ${routinesCount}`);
  console.log(`Syllabi: ${syllabiCount}`);
  console.log(`Teachers: ${teachersCount}`);
  console.log(`Administration/Committee: ${adminProfilesCount}`);
  console.log(`Admission Applications: ${admissionsCount}`);
  console.log(`Media Library Records: ${mediaCount}`);
  console.log(`Sliders: ${sliderCount}`);
  console.log(`Notices: ${noticesCount}`);
  console.log(`Events: ${eventsCount}`);
  console.log(`News: ${newsCount}`);
  console.log(`Gallery Albums: ${galleryCount}`);
  console.log(`School Profile: ${schoolProfile ? schoolProfile.nameBn : "None"}`);

  // 2. Physical File Counts in public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const folderCounts = {};
  let totalFiles = 0;

  if (fs.existsSync(uploadsDir)) {
    const scanDir = (dir, rel) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          scanDir(full, path.join(rel, item));
        } else {
          totalFiles++;
          folderCounts[rel] = (folderCounts[rel] || 0) + 1;
        }
      }
    };
    scanDir(uploadsDir, "uploads");
  }

  console.log("\n--- PHYSICAL UPLOAD FILES ---");
  console.log(`Total Upload Files: ${totalFiles}`);
  console.log("Files per folder:", JSON.stringify(folderCounts, null, 2));

  // 3. Private Admission Documents
  const privateDir = path.join(process.cwd(), "private", "admissions");
  let privateFilesCount = 0;
  if (fs.existsSync(privateDir)) {
    privateFilesCount = fs.readdirSync(privateDir).length;
  }
  console.log(`Private Admission Files: ${privateFilesCount}`);

  await prisma.$disconnect();
}

inspect().catch(console.error);
