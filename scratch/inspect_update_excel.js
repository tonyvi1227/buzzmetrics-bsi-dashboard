import XLSX from 'xlsx';
import path from 'path';

const filePath = path.resolve('src/data/Update type campaign.xlsx');
const workbook = XLSX.readFile(filePath);

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(`\n--- Sheet: ${sheetName} (Rows: ${data.length}) ---`);
  if (data.length > 0) {
    console.log('Keys:', Object.keys(data[0]));
    const types = {};
    data.forEach(r => {
      const typeVal = r['Loại Chiến Dịch (Campaign Type)'] || r['Loại Campaign'] || r['Type'] || r['Campaign Type'];
      if (typeVal) {
        types[typeVal] = (types[typeVal] || 0) + 1;
      }
    });
    console.log('Type breakdown:', types);
  }
});
