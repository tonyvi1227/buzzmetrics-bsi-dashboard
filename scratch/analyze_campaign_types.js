import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const filePath = path.resolve('src/data/Update type campaign.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Sheet2'];
const excelData = XLSX.utils.sheet_to_json(sheet);

console.log(`Read ${excelData.length} records from Excel Sheet2.`);

// Build exact mapping dictionary: Campaign Key -> Type
const typeMap = new Map();

excelData.forEach(row => {
  const year = row['Năm'];
  const month = row['Tháng'];
  const brand = (row['Thương Hiệu'] || '').toString().trim();
  const campaign = (row['Tên Chiến Dịch'] || '').toString().trim();
  const type = (row['Loại Chiến Dịch (Campaign Type)'] || '').toString().trim();

  if (campaign && type) {
    // Key by campaign name normalized
    typeMap.set(campaign.toLowerCase(), type);
    // Also key by brand + campaign
    typeMap.set(`${brand.toLowerCase()}___${campaign.toLowerCase()}`, type);
  }
});

console.log(`Built map with ${typeMap.size} keys.`);

// Group campaigns by type and inspect keywords
const groupedByType = {};
excelData.forEach(row => {
  const campaign = (row['Tên Chiến Dịch'] || '').toString().trim();
  const brand = (row['Thương Hiệu'] || '').toString().trim();
  const type = (row['Loại Chiến Dịch (Campaign Type)'] || '').toString().trim();
  if (!groupedByType[type]) groupedByType[type] = [];
  groupedByType[type].push({ brand, campaign });
});

console.log('\n--- TYPE BREAKDOWN & SAMPLES ---');
for (const [type, items] of Object.entries(groupedByType)) {
  console.log(`\n>>> Type: "${type}" (${items.length} items)`);
  console.log('Sample items:');
  items.slice(0, 15).forEach(item => {
    console.log(`  - [${item.brand}] ${item.campaign}`);
  });
}
