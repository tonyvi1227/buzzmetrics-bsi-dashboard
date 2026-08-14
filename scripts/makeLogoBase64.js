const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '../public/buzzmetrics-logo.png');
const outPath = path.join(__dirname, '../src/assets/buzzmetricsLogoData.ts');

const bytes = fs.readFileSync(imgPath);
const b64 = bytes.toString('base64');
const content = `export const BUZZMETRICS_LOGO_BASE64 = 'data:image/png;base64,${b64}';\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Logo converted to Base64 successfully!');
