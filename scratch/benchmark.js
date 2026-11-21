const http = require('http');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const PAGES = [
  { name: 'Homepage (Bangla)', url: 'http://localhost:3000/bn' },
  { name: 'Homepage (English)', url: 'http://localhost:3000/en' },
  { name: 'About (Bangla)', url: 'http://localhost:3000/bn/about' },
  { name: 'Teachers (Bangla)', url: 'http://localhost:3000/bn/teachers' },
  { name: 'Academics (Bangla)', url: 'http://localhost:3000/bn/academics' },
  { name: 'Notices (Bangla)', url: 'http://localhost:3000/bn/notices' },
  { name: 'Events (Bangla)', url: 'http://localhost:3000/bn/events' },
  { name: 'Gallery (Bangla)', url: 'http://localhost:3000/bn/gallery' },
  { name: 'Gallery All Photos', url: 'http://localhost:3000/bn/gallery/all' },
  { name: 'Blog / News (Bangla)', url: 'http://localhost:3000/bn/news' },
  { name: 'Contact (Bangla)', url: 'http://localhost:3000/bn/contact' },
  { name: 'Admin Dashboard', url: 'http://localhost:3000/admin' },
];

const APIS = [
  { name: 'API: Media List', url: 'http://localhost:3000/api/admin/media' },
  { name: 'API: Teachers List', url: 'http://localhost:3000/api/admin/teachers' },
  { name: 'API: Events List', url: 'http://localhost:3000/api/admin/events' },
  { name: 'API: Gallery Albums', url: 'http://localhost:3000/api/admin/gallery' },
  { name: 'API: Homepage Slider', url: 'http://localhost:3000/api/admin/homepage-slider' },
];

function measureRequest(url) {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    let ttfb = 0;

    const req = http.get(url, (res) => {
      const firstByteTime = process.hrtime.bigint();
      ttfb = Number(firstByteTime - startTime) / 1e6; // ms

      let totalBytes = 0;
      res.on('data', (chunk) => {
        totalBytes += chunk.length;
      });

      res.on('end', () => {
        const endTime = process.hrtime.bigint();
        const totalDuration = Number(endTime - startTime) / 1e6; // ms
        resolve({
          statusCode: res.statusCode,
          ttfb: Math.round(ttfb * 10) / 10,
          totalDuration: Math.round(totalDuration * 10) / 10,
          bytes: totalBytes,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, ttfb: 0, totalDuration: 0, bytes: 0 });
    });
  });
}

async function testPages() {
  console.log('=== MEASURING PAGES (HTTP TTFB & Total Duration) ===');
  // Warm up first
  await measureRequest('http://localhost:3000/bn');
  
  for (const page of PAGES) {
    // Run 2 passes to get stable measurements
    const res1 = await measureRequest(page.url);
    const res2 = await measureRequest(page.url);
    const avgTtfb = Math.round((res1.ttfb + res2.ttfb) / 2);
    const avgDuration = Math.round((res1.totalDuration + res2.totalDuration) / 2);
    console.log(`${page.name.padEnd(25)} | Status: ${res2.statusCode} | TTFB: ${avgTtfb}ms | Total: ${avgDuration}ms | Size: ${(res2.bytes / 1024).toFixed(1)} KB`);
  }
}

async function testDatabase() {
  console.log('\n=== MEASURING DATABASE QUERY PERFORMANCE ===');
  const queries = [
    {
      name: 'Teacher findMany (unindexed isArchived/displayOrder)',
      fn: () => prisma.teacher.findMany({ where: { isPublished: true, isArchived: false }, orderBy: { displayOrder: 'asc' } }),
    },
    {
      name: 'Notice findMany (include translations)',
      fn: () => prisma.notice.findMany({ where: { isPublished: true }, include: { translations: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    },
    {
      name: 'SchoolEvent findMany (include album + images)',
      fn: () => prisma.schoolEvent.findMany({ where: { isPublished: true }, include: { album: { include: { images: true } } }, orderBy: { eventDate: 'desc' } }),
    },
    {
      name: 'GalleryImage findMany (all published images)',
      fn: () => prisma.galleryImage.findMany({ where: { isPublished: true }, include: { album: true } }),
    },
    {
      name: 'HomepageSlide findMany (active slides)',
      fn: () => prisma.homepageSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    },
    {
      name: 'Media findMany (all records)',
      fn: () => prisma.media.findMany({ orderBy: { createdAt: 'desc' } }),
    },
  ];

  for (const q of queries) {
    const start = process.hrtime.bigint();
    const result = await q.fn();
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1e6;
    console.log(`${q.name.padEnd(55)} | Count: ${Array.isArray(result) ? result.length : 1} | Time: ${duration.toFixed(2)}ms`);
  }
}

function testImages() {
  console.log('\n=== MEASURING IMAGES ON DISK ===');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) return;

  function walk(dir) {
    let files = [];
    fs.readdirSync(dir).forEach((f) => {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        files = files.concat(walk(full));
      } else {
        files.push(full);
      }
    });
    return files;
  }

  const allFiles = walk(uploadsDir);
  let totalBytes = 0;
  const largeFiles = [];

  allFiles.forEach((f) => {
    const stat = fs.statSync(f);
    totalBytes += stat.size;
    const rel = path.relative(path.join(process.cwd(), 'public'), f);
    if (stat.size > 200 * 1024) { // > 200KB
      largeFiles.push({ file: rel, sizeKb: (stat.size / 1024).toFixed(1), ext: path.extname(f) });
    }
  });

  console.log(`Total Uploaded Images: ${allFiles.length} files | Total Disk Size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Large files (> 200KB): ${largeFiles.length}`);
  largeFiles.slice(0, 10).forEach(lf => console.log(`  - ${lf.file}: ${lf.sizeKb} KB (${lf.ext})`));
}

async function run() {
  try {
    await testPages();
    await testDatabase();
    testImages();
  } finally {
    await prisma.$disconnect();
  }
}

run();
