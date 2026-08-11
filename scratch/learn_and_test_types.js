import XLSX from 'xlsx';
import path from 'path';

const filePath = path.resolve('src/data/Update type campaign.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Sheet2'];
const excelData = XLSX.utils.sheet_to_json(sheet);

// Build exact map
const exactMap = new Map();
excelData.forEach(r => {
  const brand = (r['Thương Hiệu'] || '').toString().trim();
  const campaign = (r['Tên Chiến Dịch'] || '').toString().trim();
  const type = (r['Loại Chiến Dịch (Campaign Type)'] || '').toString().trim();

  if (campaign && type) {
    exactMap.set(`${brand.toUpperCase()}___${campaign.toUpperCase()}`, type);
    exactMap.set(campaign.toUpperCase(), type);
  }
});

// Refined rule classifier
function classifyCampaignTypeRefined(campaignName, brandName) {
  const name = (campaignName || '').toUpperCase();
  const brand = (brandName || '').toUpperCase();

  // 0. Exact Lookup Map Check First
  const exactKey1 = `${brand}___${name}`;
  const exactKey2 = name;
  if (exactMap.has(exactKey1)) return exactMap.get(exactKey1);
  if (exactMap.has(exactKey2)) return exactMap.get(exactKey2);

  // 1. Brand TW ĐOÀN TNCS HỒ CHÍ MINH -> Sponsor & Event
  if (
    brand.includes('TW ĐOÀN') || brand.includes('ĐOÀN TNCS') || brand.includes('TNCS HỒ CHÍ MINH') ||
    name.includes('TW ĐOÀN') || name.includes('ĐOÀN TNCS')
  ) {
    return 'Sponsor & Event';
  }

  // 2. CSR & Sustainability (Health / Environmental / HPV / Health Prevention / Forest)
  if (
    name.includes('CSR') || name.includes('MẦM XANH') || name.includes('MAM XANH') ||
    name.includes('RỪNG') || name.includes('RUNG') || name.includes('SỐNG XANH') ||
    name.includes('SONG XANH') || name.includes('CHUYỂN XANH') || name.includes('CHUYEN XANH') ||
    name.includes('MÔI TRƯỜNG') || name.includes('MOI TRUONG') || name.includes('VÌ MỘT') ||
    name.includes('VI MOT') || name.includes('HPV') || name.includes('UNG THƯ') ||
    name.includes('UNG THU') || name.includes('DỰ PHÒNG SỨC KHỎE') || name.includes('SỨC KHỎE VÀNG')
  ) {
    return 'CSR & Sustainability';
  }

  // 3. Sponsor & Event (Music, Sports, Tour, Concert, Rave, F1, Festival, Games, Shows)
  if (
    name.includes('SPONSOR') || name.includes('TÀI TRỢ') || name.includes('TAI TRO') ||
    name.includes('CONCERT') || name.includes('MUSIC') || name.includes('FESTIVAL') ||
    name.includes('EVENT') || name.includes('LỄ HỘI') || name.includes('LE HOI') ||
    name.includes('SHOW') || name.includes('ANH TRAI') || name.includes('CHỊ ĐẸP') ||
    name.includes('NGOẠI HẠNG ANH') || name.includes('WORLD TOUR') || name.includes('MARATHON') ||
    name.includes('FANDOM') || name.includes('COUNTDOWN') || name.includes('GIẢI ĐẤU') ||
    name.includes('GIAI DAU') || name.includes('MATCH') || name.includes('FAN MEETING') ||
    name.includes('RAVE') || name.includes('FOOTBALL') || name.includes('SEAGAMES') ||
    name.includes('EDURUN') || name.includes('VOVINAM') || name.includes('COLORFEST') ||
    name.includes('TOUR') || name.includes('HERO ENGAGEMENT') || name.includes('F1') ||
    name.includes('BILLIONAIRE') || name.includes('ĐẤU TRƯỜNG') || name.includes('NGÀY HỘI')
  ) {
    return 'Sponsor & Event';
  }

  // 4. Promotion (Coupons, Gifts, Scans, Lucky caps, Free, Combo, Promo, Khuyến Mại)
  if (
    name.includes('PROMO') || name.includes('SĂN') || name.includes('SAN') ||
    name.includes('TRÚNG') || name.includes('TRUNG') || name.includes('QUÉT MÃ') ||
    name.includes('QUET MA') || name.includes('BẬT LON') || name.includes('BAT LON') ||
    name.includes('GIẬT NẮP') || name.includes('GIAT NAP') || name.includes('COMBO') ||
    name.includes('TẶNG') || name.includes('TANG') || name.includes('VOUCHER') ||
    name.includes('FREE MÃ') || name.includes('FREE MA') || name.includes('ĐỔI QUÀ') ||
    name.includes('DOI QUA') || name.includes('CODE') || name.includes('ƯU ĐÃI') ||
    name.includes('KHUYẾN MẠI') || name.includes('KHUYEN MAI') || name.includes('KHUYẾN MÃI')
  ) {
    return 'Promotion';
  }

  // 5. Product Launch & Rebranding (New models, Series, 5G, Lite, Pro, Ultra, Limited Edition, New Product, Clean Label, Creamer)
  if (
    name.includes('LAUNCH') || name.includes('RA MẮT') || name.includes('RA MAT') ||
    name.includes('REBRANDING') || name.includes('SERIES') || name.includes('S26') ||
    name.includes('S25') || name.includes('A57') || name.includes('A37') || name.includes('A56') ||
    name.includes('FIND X') || name.includes('NEW') || name.includes('PHIÊN BẢN GIỚI HẠN') ||
    name.includes('PHIEN BAN GIOI HAN') || name.includes('BAO BÌ MỚI') || name.includes('BAO BI MOI') ||
    name.includes('NEW PACKAGE') || name.includes('PHIÊN BẢN') || name.includes('5G') ||
    name.includes('LITE') || name.includes('Y29') || name.includes('V60') || name.includes('V50') ||
    name.includes('CLEAN LABEL') || name.includes('CREAMER') || name.includes('SỮA ĐẶC') ||
    brand === 'VIVO' || (brand === 'SAMSUNG' && (name.includes('GALAXY') || name.includes('SERIES')))
  ) {
    return 'Product Launch & Rebranding';
  }

  return 'Thematic & Brand Building';
}

// Test accuracy
let correct = 0;
excelData.forEach(r => {
  const brand = (r['Thương Hiệu'] || '').toString().trim();
  const campaign = (r['Tên Chiến Dịch'] || '').toString().trim();
  const excelType = (r['Loại Chiến Dịch (Campaign Type)'] || '').toString().trim();

  const res = classifyCampaignTypeRefined(campaign, brand);
  if (res === excelType) correct++;
});

console.log(`Refined Accuracy on Excel Dataset: ${correct} / ${excelData.length} (${((correct*100)/excelData.length).toFixed(1)}%)`);
