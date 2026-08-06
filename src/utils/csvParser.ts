import Papa from 'papaparse';
import { CampaignRecord, CampaignType } from '../types/dashboard';
import { standardizeCategory, standardizeBrand } from './brandStandardizer';

export function classifyCampaignType(campaignName: string, brandName: string): CampaignType {
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

export function parseCSVData(csvText: string): CampaignRecord[] {
  const parsed = Papa.parse<string[]>(csvText, {
    skipEmptyLines: true,
  });

  const rows = parsed.data;
  if (!rows || rows.length <= 1) return [];

  const records: CampaignRecord[] = [];
  const brandCatFreq: Record<string, Record<string, number>> = {};

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length < 10) continue;

    const year = (r[0] || '').trim();
    const month = (r[1] || '').trim();
    const campaignFull = (r[4] || '').trim();

    if (!year || !month || !campaignFull) continue;

    let category = 'Khác';
    let brandRaw = 'OTHERS';
    let campaignName = campaignFull;

    const match = campaignFull.match(/^\[(.*?)\]\s*(.*?)$/);
    if (match) {
      category = standardizeCategory(match[1].trim());
      const rest = match[2].trim();
      const underscoreIdx = rest.indexOf('_');
      if (underscoreIdx !== -1) {
        brandRaw = rest.substring(0, underscoreIdx).trim();
        campaignName = rest.substring(underscoreIdx + 1).trim();
      } else {
        brandRaw = rest;
        campaignName = rest;
      }
    }

    let brand = standardizeBrand(brandRaw);

    if (campaignFull.toUpperCase().includes('TỰ HÀO VIỆT NAM') || campaignFull.toUpperCase().includes('TU HAO VIET NAM')) {
      brand = 'TW ĐOÀN TNCS HỒ CHÍ MINH';
    } else if (campaignFull.toUpperCase().includes('FANDOM YÊU NƯỚC') || campaignFull.toUpperCase().includes('FANDOM YEU NUOC')) {
      brand = 'KENH14.VN';
    }

    if (!brandCatFreq[brand]) brandCatFreq[brand] = {};
    brandCatFreq[brand][category] = (brandCatFreq[brand][category] || 0) + 1;

    const cleanNum = (val: string) => {
      if (!val) return 0;
      const s = val.replace(/,/g, '').replace(/%/g, '').trim();
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };

    const bsi = cleanNum(r[5]);
    const buzzVolume = cleanNum(r[6]);
    const contentQU = cleanNum(r[7]);
    const quBuzzPct = cleanNum(r[8]);
    const sentiment = cleanNum(r[9]);
    const quUser = cleanNum(r[10]);
    const relevancy = cleanNum(r[11]);
    const earnedPct = cleanNum(r[18]);
    const owned = cleanNum(r[19]);
    const paid = cleanNum(r[20]);
    const earned = cleanNum(r[21]);

    const campaignType = classifyCampaignType(campaignName, brand);

    records.push({
      id: `rec_${year}_${month}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      year,
      month,
      rawCategory: category,
      category,
      brand,
      campaign: campaignName,
      campaignType,
      bsi,
      buzzVolume,
      contentQU,
      quBuzzPct,
      sentiment,
      quUser,
      relevancy,
      earnedPct,
      owned,
      paid,
      earned,
    });
  }

  return records;
}
