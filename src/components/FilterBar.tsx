import React from 'react';
import { Sliders, Search, Filter } from 'lucide-react';
import { FilterState } from '../types/dashboard';
import { ALL_OPTION } from '../hooks/useSmartFilters';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilter: (key: keyof FilterState, value: string) => void;
  availableYears: string[];
  availableMonths: string[];
  availableCategories: string[];
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilter,
  availableYears,
  availableMonths,
  availableCategories,
  filteredCount,
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-buzz uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4" /> Bộ Lọc Dữ Liệu Tương Tác Thông Minh (Smart Cascading Filters)
        </h2>
        <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Filter className="w-3 h-3 text-buzz" /> {filteredCount} kết quả khớp
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Year Filter */}
        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
            Năm (Year)
          </label>
          <select
            value={filters.year}
            onChange={(e) => onUpdateFilter('year', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-buzz outline-none cursor-pointer"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>
                {y === ALL_OPTION ? 'Tất cả các năm' : `Năm ${y}`}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Month Filter (Cascading based on Year) */}
        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Tháng (Month)</span>
            {filters.year !== ALL_OPTION && (
              <span className="text-[10px] text-buzz font-extrabold">lọc theo {filters.year}</span>
            )}
          </label>
          <select
            value={filters.month}
            onChange={(e) => onUpdateFilter('month', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-buzz outline-none cursor-pointer"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {m === ALL_OPTION ? 'Tất cả các tháng' : `Tháng ${m}`}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Category Filter (Cascading based on Year & Month) */}
        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Ngành Hàng (Category)</span>
            {(filters.year !== ALL_OPTION || filters.month !== ALL_OPTION) && (
              <span className="text-[10px] text-buzz font-extrabold">lọc theo thời gian</span>
            )}
          </label>
          <select
            value={filters.category}
            onChange={(e) => onUpdateFilter('category', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-buzz outline-none cursor-pointer"
          >
            {availableCategories.map(c => (
              <option key={c} value={c}>
                {c === ALL_OPTION ? 'Tất cả Ngành hàng' : c}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Keyword Search Input */}
        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
            Tìm Chiến Dịch / Thương Hiệu
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onUpdateFilter('search', e.target.value)}
              placeholder="Nhập từ khóa..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-2.5 pl-9 text-xs focus:ring-2 focus:ring-buzz outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
