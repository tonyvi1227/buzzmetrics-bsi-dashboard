import { parseCSVData } from '../src/utils/csvParser.ts';
import { initialCampaigns } from '../src/data/campaignDataset.ts';

function classifyCampaign(campaignName) {
  const name = campaignName.toUpperCase();

  // 1. Sponsor & Event
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

  // 2. Product Launch & Rebranding
  if (
    name.includes('LAUNCH') || name.includes('RA MẮT') || name.includes('RA MAT') ||
    name.includes('REBRANDING') || name.includes('SERIES') || name.includes('S26') ||
    name.includes('FIND X') || name.includes('MỚI') || name.includes('MOI') ||
    name.includes('NEW') || name.includes('PHIÊN BẢN') || name.includes('PHIEN BAN')
  ) {
    return 'Product Launch & Rebranding';
  }

  // 3. Promotion
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

  // 4. CSR & Sustainability
  if (
    name.includes('CSR') || name.includes('MẦM XANH') || name.includes('MAM XANH') ||
    name.includes('RỪNG') || name.includes('RUNG') || name.includes('SỐNG XANH') ||
    name.includes('SONG XANH') || name.includes('CHUYỂN XANH') || name.includes('CHUYEN XANH') ||
    name.includes('MÔI TRƯỜNG') || name.includes('MOI TRUONG') || name.includes('VÌ MỘT') ||
    name.includes('VI MOT') || name.includes('HPV') || name.includes('UNG THƯ') ||
    name.includes('UNG THU') || name.includes('HÒA BÌNH') || name.includes('HOA BINH') ||
    name.includes('TIÊM CHỦNG') || name.includes('TIEM CHUNG') || name.includes('SỨC KHỎE')
  ) {
    return 'CSR & Sustainability';
  }

  // 5. Default Fallback
  return 'Thematic & Brand Building';
}

const stats = {};
const samples = {};

initialCampaigns.forEach(c => {
  const type = classifyCampaign(c.campaign);
  stats[type] = (stats[type] || 0) + 1;
  if (!samples[type]) samples[type] = [];
  if (samples[type].length < 8) samples[type].push(`${c.brand} - ${c.campaign}`);
});

console.log('=== CLASSIFICATION STATS ===');
console.log(stats);
console.log('=== SAMPLE CLASSIFICATIONS ===');
console.log(JSON.stringify(samples, null, 2));
