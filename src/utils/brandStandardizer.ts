/**
 * Standardize raw brand names into canonical brand names (UPPERCASE)
 */
export function standardizeBrand(rawBrand: string): string {
  let b = (rawBrand || '').toUpperCase().trim();
  if (!b) return 'OTHER';
  
  if (b.includes('SAMSUNG') || b.includes('GALAXY')) return 'SAMSUNG';
  if (b.includes('KOTEX')) return 'KOTEX';
  if (b.includes('OPPO')) return 'OPPO';
  if (b.includes('TIGER')) return 'TIGER';
  if (b.includes('HEINEKEN')) return 'HEINEKEN';
  if (b.includes('LARUE')) return 'LARUE';
  if (b.includes('STING')) return 'STING';
  if (b.includes('MILO')) return 'MILO';
  if (b.includes('VINAMILK') || b.includes('DIELAC') || b.includes('OPTIMUM')) return 'VINAMILK';
  if (b.includes('TỰ HÀO VIỆT NAM') || b.includes('TU HAO VIET NAM')) return 'TW ĐOÀN TNCS HỒ CHÍ MINH';
  if (b.includes('FANDOM YÊU NƯỚC') || b.includes('FANDOM YEU NUOC')) return 'KENH14.VN';
  if (b.includes('TW ĐOÀN') || b.includes('ĐOÀN TNCS')) return 'TW ĐOÀN TNCS HỒ CHÍ MINH';
  if (b.includes('KENH14') || b.includes('KÊNH 14')) return 'KENH14.VN';
  if (b.includes('LONG CHÂU') || b.includes('LONG CHAU')) return 'LONG CHÂU';
  if (b.includes('RED BULL') || b.includes('REDBULL')) return 'RED BULL';
  if (b.includes('1664')) return '1664 BLANC';
  if (b.includes('BUDWEISER')) return 'BUDWEISER';
  if (b.includes('TUBORG')) return 'TUBORG';
  if (b.includes('SAIGON') || b.includes('SÀI GÒN') || b.includes('333')) return 'BIA SAIGON';
  if (b.includes('BIA HÀ NỘI') || b.includes('BIA HA NOI') || b.includes('HANOI')) return 'BIA HÀ NỘI';
  if (b.includes('BIA VIỆT') || b.includes('BIA VIET')) return 'BIA VIỆT';
  if (b.includes('PEPSI')) return 'PEPSI';
  if (b.includes('OMO')) return 'OMO';
  if (b.includes('LIFEBUOY')) return 'LIFEBUOY';
  if (b.includes('MANULIFE')) return 'MANULIFE';
  if (b.includes('JOLLIBEE')) return 'JOLLIBEE';
  if (b.includes('WARRIOR')) return 'WARRIOR';
  if (b.includes('LAVIE')) return 'LAVIE';
  if (b.includes('COLOSBABY')) return 'COLOSBABY';
  if (b.includes('VIVO')) return 'VIVO';
  if (b.includes('COCA') || b.includes('COKE')) return 'COCA-COLA';
  if (b.includes('SUNSILK')) return 'SUNSILK';
  if (b.includes('LAY\'S') || b.includes('LAYS')) return 'LAY\'S';
  if (b.includes('UNILEVER')) return 'UNILEVER';
  if (b.includes('PEDIASURE')) return 'PEDIASURE';
  if (b.includes('P/S') || b.includes('P.S')) return 'P/S';
  if (b.includes('CLOSEUP')) return 'CLOSEUP';
  if (b.includes('KNORR')) return 'KNORR';
  if (b.includes('SURF')) return 'SURF';
  if (b.includes('SIUKAY')) return 'SIUKAY';
  if (b.includes('OMACHI')) return 'OMACHI';
  if (b.includes('7UP')) return '7UP';
  if (b.includes('MICHELOB')) return 'MICHELOB ULTRA';
  if (b.includes('KEPPEL')) return 'KEPPEL LAND';
  if (b.includes('NUTREN')) return 'NUTREN JUNIOR';
  if (b.includes('DUTCH LADY')) return 'DUTCH LADY';
  if (b.includes('FPT PLAY')) return 'FPT PLAY';
  if (b.includes('HIKID')) return 'HIKID';
  if (b.includes('SIMPLY')) return 'SIMPLY';
  if (b.includes('HONOR')) return 'HONOR';
  if (b.includes('ROCKSTAR')) return 'ROCKSTAR';
  if (b.includes('BITIS')) return 'BITIS HUNTER';
  if (b.includes('HAZELINE')) return 'HAZELINE';
  if (b.includes('BIVINA')) return 'BIVINA';
  if (b.includes('STRONGBOW')) return 'STRONGBOW';
  if (b.includes('SUNLIGHT')) return 'SUNLIGHT';
  if (b.includes('ĐIỆN MÁY XANH')) return 'ĐIỆN MÁY XANH';
  if (b.includes('TV360')) return 'TV360';
  if (b.includes('CHANTÉ') || b.includes('CHANTE')) return 'CHANTÉ';
  if (b.includes('VINFAST')) return 'VINFAST';
  if (b.includes('SIMPLE')) return 'SIMPLE';
  if (b.includes('SOMERSBY')) return 'SOMERSBY';
  if (b.includes('L\'ORÉAL') || b.includes('LOREAL')) return 'L\'ORÉAL PARIS';
  if (b.includes('KFC')) return 'KFC';
  if (b.includes('MIRINDA')) return 'MIRINDA';
  if (b.includes('KUN')) return 'KUN';
  if (b.includes('VPBANK')) return 'VPBANK';
  if (b.includes('TEA+')) return 'TEA+';
  if (b.includes('BYD')) return 'BYD';
  if (b.includes('MALTO')) return 'MALTO';
  if (b.includes('PANASONIC')) return 'PANASONIC';
  if (b.includes('MSB')) return 'MSB';
  if (b.includes('LIÊN QUÂN') || b.includes('GARENA')) return 'GARENA LIÊN QUÂN';
  if (b.includes('BATDONGSAN')) return 'BATDONGSAN.COM.VN';
  if (b.includes('VICHY')) return 'VICHY';
  if (b.includes('GSK')) return 'GSK';
  if (b.includes('CHIN-SU') || b.includes('CHINSU')) return 'CHIN-SU';
  if (b.includes('TIKTOK')) return 'TIKTOK SHOP';
  if (b.includes('DANISA')) return 'DANISA';
  if (b.includes('ZALOPAY')) return 'ZALOPAY';
  if (b.includes('COMFORT')) return 'COMFORT';
  if (b.includes('VIB')) return 'VIB';
  if (b.includes('GARNIER')) return 'GARNIER';
  if (b.includes('ACB')) return 'ACB';
  if (b.includes('BONCHA')) return 'BONCHA';
  if (b.includes('POND\'S') || b.includes('PONDS')) return 'POND\'S';
  if (b.includes('HAPAS')) return 'HAPAS';
  if (b.includes('SAIGON CO.OP') || b.includes('CO.OP')) return 'SAIGON CO.OP';
  if (b.includes('DAI-ICHI') || b.includes('DAI ICHI')) return 'DAI-ICHI LIFE';
  if (b.includes('PRUDENTIAL')) return 'PRUDENTIAL';
  if (b.includes('VINGROUP')) return 'VINGROUP';
  if (b.includes('NUTIFOOD')) return 'NUTIFOOD';
  
  return b;
}

export function formatNum(num: number | null | undefined, decimals = 0): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
