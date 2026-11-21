const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PHOTOS_DIR = path.join(process.cwd(), 'teacher-photos');
const CSV_PATH = path.join(process.cwd(), 'teacher_migration.csv');

if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

function sanitizeFilename(name) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
}

function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/^(md\.|md|mst\.|mst|mohammad|dr\.|mr\.)\s+/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(destPath, buffer);
        resolve(buffer);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log("=== PALLABI BIDYANIKETAN TEACHER EXTRACTOR & MIGRATOR ===");

  const html = fs.readFileSync('scratch/teacher_info.html', 'utf8');

  // Regex to extract all teacher cards
  const cardRegex = /<div class="teachers_list"[\s\S]*?<div class="founder_image">[\s\S]*?<img src="([^"]+)"[\s\S]*?<div class="teachers_info">([\s\S]*?)<\/div>\s*<\/div>/gi;

  const extractedTeachers = [];
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const imgUrl = match[1].trim();
    const infoBlock = match[2];

    const nameMatch = infoBlock.match(/Name:\s*<\/span>\s*([^<]+)/i);
    const desigMatch = infoBlock.match(/Designation:\s*<\/span>\s*([^<]+)/i);
    const mobileMatch = infoBlock.match(/Mobile:\s*<\/span>\s*([^<]+)/i);
    const emailMatch = infoBlock.match(/Email:\s*<\/span>\s*([^<]+)/i);

    const name = nameMatch ? nameMatch[1].trim() : "Unknown";
    const designation = desigMatch ? desigMatch[1].trim() : "";
    const mobile = mobileMatch ? mobileMatch[1].trim() : "";
    const email = emailMatch ? emailMatch[1].trim() : "";

    extractedTeachers.push({
      originalImageUrl: imgUrl,
      name,
      designation,
      mobile,
      email,
    });
  }

  console.log(`Extracted ${extractedTeachers.length} teachers from HTML.`);

  const downloadedRecords = [];
  const imageHashes = new Map();
  const duplicates = [];

  for (let i = 0; i < extractedTeachers.length; i++) {
    const t = extractedTeachers[i];
    const safeName = sanitizeFilename(t.name) || `TEACHER_${i + 1}`;
    let filename = `${safeName}.jpg`;
    let destPath = path.join(PHOTOS_DIR, filename);

    // If duplicate filename exists, add index
    let counter = 1;
    while (fs.existsSync(destPath)) {
      filename = `${safeName}_${counter}.jpg`;
      destPath = path.join(PHOTOS_DIR, filename);
      counter++;
    }

    try {
      console.log(`[${i + 1}/${extractedTeachers.length}] Downloading photo for: ${t.name}...`);
      const buffer = await downloadImage(t.originalImageUrl, destPath);
      
      const hash = crypto.createHash('md5').update(buffer).digest('hex');
      let isDuplicateImage = false;
      if (imageHashes.has(hash)) {
        isDuplicateImage = true;
        duplicates.push({
          name: t.name,
          duplicateOf: imageHashes.get(hash),
          hash,
        });
      } else {
        imageHashes.set(hash, t.name);
      }

      downloadedRecords.push({
        ...t,
        imageFilename: filename,
        imagePath: destPath,
        imageSize: buffer.length,
        hash,
        isDuplicateImage,
      });
    } catch (err) {
      console.error(`Error downloading for ${t.name}:`, err.message);
      downloadedRecords.push({
        ...t,
        imageFilename: "DOWNLOAD_FAILED",
        imagePath: null,
        imageSize: 0,
        hash: null,
        isDuplicateImage: false,
      });
    }
  }

  // Generate CSV File
  console.log("\nGenerating CSV file at:", CSV_PATH);
  const csvHeader = "Name,Designation,Mobile,Email,Image_Filename,Original_Image_URL\n";
  const csvRows = downloadedRecords.map(r => {
    const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
    return [
      escapeCsv(r.name),
      escapeCsv(r.designation),
      escapeCsv(r.mobile),
      escapeCsv(r.email),
      escapeCsv(r.imageFilename),
      escapeCsv(r.originalImageUrl)
    ].join(',');
  }).join('\n');

  fs.writeFileSync(CSV_PATH, csvHeader + csvRows, 'utf8');
  console.log(`CSV generated with ${downloadedRecords.length} records.`);

  // Compare with Existing Database
  console.log("\nComparing with Existing Database Records...");
  const dbTeachers = await prisma.teacher.findMany();
  console.log(`Found ${dbTeachers.length} teachers in existing database.`);

  const comparisonReport = {
    totalExtracted: downloadedRecords.length,
    totalExistingDb: dbTeachers.length,
    exactMatches: [],
    partialMatches: [],
    newTeachers: [],
    duplicatePhotosFound: duplicates,
    proposedUpdates: [],
  };

  for (const ext of downloadedRecords) {
    const extNorm = normalizeName(ext.name);

    // Find in DB
    const match = dbTeachers.find(d => {
      const dbNormEn = normalizeName(d.nameEn);
      const dbNormBn = normalizeName(d.nameBn);
      if (dbNormEn && (dbNormEn === extNorm || dbNormEn.includes(extNorm) || extNorm.includes(dbNormEn))) {
        return true;
      }
      return false;
    });

    if (match) {
      const updates = {};
      if (!match.phone && ext.mobile) updates.phone = ext.mobile;
      if (!match.email && ext.email) updates.email = ext.email;
      if (ext.designation && ext.designation !== match.designationEn) {
        updates.designationEn = ext.designation;
      }
      
      const newPhotoRelativeUrl = `/uploads/teachers/${ext.imageFilename}`;

      comparisonReport.exactMatches.push({
        extractedName: ext.name,
        dbId: match.id,
        dbNameEn: match.nameEn,
        dbNameBn: match.nameBn,
        currentPhoto: match.photoUrl,
        newPhotoFilename: ext.imageFilename,
        hasProposedUpdates: Object.keys(updates).length > 0,
        updates,
      });

      // Copy downloaded photo to public/uploads/teachers for review
      const publicUploadsTeachers = path.join(process.cwd(), 'public', 'uploads', 'teachers');
      if (!fs.existsSync(publicUploadsTeachers)) {
        fs.mkdirSync(publicUploadsTeachers, { recursive: true });
      }
      if (ext.imagePath && fs.existsSync(ext.imagePath)) {
        fs.copyFileSync(ext.imagePath, path.join(publicUploadsTeachers, ext.imageFilename));
      }

      // Store proposed update in migration records safely (pending review, not overwriting)
      await prisma.migrationRecord.create({
        data: {
          sourceWebsite: "https://www.pbn.edu.bd",
          sourcePageUrl: "https://www.pbn.edu.bd/index.php?nav_id=teacher_info",
          contentType: "teacher_update",
          contentTitle: ext.name,
          contentData: JSON.stringify({
            extracted: ext,
            matchedDbTeacher: {
              id: match.id,
              nameEn: match.nameEn,
              designationEn: match.designationEn,
              photoUrl: match.photoUrl,
            },
            proposedUpdates: updates,
            proposedPhotoUrl: `/uploads/teachers/${ext.imageFilename}`,
          }),
          retrievedFileUrl: `/uploads/teachers/${ext.imageFilename}`,
          linkedRecordId: match.id,
          linkedRecordType: "teacher",
          status: "RETRIEVED",
          verificationStatus: "PENDING_VERIFICATION",
          adminNotes: `Matched existing teacher: ${match.nameEn} (ID: ${match.id})`,
        }
      });
    } else {
      comparisonReport.newTeachers.push(ext);

      // Copy to public/uploads/teachers
      const publicUploadsTeachers = path.join(process.cwd(), 'public', 'uploads', 'teachers');
      if (!fs.existsSync(publicUploadsTeachers)) {
        fs.mkdirSync(publicUploadsTeachers, { recursive: true });
      }
      if (ext.imagePath && fs.existsSync(ext.imagePath)) {
        fs.copyFileSync(ext.imagePath, path.join(publicUploadsTeachers, ext.imageFilename));
      }

      // Create Draft record or Migration Record
      await prisma.migrationRecord.create({
        data: {
          sourceWebsite: "https://www.pbn.edu.bd",
          sourcePageUrl: "https://www.pbn.edu.bd/index.php?nav_id=teacher_info",
          contentType: "teacher_new",
          contentTitle: ext.name,
          contentData: JSON.stringify({
            extracted: ext,
            proposedPhotoUrl: `/uploads/teachers/${ext.imageFilename}`,
          }),
          retrievedFileUrl: `/uploads/teachers/${ext.imageFilename}`,
          status: "DISCOVERED",
          verificationStatus: "PENDING_VERIFICATION",
          adminNotes: "New teacher discovered from pbn.edu.bd",
        }
      });
    }
  }

  fs.writeFileSync('scratch/teacher_migration_report.json', JSON.stringify(comparisonReport, null, 2), 'utf8');
  console.log("\n=== SUMMARY ===");
  console.log(`Matched with existing DB: ${comparisonReport.exactMatches.length}`);
  console.log(`New teachers discovered: ${comparisonReport.newTeachers.length}`);
  console.log(`Duplicate photos detected: ${comparisonReport.duplicatePhotosFound.length}`);
  console.log(`Full report saved to scratch/teacher_migration_report.json`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
