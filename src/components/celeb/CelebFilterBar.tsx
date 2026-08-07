import React from 'react';
import { Filter, Calendar, UserCheck, Search, RotateCcw } from 'lucide-react';
import { CelebFilterState } from '../../types/celeb';
import { ALL_OPTION } from '../../hooks/useCelebSmartFilters';

interface CelebFilterBarProps {
  filters: CelebFilterState;
  updateFilter: (key: keyof CelebFilterState, value: string) => void;
  resetFilters: () => void;
  availableYears: string[];
  availableMonths: string[];
  availableCategories: string[];
  totalResults: number;
}

export const CelebFilterBar: React.FC<CelebFilterBarProps> = ({
  filters,
  updateFilter,
  resetFilters,
  availableYears,
  availableMonths,
  availableCategories,
  totalResults,
}) => {
  const isFiltered =
    filters.year !== ALL_OPTION ||
    filters.month !== ALL_OPTION ||
    filters.category !== ALL_OPTION ||
    filters.search !== '';

  return (
    <div className="glass-card p-4 md:p-5 rounded-2xl mb-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 flex-shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white leading-snug">
                BỘ LỌC THÔNG MINH CELEBRITIES
              </h2>
              <span className="whitespace-nowrap inline-flex items-center justify-center flex-shrink-0 text-[10px] font-black bg-buzz text-white px-2.5 py-0.5 rounded-full shadow-sm uppercase">
                {totalResults} NGHỆ SĨ DỮ LIỆU
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Lọc theo Năm ➔ Tháng ➔ Lĩnh Vực Hoạt Động ➔ Tìm Tên Nghệ Sĩ
            </p>
          </div>
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
          {/* Year Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-buzz" /> NĂM
            </label>
            <select
              value={filters.year}
              onChange={(e) => updateFilter('year', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
            >
              <option value={ALL_OPTION}>Tất cả các năm</option>
              {availableYears.filter(y => y !== ALL_OPTION).map(y => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-buzz" /> THÁNG
            </label>
            <select
              value={filters.month}
              onChange={(e) => updateFilter('month', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
            >
              <option value={ALL_OPTION}>Tất cả các tháng</option>
              {availableMonths.filter(m => m !== ALL_OPTION).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-buzz" /> LĨNH VỰC
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz truncate"
            >
              <option value={ALL_OPTION}>Tất cả lĩnh vực</option>
              {availableCategories.filter(c => c !== ALL_OPTION).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Search className="w-3 h-3 text-buzz" /> TÌM TÊN NGHỆ SĨ
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Tìm tên nghệ sĩ..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {/* Reset Action Button if filtered */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-colors border border-rose-200 dark:border-rose-800 flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}

      </div>
    </div>
  );
};
