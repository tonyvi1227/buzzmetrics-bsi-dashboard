import React, { useState, useMemo } from 'react';
import { ListFilter, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react';
import { CampaignRecord, SortColumn, SortDirection } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface CampaignTableProps {
  data: CampaignRecord[];
  onSelectCampaign: (campaign: CampaignRecord) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ data, onSelectCampaign }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortCol, setSortCol] = useState<SortColumn>('bsi');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const sortedData = useMemo(() => {
    const copy = [...data];
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    copy.sort((a, b) => {
      if (sortCol === 'time') {
        const timeA = `${a.year}-${String(monthOrder.indexOf(a.month)).padStart(2, '0')}`;
        const timeB = `${b.year}-${String(monthOrder.indexOf(b.month)).padStart(2, '0')}`;
        return sortDir === 'asc' ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA);
      }

      const valA = a[sortCol];
      const valB = b[sortCol];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      const numA = (valA as number) || 0;
      const numB = (valB as number) || 0;
      return sortDir === 'asc' ? numA - numB : numB - numA;
    });

    return copy;
  }, [data, sortCol, sortDir]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, sortedData.length);
  const pageData = sortedData.slice(startIdx, endIdx);

  const getSortIcon = (col: SortColumn) => {
    if (sortCol !== col) return null;
    return <span className="ml-1 text-buzz font-black">{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
      {/* Table Header Controls */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-buzz flex-shrink-0" />
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Danh Sách Chi Tiết Các Chiến Dịch
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-buzz bg-buzz-light dark:bg-orange-950/60 px-3 py-1.5 rounded-full border border-buzz-border dark:border-orange-800 font-black whitespace-nowrap">
            Hiển thị {sortedData.length} chiến dịch
          </span>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value={10}>10 dòng / trang</option>
            <option value={20}>20 dòng / trang</option>
            <option value={50}>50 dòng / trang</option>
          </select>
        </div>
      </div>

      {/* Table Body Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-900 dark:text-slate-100">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 font-black cursor-pointer select-none">
            <tr>
              <th className="p-3.5 text-center w-10 whitespace-nowrap">STT</th>
              
              {/* THỜI GIAN COLUMN HEADER */}
              <th onClick={() => handleSort('time')} className="p-3.5 hover:text-buzz transition whitespace-nowrap min-w-[110px]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-buzz flex-shrink-0" />
                  <span>Thời gian</span>
                  {getSortIcon('time')}
                </div>
              </th>

              <th onClick={() => handleSort('brand')} className="p-3.5 hover:text-buzz transition whitespace-nowrap min-w-[120px]">
                Thương hiệu {getSortIcon('brand')}
              </th>

              <th onClick={() => handleSort('category')} className="p-3.5 hover:text-buzz transition whitespace-nowrap min-w-[160px]">
                Ngành hàng {getSortIcon('category')}
              </th>

              <th onClick={() => handleSort('campaign')} className="p-3.5 hover:text-buzz transition whitespace-nowrap min-w-[200px]">
                Tên Chiến dịch {getSortIcon('campaign')}
              </th>

              <th onClick={() => handleSort('buzzVolume')} className="p-3.5 text-right hover:text-buzz transition whitespace-nowrap min-w-[110px]">
                Buzz Volume {getSortIcon('buzzVolume')}
              </th>

              <th onClick={() => handleSort('contentQU')} className="p-3.5 text-right hover:text-buzz transition whitespace-nowrap min-w-[100px]">
                Content QU {getSortIcon('contentQU')}
              </th>

              <th onClick={() => handleSort('quUser')} className="p-3.5 text-right hover:text-buzz transition whitespace-nowrap min-w-[90px]">
                QU User {getSortIcon('quUser')}
              </th>

              <th onClick={() => handleSort('bsi')} className="p-3.5 text-right hover:text-buzz text-buzz transition whitespace-nowrap min-w-[100px]">
                BSI Score {getSortIcon('bsi')}
              </th>

              <th onClick={() => handleSort('sentiment')} className="p-3.5 text-right hover:text-buzz transition whitespace-nowrap min-w-[90px]">
                Sentiment {getSortIcon('sentiment')}
              </th>

              <th onClick={() => handleSort('relevancy')} className="p-3.5 text-right hover:text-buzz transition whitespace-nowrap min-w-[90px]">
                Relevancy {getSortIcon('relevancy')}
              </th>

              <th onClick={() => handleSort('earnedPct')} className="p-3.5 text-right hover:text-buzz transition whitespace-nowrap min-w-[90px]">
                % Earned {getSortIcon('earnedPct')}
              </th>

              <th className="p-3.5 text-center w-12 whitespace-nowrap">Xem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={13} className="p-8 text-center text-slate-400 font-normal">
                  Không tìm thấy chiến dịch nào thỏa mãn bộ lọc.
                </td>
              </tr>
            ) : (
              pageData.map((d, idx) => {
                const stt = startIdx + idx + 1;
                return (
                  <tr
                    key={d.id}
                    className="hover:bg-orange-50/50 dark:hover:bg-slate-800/60 transition cursor-pointer"
                    onClick={() => onSelectCampaign(d)}
                  >
                    <td className="p-3.5 text-center font-bold text-slate-400 text-xs whitespace-nowrap">
                      {stt}
                    </td>

                    {/* THỜI GIAN (THÁNG/NĂM) BADGE */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-extrabold text-[11px] shadow-2xs">
                        {d.month} {d.year}
                      </span>
                    </td>

                    <td className="p-3.5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                      {d.brand}
                    </td>

                    {/* NGÀNH HÀNG BADGE (PREVENT CONTAINER BREAKING) */}
                    <td className="p-3.5">
                      <span className="inline-flex items-center whitespace-nowrap px-3 py-1 bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-lg text-[11px] font-black shadow-2xs">
                        {d.category}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {d.campaign}
                    </td>

                    <td className="p-3.5 text-right font-black text-buzz whitespace-nowrap">
                      {formatNum(d.buzzVolume)}
                    </td>

                    <td className="p-3.5 text-right font-bold whitespace-nowrap">
                      {formatNum(d.contentQU)}
                    </td>

                    <td className="p-3.5 text-right font-bold whitespace-nowrap">
                      {formatNum(d.quUser)}
                    </td>

                    <td className="p-3.5 text-right font-black text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {formatNum(d.bsi)}
                    </td>

                    <td className="p-3.5 text-right font-bold whitespace-nowrap">
                      {formatNum(d.sentiment, 2)}
                    </td>

                    <td className="p-3.5 text-right font-bold whitespace-nowrap">
                      {formatNum(d.relevancy, 2)}
                    </td>

                    <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-black whitespace-nowrap">
                      {formatNum(d.earnedPct, 2)}%
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCampaign(d);
                        }}
                        className="p-1.5 text-buzz hover:bg-buzz-light dark:hover:bg-slate-800 rounded-lg transition"
                        title="Xem chi tiết chiến dịch"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-slate-700 dark:text-slate-300 font-black">
          Trang {safeCurrentPage} / {totalPages} (Tổng {sortedData.length} chiến dịch)
        </p>

        <div className="flex items-center gap-1.5">
          <button
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 text-xs font-black rounded-lg border transition flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Trang trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 2)
            .map((p, i, arr) => {
              const prev = arr[i - 1];
              const showDots = prev && p - prev > 1;

              return (
                <React.Fragment key={p}>
                  {showDots && <span className="px-1 text-slate-400 font-bold">...</span>}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg border transition ${
                      p === safeCurrentPage
                        ? 'bg-buzz text-white border-buzz shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 text-xs font-black rounded-lg border transition flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Trang sau <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
