const fs = require('fs');
const html = fs.readFileSync('scratch/teacher_info.html', 'utf8');

// Search for images, table rows, cards, or teacher names
const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
console.log("Found img tags:", imgMatches.length);
imgMatches.slice(0, 15).forEach((img, i) => console.log(`${i+1}: ${img}`));

// Search for teacher card blocks or table rows
const contentStart = html.indexOf('<div class="container"');
console.log("\nSample content structure around main area:\n", html.slice(contentStart, contentStart + 3000));
