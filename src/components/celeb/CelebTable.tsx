import React, { useState, useMemo } from 'react';
import { Award, ArrowUpDown, Download, Users, Target, ExternalLink, Calendar, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { AggregatedCelebRecord, CelebSortColumn, SortDirection } from '../../types/celeb';
import { InfoTooltip } from '../common/InfoTooltip';

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

  const formatNum = (val: number) => Math.round(val).toLocaleString('vi-VN');

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">1</span>;
    }
    if (rank === 2) {
      return <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center shadow">2</span>;
    }
    if (rank === 3) {
      return <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shadow">3</span>;
    }
    return <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">{rank}</span>;
  };

  return (
    <div className="glass-card rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header Bar */}
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-buzz" />
            BẢNG XẾP HẠNG TỔNG HỢP CELEBRITIES (BSI TOP 10 RANKING)
            <InfoTooltip
              title="Bảng Xếp Hạng Celeb"
              content="Bảng dữ liệu gom nhóm theo từng nghệ sĩ độc lập. Click vào dòng của nghệ sĩ để xem chi tiết lịch sử điểm BSI và thứ hạng qua từng tháng."
            />
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Danh sách nghệ sĩ với chỉ số BSI trung bình, thứ hạng trung bình & số lần lọt Top (Click vào nghệ sĩ để xem chi tiết)
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Page size limit selector */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-lg text-xs py-1 px-2 outline-none focus:ring-2 focus:ring-buzz"
            >
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
              <option value={50}>50 dòng</option>
              <option value={-1}>Tất cả ({totalItems})</option>
            </select>
          </div>

          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-buzz hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất Data
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-[11px] font-black border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <th className="py-3.5 px-3 w-12 text-center">STT</th>
              
              <th
                onClick={() => handleSort('celebName')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Nghệ sĩ / KOL
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('category')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  Lĩnh vực
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              {/* Cột Số lần lọt Top 10 BSI */}
              <th
                onClick={() => handleSort('totalAppearances')}
                className="py-3.5 px-3 text-center cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors bg-orange-50/60 dark:bg-orange-950/30 text-buzz dark:text-orange-300 whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-buzz" />
                  Số lần lọt Top
                  <InfoTooltip
                    title="Số lần lọt Top 10 BSI"
                    content="Tổng số tháng nghệ sĩ lọt vào bảng xếp hạng BSI Top 10 trong khoảng thời gian lọc."
                  />
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* Cột Average BSI top10 rank */}
              <th
                onClick={() => handleSort('avgRank')}
                className="py-3.5 px-4 text-center cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  AVG Top10 Rank
                  <InfoTooltip
                    title="Average BSI Top10 Rank"
                    content="Rank TB = Tổng xếp hạng trong các tháng lọt Top / Số tháng lọt Top. (Kèm thứ hạng đỉnh cao tốt nhất đạt được)."
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
                  AVG BSI Score
                  <InfoTooltip
                    title="Điểm BSI Trung Bình"
                    content="BSIScore trung bình khi nghệ sĩ lọt vào Top 10 BSI."
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
                  AVG Buzz
                  <InfoTooltip
                    title="Thảo luận Trung Bình"
                    content="Lượng bài viết, bình luận, chia sẻ trung bình của nghệ sĩ."
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
                  Qualified User (QU)
                  <InfoTooltip
                    title="Qualified User (QU)"
                    content="Lượng khán giả độc lập thảo luận chất lượng trung bình."
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
                  AVG Sentiment
                  <InfoTooltip
                    title="Chỉ số cảm xúc trung bình"
                    content="Sentiment index trung bình của nghệ sĩ (từ 0 đến 1)."
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
                  AVG Relevance
                  <InfoTooltip
                    title="Trung bình thảo luận liên quan"
                    content="Tỷ lệ % thảo luận nhắc đến nghệ sĩ đúng chủ đề liên quan."
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

                  {/* Cột Lĩnh Vực - Clean Badge with whitespace-nowrap */}
                  <td className="py-3 px-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap inline-block font-extrabold">
                      {item.category}
                    </span>
                  </td>

                  {/* Cột Số lần lọt Top 10 BSI */}
                  <td className="py-3 px-3 text-center font-black text-buzz">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-buzz border border-orange-200 dark:border-orange-900 font-black whitespace-nowrap">
                      {item.totalAppearances} tháng
                    </span>
                  </td>

                  {/* Cột AVG Top10 Rank */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center justify-center px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900">
                      <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                        Rank TB: #{item.avgRank}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        (Cao nhất: #{item.bestRank})
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
                    <span className={item.avgSentiment >= 0.9 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
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
                  Không tìm thấy nghệ sĩ nào phù hợp với bộ lọc.
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
            Hiển thị <strong className="text-slate-900 dark:text-white">{startRecordNum}</strong> - <strong className="text-slate-900 dark:text-white">{endRecordNum}</strong> trong tổng số <strong className="text-buzz">{totalItems}</strong> nghệ sĩ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg border text-xs font-black transition ${
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
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
