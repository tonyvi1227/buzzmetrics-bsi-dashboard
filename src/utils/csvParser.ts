import Papa from 'papaparse';
import { CampaignRecord } from '../types/dashboard';
import { standardizeBrand } from './brandStandardizer';

export function parseCSVData(csvText: string): CampaignRecord[] {
  const parsed = Papa.parse<string[]>(csvText.trim(), {
    skipEmptyLines: true,
  });

  const lines = parsed.data;
  if (!lines || lines.length < 2) return [];

  const rawRecords: Omit<CampaignRecord, 'id' | 'category'>[] = [];
  const brandCatFreq: Record<string, Record<string, number>> = {};

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (!row || row.length < 21) continue;

    const year = row[0] ? row[0].trim() : '';
    const month = row[1] ? row[1].trim() : '';
    const campaignFull = row[4] ? row[4].trim() : '';

    let category = 'Khác';
    let brandRaw = 'Khác';
    let campaignName = campaignFull;

    const catMatch = campaignFull.match(/\[(.*?)\]/);
    if (catMatch && catMatch[1]) {
      category = catMatch[1].trim();
      const rest = campaignFull.replace(/\[.*?\]/, '').trim();
      
      if (rest.includes('_')) {
        const parts = rest.split('_');
        brandRaw = parts[0].trim();
        campaignName = parts.slice(1).join('_').trim();
      } else if (rest.includes('-')) {
        const parts = rest.split('-');
        brandRaw = parts[0].trim();
        campaignName = parts.slice(1).join('-').trim();
      } else {
        brandRaw = rest.split(' ')[0].trim();
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

    const cleanNum = (str: string) => {
      if (!str) return 0;
      const cleaned = str.replace(/,/g, '').replace('%', '').trim();
      const val = parseFloat(cleaned);
      return isNaN(val) ? 0 : val;
    };

    rawRecords.push({
      year,
      month,
      rawCategory: category,
      brand,
      campaign: campaignName || campaignFull,
      bsi: cleanNum(row[5]),
      buzzVolume: cleanNum(row[6]),
      contentQU: cleanNum(row[7]),
      quBuzzPct: cleanNum(row[8]),
      sentiment: cleanNum(row[9]),
      quUser: cleanNum(row[10]),
      relevancy: cleanNum(row[11]),
      earnedPct: cleanNum(row[18]),
      owned: cleanNum(row[19]),
      paid: cleanNum(row[20]),
      earned: cleanNum(row[21]),
    });
  }

  // Calculate majority category per standardized brand
  const brandMajorityCategory: Record<string, string> = {};
  Object.keys(brandCatFreq).forEach(b => {
    let maxCount = -1;
    let topCat = 'Khác';
    Object.entries(brandCatFreq[b]).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCat = cat;
      }
    });
    brandMajorityCategory[b] = topCat;
  });

  return rawRecords.map((r, idx) => ({
    ...r,
    id: `rec_${r.year}_${r.month}_${idx}`,
    category: brandMajorityCategory[r.brand] || r.rawCategory,
  }));
}
