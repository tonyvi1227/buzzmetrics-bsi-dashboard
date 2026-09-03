import React, { useState, useMemo } from 'react';
import { Award, ArrowUpDown, Download, Users, Target, ExternalLink, Calendar, Flame, ChevronLeft, ChevronRight, Crown, Medal } from 'lucide-react';
import { AggregatedCelebRecord, CelebSortColumn, SortDirection } from '../../types/celeb';
import { InfoTooltip } from '../common/InfoTooltip';
import { formatNum } from '../../utils/brandStandardizer';
import { useTranslation } from '../../context/LanguageContext';

interface CelebTableProps {
  data: AggregatedCelebRecord[];
  onSelectCeleb: (celeb: AggregatedCelebRecord) => void;
  onExport: () => void;
}

export const CelebTable: React.FC<CelebTableProps> = ({
  data,
  onSelectCeleb,
  onExport,
}) => {
  const { lang, t } = useTranslation();
  const [sortColumn, setSortColumn] = useState<CelebSortColumn>('totalAppearances');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination states
  const [pageSize, setPageSize] = useState<number>(10); // Default 10 per page
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (column: CelebSortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      if (column === 'avgRank') {
        setSortDirection('asc');
      } else {
        setSortDirection('desc');
      }
    }
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal: any = a[sortColumn as keyof AggregatedCelebRecord];
      let bVal: any = b[sortColumn as keyof AggregatedCelebRecord];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortColumn, sortDirection]);

  // Total pages calculation
  const totalItems = sortedData.length;
  const isAll = pageSize === -1;
  const totalPages = isAll ? 1 : Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);

  // Paginated slice
  const paginatedData = useMemo(() => {
    if (isAll) return sortedData;
    const startIndex = (activePage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, activePage, pageSize, isAll]);

  const startRecordNum = isAll ? 1 : (activePage - 1) * pageSize + 1;
  const endRecordNum = isAll ? totalItems : Math.min(activePage * pageSize, totalItems);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md border border-amber-200" title="Rank #1 Gold">
          <Crown className="w-3.5 h-3.5 fill-current text-slate-950" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center shadow border border-slate-300" title="Rank #2 Silver">
          <Medal className="w-3.5 h-3.5 text-slate-900" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow border border-amber-600" title="Rank #3 Bronze">
          <Award className="w-3.5 h-3.5 text-white" />
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
        {rank}
      </span>
    );
  };

  return (
    <div className="glass-card rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header Bar */}
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-buzz" />
            {t.celebTable.title}
            <InfoTooltip
              title={t.celebTable.tooltipTitle}
              content={t.celebTable.tooltipContent}
            />
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {t.celebTable.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Page size limit selector */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>{lang === 'vi' ? 'Hiển thị:' : 'Show:'}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-lg text-xs py-1 px-2 outline-none focus:ring-2 focus:ring-buzz"
            >
              <option value={10}>10 {lang === 'vi' ? 'dòng' : 'rows'}</option>
              <option value={20}>20 {lang === 'vi' ? 'dòng' : 'rows'}</option>
              <option value={50}>50 {lang === 'vi' ? 'dòng' : 'rows'}</option>
              <option value={-1}>{lang === 'vi' ? `Tất cả (${totalItems})` : `All (${totalItems})`}</option>
            </select>
          </div>

          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-buzz hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t.celebTable.exportCsv}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-[11px] font-black border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <th className="py-3.5 px-3 w-12 text-center">#</th>
              
              <th
                onClick={() => handleSort('celebName')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t.celebTable.colName}
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('category')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  {t.celebTable.colCategory}
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              {/* Total Appearances Column */}
              <th
                onClick={() => handleSort('totalAppearances')}
                className="py-3.5 px-3 text-center cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors bg-orange-50/60 dark:bg-orange-950/30 text-buzz dark:text-orange-300 whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-buzz" />
                  {t.celebTable.colAppearances}
                  <InfoTooltip
                    title={t.celebTable.colAppearances}
                    content={lang === 'vi' ? 'Tổng số tháng Influencer lọt vào BSI Top 10 trong kỳ lọc.' : 'Total months this influencer entered the BSI Top 10 ranking during the filtered period.'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* Average BSI top10 rank Column */}
              <th
                onClick={() => handleSort('avgRank')}
                className="py-3.5 px-4 text-center cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {t.celebTable.colAvgRank}
                  <InfoTooltip
                    title={t.celebTable.colAvgRank}
                    content={lang === 'vi' ? 'Thứ hạng TB = Tổng thứ hạng các lần lọt Top 10 / Số lần xuất hiện.' : 'Average rank = Sum of ranks across Top 10 appearances / Count of appearances.'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* AVG BSI */}
              <th
                onClick={() => handleSort('avgBsi')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 text-buzz">
                  {t.celebTable.colAvgBsi}
                  <InfoTooltip
                    title={t.celebTable.colAvgBsi}
                    content={lang === 'vi' ? 'Điểm BSI trung bình qua các lần lọt Top 10.' : 'Average BSI score achieved across Top 10 appearances.'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* AVG Buzz Volume */}
              <th
                onClick={() => handleSort('avgBuzz')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  {t.celebTable.colAvgBuzz}
                  <InfoTooltip
                    title={t.celebTable.colAvgBuzz}
                    content={lang === 'vi' ? 'Tổng thảo luận, chia sẻ và tương tác trung bình.' : 'Average posts, comments, and shares related to the celebrity.'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              {/* Qualified User (QU) */}
              <th
                onClick={() => handleSort('avgQuUser')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 text-buzz-darkblue">
                  <Users className="w-3.5 h-3.5" />
                  {t.celebTable.colAvgQu}
                  <InfoTooltip
                    title={t.celebTable.colAvgQu}
                    content={lang === 'vi' ? 'Người dùng chất lượng thực tế tương tác trung bình.' : 'Average genuine unique users engaging in discussions.'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* AVG Sentiment */}
              <th
                onClick={() => handleSort('avgSentiment')}
                className="py-3.5 px-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  {t.celebTable.colAvgSentiment}
                  <InfoTooltip
                    title={t.celebTable.colAvgSentiment}
                    content={lang === 'vi' ? 'Chỉ số cảm xúc trung bình.' : 'Average audience sentiment index (from 0 to 1).'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              {/* AVG Relevance */}
              <th
                onClick={() => handleSort('avgRelevancy')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 text-indigo-600 dark:text-indigo-400">
                  <Target className="w-3.5 h-3.5" />
                  {t.celebTable.colAvgRelevancy}
                  <InfoTooltip
                    title={t.celebTable.colAvgRelevancy}
                    content={lang === 'vi' ? 'Độ gắn kết và liên quan trực tiếp đến Influencer.' : 'Percentage of discussions directly focused on the influencer.'}
                  />
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedData.map((item, index) => {
              const globalIndex = isAll ? index + 1 : (activePage - 1) * pageSize + index + 1;
              return (
                <tr
                  key={item.celebName}
                  onClick={() => onSelectCeleb(item)}
                  className="hover:bg-orange-50/50 dark:hover:bg-orange-950/20 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 text-center">
                    <div className="flex justify-center">{getRankBadge(globalIndex)}</div>
                  </td>

                  <td className="py-3 px-4 font-black text-slate-900 dark:text-white group-hover:text-buzz transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm whitespace-nowrap">{item.celebName}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-buzz transition-opacity flex-shrink-0" />
                    </div>
                  </td>

                  {/* Profession Column */}
                  <td className="py-3 px-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap inline-block font-extrabold">
                      {t.celebCategories[item.category] || item.category}
                    </span>
                  </td>

                  {/* Total Appearances Column */}
                  <td className="py-3 px-3 text-center font-black text-buzz">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-buzz border border-orange-200 dark:border-orange-900 font-black whitespace-nowrap">
                      {item.totalAppearances} {lang === 'vi' ? 'Tháng' : 'Months'}
                    </span>
                  </td>

                  {/* AVG Top 10 Rank Column */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center justify-center px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900">
                      <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                        {lang === 'vi' ? 'Hạng TB' : 'Avg Rank'}: #{item.avgRank}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        ({lang === 'vi' ? 'Cao nhất' : 'Best'}: #{item.bestRank})
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-black text-buzz text-sm whitespace-nowrap">
                    {formatNum(item.avgBsi)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {formatNum(item.avgBuzz)}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-buzz-darkblue whitespace-nowrap">
                    {formatNum(item.avgQuUser)}
                  </td>

                  <td className="py-3 px-3 text-right font-bold whitespace-nowrap">
                    <span className={item.avgSentiment >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      {item.avgSentiment.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                    {(item.avgRelevancy * 100).toFixed(1)}%
                  </td>
                </tr>
              );
            })}

            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 font-bold">
                  {lang === 'vi' ? 'Không tìm thấy Influencers nào phù hợp với bộ lọc.' : 'No influencers found matching the selected filter criteria.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {!isAll && totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
          <div>
            {lang === 'vi' ? (
              <>Hiển thị <strong className="text-slate-900 dark:text-white">{startRecordNum}</strong> - <strong className="text-slate-900 dark:text-white">{endRecordNum}</strong> trong tổng số <strong className="text-buzz">{totalItems}</strong> Influencers</>
            ) : (
              <>Showing <strong className="text-slate-900 dark:text-white">{startRecordNum}</strong> - <strong className="text-slate-900 dark:text-white">{endRecordNum}</strong> of <strong className="text-buzz">{totalItems}</strong> influencers</>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg border text-xs font-black transition cursor-pointer ${
                  page === activePage
                    ? 'bg-buzz text-white border-buzz shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
