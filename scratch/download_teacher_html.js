const https = require('https');
const fs = require('fs');

https.get('https://www.pbn.edu.bd/index.php?nav_id=teacher_info', { rejectUnauthorized: false }, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/teacher_info.html', html, 'utf8');
    console.log('Saved scratch/teacher_info.html, length:', html.length);
  });
}).on('error', console.error);
