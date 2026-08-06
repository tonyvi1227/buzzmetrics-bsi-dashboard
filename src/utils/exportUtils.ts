import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { CampaignRecord } from '../types/dashboard';

export function exportToExcel(data: CampaignRecord[], fileName = 'Buzzmetrics_Campaign_Report.xlsx') {
  if (!data || data.length === 0) return;

  const exportRows = data.map((d, idx) => ({
    'STT': idx + 1,
    'Năm': d.year,
    'Tháng': d.month,
    'Thời Gian': `${d.month} ${d.year}`,
    'Thương Hiệu': d.brand,
    'Ngành Hàng': d.category,
    'Tên Chiến Dịch': d.campaign,
    'BSI Score': d.bsi,
    'Buzz Volume': d.buzzVolume,
    'Content QU': d.contentQU,
    'QU User': d.quUser,
    'Sentiment Index': d.sentiment,
    'Relevancy Score': d.relevancy,
    '% Earned': d.earnedPct,
    'Earned Volume': d.earned,
    'Paid Volume': d.paid,
    'Owned Volume': d.owned,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Insights');

  XLSX.writeFile(workbook, fileName);
}

export function exportToCSV(data: CampaignRecord[], fileName = 'Buzzmetrics_Campaign_Report.csv') {
  if (!data || data.length === 0) return;

  const exportRows = data.map((d, idx) => ({
    'STT': idx + 1,
    'Year': d.year,
    'Month': d.month,
    'Time': `${d.month} ${d.year}`,
    'Brand': d.brand,
    'Category': d.category,
    'Campaign': d.campaign,
    'BSI': d.bsi,
    'Buzz Volume': d.buzzVolume,
    'Content QU': d.contentQU,
    'QU User': d.quUser,
    'Sentiment': d.sentiment,
    'Relevancy': d.relevancy,
    '% Earned': d.earnedPct,
    'Earned': d.earned,
    'Paid': d.paid,
    'Owned': d.owned,
  }));

  const csv = Papa.unparse(exportRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
