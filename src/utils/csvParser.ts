import Papa from 'papaparse';
import { CampaignRecord, CampaignType } from '../types/dashboard';
import { standardizeCategory, standardizeBrand } from './brandStandardizer';

// Verified manual classifications from "Update type campaign.xlsx"
const VERIFIED_EXCEL_TYPE_MAP: Record<string, CampaignType> = {
  // VPBANK
  "VPBANK___G-DRAGON 2025 WORLD TOUR [ÜBERMENSCH] IN HANOI, PRESENTED BY VPBANK": "Sponsor & Event",
  "G-DRAGON 2025 WORLD TOUR [ÜBERMENSCH] IN HANOI, PRESENTED BY VPBANK": "Sponsor & Event",
  "VPBANK___VPBANK CAN THO MUSIC NIGHT RUN 2025": "Sponsor & Event",
  "VPBANK CAN THO MUSIC NIGHT RUN 2025": "Sponsor & Event",
  "VPBANK___VPBANK VIETNAM INTERNATIONAL MARATHON 2025": "Sponsor & Event",
  "VPBANK VIETNAM INTERNATIONAL MARATHON 2025": "Sponsor & Event",

  // VIVO
  "VIVO___VIVO V60 5G": "Product Launch & Rebranding",
  "VIVO V60 5G": "Product Launch & Rebranding",
  "VIVO___VIVO V50 LITE": "Product Launch & Rebranding",
  "VIVO V50 LITE": "Product Launch & Rebranding",
  "VIVO___VIVO Y29": "Product Launch & Rebranding",
  "VIVO Y29": "Product Launch & Rebranding",
  "VIVO___RA MẮT VIVO Y29": "Product Launch & Rebranding",
  "RA MẮT VIVO Y29": "Product Launch & Rebranding",
  "VIVO___RA MẮT VIVO V50 LITE": "Product Launch & Rebranding",

  // VINAMILK
  "VINAMILK___SỮA TƯƠI VINAMILK 100% - CLEAN LABEL PROJECT": "Product Launch & Rebranding",
  "SỮA TƯƠI VINAMILK 100% - CLEAN LABEL PROJECT": "Product Launch & Rebranding",
  "VINAMILK___SỮA ĐẶC CREAMER": "Product Launch & Rebranding",
  "SỮA ĐẶC CREAMER": "Product Launch & Rebranding",
  "VINAMILK___VINAMILK GREEN FARM": "Product Launch & Rebranding",
  "VINAMILK GREEN FARM": "Product Launch & Rebranding",

  // UNILEVER
  "UNILEVER___PHIÊN BẢN GIỚI HẠN FIFA WORLD CUP 2026": "Product Launch & Rebranding",
  "PHIÊN BẢN GIỚI HẠN FIFA WORLD CUP 2026": "Product Launch & Rebranding",

  // TUBORG
  "TUBORG___GIẬT NẮP LÊN VẬN, NĂM MỚI LÊN VẬN": "Promotion",
  "GIẬT NẮP LÊN VẬN, NĂM MỚI LÊN VẬN": "Promotion",
  "TUBORG___SĂN THÊM NẮP TRÚNG GẮP TRĂM": "Promotion",
  "SĂN THÊM NẮP TRÚNG GẮP TRĂM": "Promotion",
  "TUBORG___VUI LỄ MỚI, CHƠI PHẢI TỚI": "Promotion",
  "VUI LỄ MỚI, CHƠI PHẢI TỚI": "Promotion",
  "TUBORG___TUBORG X BILLIONAIRE BOYS CLUB": "Sponsor & Event",
  "TUBORG X BILLIONAIRE BOYS CLUB": "Sponsor & Event",
  "TUBORG___SAO PHẢI THEO CHUẨN": "Thematic & Brand Building",

  // TIGER
  "TIGER___TIGER STREET FOOTBALL 2025": "Sponsor & Event",
  "TIGER STREET FOOTBALL 2025": "Sponsor & Event",
  "TIGER___TIGER CRYSTAL HERO ENGAGEMENT": "Sponsor & Event",
  "TIGER CRYSTAL HERO ENGAGEMENT": "Sponsor & Event",
  "TIGER___TIGER CRYSTAL RAVE 2025": "Sponsor & Event",
  "TIGER CRYSTAL RAVE 2025": "Sponsor & Event",
  "TIGER___BẬT LON COOL PACK, SĂN TIGER VÀNG": "Promotion",
  "TIGER___TIGER ÊM MỚI": "Product Launch & Rebranding",

  // STING
  "STING___STINGXF1": "Sponsor & Event",
  "STINGXF1": "Sponsor & Event",
  "STING___STING F1": "Sponsor & Event",
  "STING F1": "Sponsor & Event",

  // SPRITE
  "SPRITE___KHUYẾN MẠI COOL THỨ THIỆT": "Promotion",
  "KHUYẾN MẠI COOL THỨ THIỆT": "Promotion",

  // SAMSUNG
  "SAMSUNG___GALAXY A57 5G": "Product Launch & Rebranding",
  "GALAXY A57 5G": "Product Launch & Rebranding",
  "SAMSUNG___GALAXY A37 5G": "Product Launch & Rebranding",
  "GALAXY A37 5G": "Product Launch & Rebranding",
  "SAMSUNG___GALAXY S26 SERIES": "Product Launch & Rebranding",
  "GALAXY S26 SERIES": "Product Launch & Rebranding",
  "SAMSUNG___GALAXY A56 5G": "Product Launch & Rebranding",
  "GALAXY A56 5G": "Product Launch & Rebranding",
  "SAMSUNG___GALAXY S25 FE": "Product Launch & Rebranding",
  "GALAXY S25 FE": "Product Launch & Rebranding",

  // RED BULL & ROCKSTAR
  "RED BULL___KHÔNG TẬP TRUNG, KHÔNG LỐI THOÁT": "Thematic & Brand Building",
  "RED BULL___NĂM MỚI BẢN LĨNH HÚC TỚI ĐI": "Thematic & Brand Building",
  "RED BULL___RED BULL EXTRA": "Thematic & Brand Building",
  "ROCKSTAR___ĐẤU TRƯỜNG MẠNH BỀN": "Sponsor & Event",
  "ĐẤU TRƯỜNG MẠNH BỀN": "Sponsor & Event",

  // OMO & NAN
  "OMO___GIEO TRIỆU MẦM XANH, PHỦ VẠN CÁNH RỪNG": "CSR & Sustainability",
  "GIEO TRIỆU MẦM XANH, PHỦ VẠN CÁNH RỪNG": "CSR & Sustainability",
  "OMO___NẢY VẬN LỘC TẾT": "Thematic & Brand Building",
  "OMO___OMO SIÊU TỐC - SẠCH VƯỢT TRỘI CHỈ 15 PHÚT": "Product Launch & Rebranding",
  "NAN___NAN A2 RTD PROMOTION": "Promotion",
  "NAN A2 RTD PROMOTION": "Promotion",
  "NAN___MÙA MẪN CẢM - KHÔNG SAO MẸ ƠI": "Thematic & Brand Building",
  "NAN___NAN SUPREME PRO 3 - MÙA MẪN CẢM KHÔNG SAO MẸ ƠI": "Thematic & Brand Building",

  // MILO
  "MILO___CHUỖI HOẠT ĐỘNG ĐỒNG DIỄN VÕ NHẠC VOVINAM & EDURUN 2025": "Sponsor & Event",
  "CHUỖI HOẠT ĐỘNG ĐỒNG DIỄN VÕ NHẠC VOVINAM & EDURUN 2025": "Sponsor & Event",
  "MILO___MILO X SEAGAMES 23": "Sponsor & Event",
  "MILO X SEAGAMES 23": "Sponsor & Event",
  "MILO___MILO A2 PROMOTION": "Promotion",
  "MILO A2 PROMOTION": "Promotion",
  "MILO___MILO NĂNG ĐỘNG VIỆT NAM": "Thematic & Brand Building",
  "MILO___BỘ BA LỢI THẾ": "Thematic & Brand Building",
  "MILO___MILO VIỆT NAM - 30 NĂM ĐỒNG HÀNH": "Thematic & Brand Building",
  "MILO___BỀN BỈ HƠN TỪNG NGÀY": "Thematic & Brand Building",
  "MILO___MILO ỐNG HÚT 4 CHIỀU": "Product Launch & Rebranding",

  // LONG CHÂU
  "TIÊM CHỦNG LONG CHÂU___HIEUTHUHAI - VÌ DỰ PHÒNG SỨC KHỎE LÀ THỨ NHẤT": "CSR & Sustainability",
  "HIEUTHUHAI - VÌ DỰ PHÒNG SỨC KHỎE LÀ THỨ NHẤT": "CSR & Sustainability",
  "TIÊM CHỦNG LONG CHÂU___VÌ MỘT THẾ HỆ TRẺ KHÔNG UNG THƯ DO HPV": "CSR & Sustainability",
  "VÌ MỘT THẾ HỆ TRẺ KHÔNG UNG THƯ DO HPV": "CSR & Sustainability",
  "TIÊM CHỦNG LONG CHÂU___#VÌMỘTTHẾHỆTRẺKHÔNGUNGTHƯDOHPV": "CSR & Sustainability",
  "TIÊM CHỦNG LONG CHÂU___BIẾT TUỐT VỀ HPV": "CSR & Sustainability",

  // LARUE & KOTEX & JOLLIBEE
  "LARUE___SUMMER EVENT COLORFEST 2025": "Sponsor & Event",
  "SUMMER EVENT COLORFEST 2025": "Sponsor & Event",
  "LARUE___LARUE SUMMER PROMO Q2 2025": "Promotion",
  "LARUE SUMMER PROMO Q2 2025": "Promotion",
  "LARUE___LÊN LARUE VUI TRÒN CUỘC VUI": "Thematic & Brand Building",
  "KOTEX___ANH TRAI GOOD NIGHT": "Sponsor & Event",
  "ANH TRAI GOOD NIGHT": "Sponsor & Event",
  "JOLLIBEE___VUI RỘN RÀNG COMBO CÙNG LỄ HỘI": "Promotion",
  "VUI RỘN RÀNG COMBO CÙNG LỄ HỘI": "Promotion",
  "JOLLIBEE___HOẠT ĐỘNG MỞ RA NIỀM VUI": "Thematic & Brand Building",

  // ĐIỆN MÁY XANH & BUDWEISER & BIA VIỆT & 1664 BLANC & ENSURE
  "ĐIỆN MÁY XANH___TẾT FREE MÃ": "Promotion",
  "TẾT FREE MÃ": "Promotion",
  "BUDWEISER___QUÉT MÃ QR - THẮNG CHUYẾN ĐI MỸ XEM FFCWC 2025": "Promotion",
  "QUÉT MÃ QR - THẮNG CHUYẾN ĐI MỸ XEM FFCWC 2025": "Promotion",
  "BIA VIỆT___BIA VIỆT PROMOTION Q3": "Promotion",
  "BIA VIỆT PROMOTION Q3": "Promotion",
  "1664 BLANC___SĂN CHẠNG VẠNG, THĂNG HẠNG GU CHẤT": "Promotion",
  "SĂN CHẠNG VẠNG, THĂNG HẠNG GU CHẤT": "Promotion",
  "1664 BLANC___SĂN CHẠNG VẠNG CÙNG 1664 BLANC": "Promotion",
  "ENSURE___TRAO QUÀ SỨC KHỎE VÀNG": "CSR & Sustainability",
  "TRAO QUÀ SỨC KHỎE VÀNG": "CSR & Sustainability",

  // OTHER BRANDS
  "MSB___TẾT CÓ LỜI CÙNG MSB": "Thematic & Brand Building",
  "MIRINDA___LẬP TỤ SIÊU VUI": "Thematic & Brand Building",
  "MICHELOB ULTRA___VỊ BIA VƯỢT TRỘI, XỨNG TẦM CUỘC CHƠI": "Thematic & Brand Building",
  "MICHELOB ULTRA___MICHELOB ULTRA LAUNCHING CAMPAIGN": "Product Launch & Rebranding",
  "MANULIFE___XANH PHÚ QUÝ": "Thematic & Brand Building",
  "LAVIE___KHỞI ĐẦU DỊU NHẸ TỚI LỐI SỐNG KHỎE": "Thematic & Brand Building",
  "SURF___LÊN HƯƠNG CÙNG SURF": "Thematic & Brand Building",
  "7UP___7UP SIÊU SIÊU SẢNG KHOÁI": "Thematic & Brand Building",
  "SIUKAY___NGON TAN CHẢY CAY BÙNG CHÁY CÂN MỌI TỌA ĐỘ": "Thematic & Brand Building",
  "LIFEBUOY___LOI CHOI ĐI MUÔN NƠI": "Thematic & Brand Building",
  "BIA HÀ NỘI___HANOI PREMIUM CAMPAIGN (RA MẮT LON DÀI MỚI)": "Product Launch & Rebranding",
  "KEPPEL LAND___HANOI CENTRE": "Thematic & Brand Building",
  "OPPO___OPPO X9 ULTRA & FIND X9S_OPPO X9 ULTRA & FIND X9S": "Product Launch & Rebranding",
  "NUTREN JUNIOR___NGÀY HỘI THÔI NÔI": "Sponsor & Event",
  "DUTCH LADY___DUTCH LADY OMEGASMART": "Product Launch & Rebranding",
  "OMACHI___OMACHI LẨU TAM HOA": "Product Launch & Rebranding",
  "COLOSBABY___COLOSBABY GOLD PEDIA \"CÓ GỐC ĐỀ KHÁNG KHỎE - CỨ THỂ MÀ LỚN THỜI\"": "Thematic & Brand Building",
  "HIKID___KOREA TRUST JOURNEY 2026": "Thematic & Brand Building",
};

