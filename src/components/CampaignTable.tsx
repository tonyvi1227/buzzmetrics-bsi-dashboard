import React, { useState, useMemo } from 'react';
import { Table, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Download, ExternalLink, Crown, Medal, Award } from 'lucide-react';
import { CampaignRecord, SortColumn, SortOrder } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';
import { InfoTooltip } from './common/InfoTooltip';

interface CampaignTableProps {
  data: CampaignRecord[];
  onSelectCampaign: (campaign: CampaignRecord) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ data, onSelectCampaign }) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('bsi');
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-sm border border-amber-200" title="Rank #1 Gold">
          <Crown className="w-3 h-3 fill-current text-slate-950" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-bold text-xs inline-flex items-center justify-center shadow border border-slate-300" title="Rank #2 Silver">
          <Medal className="w-3 h-3 text-slate-900" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-bold text-xs inline-flex items-center justify-center shadow border border-amber-600" title="Rank #3 Bronze">
          <Award className="w-3 h-3 text-white" />
        </span>
      );
    }
    return (
      <span className="text-slate-400 text-[11px] font-extrabold">{rank}</span>
    );
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
            <Table className="w-4 h-4 text-buzz" /> CAMPAIGN PERFORMANCE DETAIL TABLE
            <InfoTooltip
              title="Campaign Detail Performance Table"
              content="Comprehensive database of all tracked campaigns with granular metrics for Buzz, BSI, Sentiment, Relevance, and Media split. Click any row for deep-dive benchmark analysis."
            />
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
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>RELEVANCY</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
              <th
                onClick={() => handleSort('earnedPct')}
                className="p-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>EARNED MEDIA %</span>
                  <ArrowUpDown className="w-3 h-3 text-buzz" />
                </div>
              </th>
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
                  <td className="p-3 text-center text-slate-400 text-[11px] font-extrabold">{getRankBadge(globalIndex)}</td>
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
                  <td className="p-3 text-right whitespace-nowrap">
                    <span className={item.sentiment >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                      {item.sentiment.toFixed(2)}
                    </span>
                  </td>
                  
                  {/* Relevancy (Clean Numerical Value) */}
                  <td className="p-3 text-right text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
                    {item.relevancy.toFixed(2)}
                  </td>

                  {/* Earned Media % (Clean Numerical Value) */}
                  <td className="p-3 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                    {item.earnedPct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} - {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-xs font-black text-slate-800 dark:text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
