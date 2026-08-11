import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const filePath = path.resolve('src/data/Update type campaign.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Sheet2'];
const excelData = XLSX.utils.sheet_to_json(sheet);

// Read campaignDataset.ts content
const datasetContent = fs.readFileSync(path.resolve('src/data/campaignDataset.ts'), 'utf8');

// Build exact map from Excel
const excelMap = new Map();
excelData.forEach(r => {
  const brand = (r['Thương Hiệu'] || '').toString().trim();
  const campaign = (r['Tên Chiến Dịch'] || '').toString().trim();
  const type = (r['Loại Chiến Dịch (Campaign Type)'] || '').toString().trim();

  if (campaign && type) {
    excelMap.set(`${brand.toLowerCase()}___${campaign.toLowerCase()}`, type);
    excelMap.set(campaign.toLowerCase(), type);
  }
});

// Extract all objects from datasetContent using regex
const records = [];
const recordRegex = /{\s*id:\s*['"]([^'"]+)['"],\s*year:\s*['"]([^'"]+)['"],\s*month:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"],\s*brand:\s*['"]([^'"]+)['"],\s*campaign:\s*['"]([^'"]+)['"]/g;

let match;
while ((match = recordRegex.exec(datasetContent)) !== null) {
  records.push({
    id: match[1],
    year: match[2],
    month: match[3],
    category: match[4],
    brand: match[5],
    campaign: match[6],
  });
}

console.log(`Extracted ${records.length} records from campaignDataset.ts.`);

let matched = 0;
let unmapped = 0;
const unmappedItems = [];

records.forEach(item => {
  const key1 = `${item.brand.toLowerCase()}___${item.campaign.toLowerCase()}`;
  const key2 = item.campaign.toLowerCase();
  const type = excelMap.get(key1) || excelMap.get(key2);

  if (type) {
    matched++;
  } else {
    unmapped++;
    unmappedItems.push(item);
  }
});

console.log(`Matched with Excel: ${matched} / ${records.length}`);
console.log(`Unmapped: ${unmapped}`);

if (unmappedItems.length > 0) {
  console.log('\nUnmapped items sample (first 25):');
  unmappedItems.slice(0, 25).forEach(i => console.log(`  - [${i.brand}] (${i.category}) "${i.campaign}"`));
}