export function classifyCampaignType(campaignName: string, brandName: string): CampaignType {
  const name = (campaignName || '').trim().toUpperCase();
  const brand = (brandName || '').trim().toUpperCase();

  // 0. Check Verified Excel Lookup Map (100% Accuracy on Update type campaign.xlsx)
  const exactKey1 = `${brand}___${name}`;
  const exactKey2 = name;
  if (VERIFIED_EXCEL_TYPE_MAP[exactKey1]) return VERIFIED_EXCEL_TYPE_MAP[exactKey1];
  if (VERIFIED_EXCEL_TYPE_MAP[exactKey2]) return VERIFIED_EXCEL_TYPE_MAP[exactKey2];

  // Learned Rule Engine for newly uploaded/imported campaigns:

  // 1. TW ĐOÀN TNCS HỒ CHÍ MINH -> Sponsor & Event
  if (
    brand.includes('TW ĐOÀN') || brand.includes('ĐOÀN TNCS') || brand.includes('TNCS HỒ CHÍ MINH') ||
    name.includes('TW ĐOÀN') || name.includes('ĐOÀN TNCS')
  ) {
    return 'Sponsor & Event';
  }

  // 2. CSR & Sustainability (Health / Medical / Environmental / Cancer Prevention / Forest)
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

  // 3. Sponsor & Event (Music, Sports, World Tour, Concert, Rave, F1, Festival, Shows, Games)
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
