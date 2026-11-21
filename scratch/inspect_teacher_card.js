const fs = require('fs');
const html = fs.readFileSync('scratch/teacher_info.html', 'utf8');

// Find where teacher_img or E00000 appears
const idx = html.indexOf('E000001');
if (idx !== -1) {
  console.log(html.slice(idx - 300, idx + 1200));
}
