import React, { useState, useMemo } from 'react';
import { Table, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
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

  const handleExportCSV = () => {
    const headers = ['Date', 'Brand', 'Category', 'Campaign Name', 'Type', 'Buzz Volume', 'BSI Score', 'Content QU', 'QU User', 'Sentiment', 'Relevancy', 'Earned Media %'];
    const rows = sortedData.map(d => [
      `"${d.month} ${d.year}"`,
      `"${d.brand}"`,
      `"${d.category}"`,
      `"${d.campaign}"`,
      `"${d.campaignType || 'Thematic'}"`,
      d.buzzVolume,
      d.bsi,
      d.contentQU,
      d.quUser,
      d.sentiment,
      d.relevancy,
      d.earnedPct,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'buzzmetrics-campaign-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTypeBadge = (type?: string) => {
    switch (type) {
      case 'Product Launch & Rebranding':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Launch
          </span>
        );
      case 'Sponsor & Event':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            Sponsor
          </span>
        );
      case 'Promotion':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Promotion
          </span>
        );
      case 'CSR & Sustainability':
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            CSR
          </span>
        );
      default:
        return (
          <span className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Thematic
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-buzz" /> CAMPAIGN ANALYTICS DATA TABLE
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            Click any row to open campaign deep-dive analysis & benchmark spider radar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages} ({sortedData.length} entries)
          </span>

          {/* Export Table CSV Button */}
          <button
            onClick={handleExportCSV}
            className="whitespace-nowrap px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title="Export Table Data to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
              <th className="p-3 text-center">#</th>
              <th
                onClick={() => handleSort('time')}
                className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>DATE</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('brand')}
                className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>BRAND</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>CATEGORY</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('campaign')}
                className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>CAMPAIGN NAME</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('campaignType')}
                className="p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>TYPE</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('buzzVolume')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>BUZZ VOL</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('bsi')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>BSI SCORE</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('contentQU')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>CONTENT QU</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('quUser')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>QU USER</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('sentiment')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SENTIMENT</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('relevancy')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition min-w-[120px]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>RELEVANCY</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('earnedPct')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition min-w-[130px]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>EARNED MEDIA %</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th className="p-3 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
            {paginatedData.map((item, idx) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
              return (
                <tr
                  key={`${item.year}_${item.month}_${item.brand}_${item.campaign}`}
                  onClick={() => onSelectCampaign(item)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <td className="p-3 text-center text-slate-400 text-[11px] font-extrabold">{globalIndex}</td>
                  <td className="p-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {item.month} {item.year}
                  </td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white group-hover:text-buzz transition">
                    {item.brand}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.category}</td>
                  <td className="p-3 max-w-[220px] truncate text-slate-800 dark:text-slate-200" title={item.campaign}>
                    {item.campaign}
                  </td>
                  <td className="p-3 whitespace-nowrap">{renderTypeBadge(item.campaignType)}</td>
                  <td className="p-3 text-right font-black text-buzz">{formatNum(item.buzzVolume)}</td>
                  <td className="p-3 text-right font-black text-slate-900 dark:text-white">{formatNum(item.bsi)}</td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">{formatNum(item.contentQU)}</td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">{formatNum(item.quUser)}</td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">{item.sentiment.toFixed(2)}</td>
                  
                  {/* Relevancy with Refined Progress Bar */}
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{item.relevancy.toFixed(2)}</span>
                      <div className="w-10 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (item.relevancy / 2) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Earned Media % with Refined Progress Bar */}
                  <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{item.earnedPct.toFixed(1)}%</span>
                      <div className="w-12 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, item.earnedPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCampaign(item);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-500 transition cursor-pointer"
                      title="View campaign details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} - {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-xs font-black text-slate-800 dark:text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
