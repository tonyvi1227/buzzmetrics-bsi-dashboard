import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const filePath = path.resolve('src/data/Update type campaign.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Sheet2'];
const excelData = XLSX.utils.sheet_to_json(sheet);

console.log(`Loaded ${excelData.length} records from Excel.`);

// Build exact lookup map code string for csvParser.ts
const mapEntries = [];
excelData.forEach(r => {
  const brand = (r['Thương Hiệu'] || '').toString().trim();
  const campaign = (r['Tên Chiến Dịch'] || '').toString().trim();
  const type = (r['Loại Chiến Dịch (Campaign Type)'] || '').toString().trim();

  if (campaign && type) {
    const key1 = `${brand.toUpperCase()}___${campaign.toUpperCase()}`;
    const key2 = campaign.toUpperCase();
    mapEntries.push([key1, type]);
    mapEntries.push([key2, type]);
  }
});

// Output code for csvParser.ts
console.log(`Generated ${mapEntries.length} dictionary entries for csvParser.ts.`);
