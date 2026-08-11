import React, { useState, useMemo } from 'react';
import { Table, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Tag } from 'lucide-react';
import { CampaignRecord, SortColumn, SortOrder } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface CampaignTableProps {
  data: CampaignRecord[];
  onSelectCampaign: (campaign: CampaignRecord) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ data, onSelectCampaign }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('buzzVolume');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortOrder('desc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let valA: any = a[sortColumn as keyof CampaignRecord];
      let valB: any = b[sortColumn as keyof CampaignRecord];

      if (sortColumn === 'time') {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const numA = parseInt(a.year) * 100 + monthOrder.indexOf(a.month);
        const numB = parseInt(b.year) * 100 + monthOrder.indexOf(b.month);
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const renderTypeBadge = (type?: string) => {
    switch (type) {
      case 'Product Launch & Rebranding':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            🚀 Launch
          </span>
        );
      case 'Sponsor & Event':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-black bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            🎭 Sponsor & Event
          </span>
        );
      case 'Promotion':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            🎁 Promotion
          </span>
        );
      case 'CSR & Sustainability':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            🌿 CSR
          </span>
        );
      default:
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            💎 Thematic
          </span>
        );
    }
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-buzz" /> Bảng Chi Tiết Chiến Dịch & Chỉ Số Phân Tích
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            Bấm vào bất kỳ dòng nào để xem phân tích chi tiết & so sánh Benchmark với trung bình ngành.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Trang {currentPage} / {totalPages} (Tổng {sortedData.length} chiến dịch)
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] font-black border-b border-slate-200 dark:border-slate-700">
              <th className="p-3 text-center">STT</th>
              <th
                onClick={() => handleSort('time')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>📅 THỜI GIAN</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('brand')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>THƯƠNG HIỆU</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>NGÀNH HÀNG</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('campaign')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>TÊN CHIẾN DỊCH</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('campaignType')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>LOẠI CAMPAIGN</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('buzzVolume')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>BUZZ VOL</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('bsi')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>BSI SCORE</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('contentQU')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>CONTENT QU</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('quUser')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>QU USER</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('sentiment')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SENTIMENT</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th className="p-3 text-center">CHI TIẾT</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
            {paginatedData.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => onSelectCampaign(row)}
                className="hover:bg-orange-50/60 dark:hover:bg-orange-950/30 transition cursor-pointer group"
              >
                <td className="p-3 text-center text-slate-400 text-[11px]">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px] border border-slate-200 dark:border-slate-700">
                    {row.month} {row.year}
                  </span>
                </td>
                <td className="p-3 font-black text-slate-900 dark:text-white uppercase whitespace-nowrap">
                  {row.brand}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-buzz dark:text-orange-300 border border-orange-200 dark:border-orange-900 text-[10px] font-black">
                    {row.category}
                  </span>
                </td>
                <td className="p-3 text-slate-800 dark:text-slate-200 font-extrabold max-w-xs truncate">
                  {row.campaign}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {renderTypeBadge(row.campaignType)}
                </td>
                <td className="p-3 text-right font-black text-buzz">
                  {formatNum(row.buzzVolume)}
                </td>
                <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                  {formatNum(row.bsi)}
                </td>
                <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                  {formatNum(row.contentQU)}
                </td>
                <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                  {formatNum(row.quUser)}
                </td>
                <td className="p-3 text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    row.sentiment >= 0.9
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {row.sentiment.toFixed(2)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button className="p-1 text-slate-400 group-hover:text-buzz transition rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
        <span className="text-slate-500">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} – {Math.min(currentPage * itemsPerPage, sortedData.length)} trong số {sortedData.length} chiến dịch
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
