import fs from 'fs';
import { initialCampaigns } from '../src/data/campaignDataset.ts';

export function classifyCampaign(campaignName, brandName) {
  const name = (campaignName || '').toUpperCase();
  const brand = (brandName || '').toUpperCase();

  // 1. Brand TW ĐOÀN TNCS HỒ CHÍ MINH -> Sponsor & Event
  if (
    brand.includes('TW ĐOÀN') || brand.includes('ĐOÀN TNCS') || brand.includes('TNCS HỒ CHÍ MINH') ||
    name.includes('TW ĐOÀN') || name.includes('ĐOÀN TNCS')
  ) {
    return 'Sponsor & Event';
  }

  // 2. Product Launch & Rebranding (Override for New Package / Limited Edition / Launching)
  if (
    name.includes('LAUNCH') || name.includes('RA MẮT') || name.includes('RA MAT') ||
    name.includes('REBRANDING') || name.includes('SERIES') || name.includes('S26') ||
    name.includes('FIND X') || name.includes('MỚI') || name.includes('MOI') ||
    name.includes('NEW') || name.includes('PHIÊN BẢN GIỚI HẠN') || name.includes('PHIEN BAN GIOI HAN') ||
    name.includes('BAO BÌ MỚI') || name.includes('BAO BI MOI') || name.includes('NEW PACKAGE') ||
    name.includes('PHIÊN BẢN')
  ) {
    return 'Product Launch & Rebranding';
  }

  // 3. Sponsor & Event
  if (
    name.includes('SPONSOR') || name.includes('TÀI TRỢ') || name.includes('TAI TRO') ||
    name.includes('CONCERT') || name.includes('MUSIC') || name.includes('FESTIVAL') ||
    name.includes('EVENT') || name.includes('LỄ HỘI') || name.includes('LE HOI') ||
    name.includes('SHOW') || name.includes('ANH TRAI') || name.includes('CHỊ ĐẸP') ||
    name.includes('NGOẠI HẠNG ANH') || name.includes('WORLD CUP') || name.includes('MARATHON') ||
    name.includes('FANDOM') || name.includes('COUNTDOWN') || name.includes('GIẢI ĐẤU') ||
    name.includes('GIAI DAU') || name.includes('MATCH') || name.includes('FAN MEETING')
  ) {
    return 'Sponsor & Event';
  }

  // 4. Promotion
  if (
    name.includes('PROMO') || name.includes('SĂN') || name.includes('SAN') ||
    name.includes('TRÚNG') || name.includes('TRUNG') || name.includes('QUÉT MÃ') ||
    name.includes('QUET MA') || name.includes('BẬT LON') || name.includes('BAT LON') ||
    name.includes('GIẬT NẮP') || name.includes('GIAT NAP') || name.includes('COMBO') ||
    name.includes('TẶNG') || name.includes('TANG') || name.includes('VOUCHER') ||
    name.includes('FREE MÃ') || name.includes('FREE MA') || name.includes('ĐỔI QUÀ') ||
    name.includes('DOI QUA') || name.includes('CODE') || name.includes('ƯU ĐÃI')
  ) {
    return 'Promotion';
  }

  // 5. CSR & Sustainability
  if (
    name.includes('CSR') || name.includes('MẦM XANH') || name.includes('MAM XANH') ||
    name.includes('RỪNG') || name.includes('RUNG') || name.includes('SỐNG XANH') ||
    name.includes('SONG XANH') || name.includes('CHUYỂN XANH') || name.includes('CHUYEN XANH') ||
    name.includes('MÔI TRƯỜNG') || name.includes('MOI TRUONG') || name.includes('VÌ MỘT') ||
    name.includes('VI MOT') || name.includes('HPV') || name.includes('UNG THƯ') ||
    name.includes('UNG THU') || name.includes('TIÊM CHỦNG') || name.includes('TIEM CHUNG') ||
    name.includes('SỨC KHỎE')
  ) {
    return 'CSR & Sustainability';
  }

  // 6. Default Fallback
  return 'Thematic & Brand Building';
}

const list = initialCampaigns.map((c, i) => ({
  stt: i + 1,
  year: c.year,
  month: c.month,
  category: c.category,
  brand: c.brand,
  campaign: c.campaign,
  campaignType: classifyCampaign(c.campaign, c.brand),
}));

// Export CSV
let csv = 'STT,Năm,Tháng,Ngành Hàng,Thương Hiệu,Tên Chiến Dịch,Loại Chiến Dịch (Campaign Type)\n';
list.forEach(item => {
  const safeCamp = `"${item.campaign.replace(/"/g, '""')}"`;
  csv += `${item.stt},${item.year},${item.month},"${item.category}","${item.brand}",${safeCamp},"${item.campaignType}"\n`;
});

fs.writeFileSync('scratch/campaign_classification_check.csv', csv, 'utf-8');

// Export Markdown Artifact
let md = `# BẢNG KIỂM CHỨNG PHÂN LOẠI 318 CHIẾN DỊCH (FINAL CHECK)\n\n`;
md += `Tập dữ liệu gồm **318 chiến dịch** đã được tự động phân loại theo 5 nhóm.\n\n`;
md += `| STT | Thương Hiệu (Brand) | Tên Chiến Dịch (Campaign) | Loại Chiến Dịch (Campaign Type) | Ngành Hàng |\n`;
md += `| :---: | :--- | :--- | :--- | :--- |\n`;

list.forEach(item => {
  md += `| ${item.stt} | **${item.brand}** | ${item.campaign} | \`${item.campaignType}\` | ${item.category} |\n`;
});

fs.writeFileSync('scratch/campaign_classification_check.md', md, 'utf-8');

console.log('Successfully re-generated scratch/campaign_classification_check.csv and scratch/campaign_classification_check.md with TW ĐOÀN TNCS HỒ CHÍ MINH mapped to Sponsor & Event');
