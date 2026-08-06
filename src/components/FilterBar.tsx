import React from 'react';
import { Filter, Calendar, Layers, Search, Tag } from 'lucide-react';
import { FilterState } from '../types/dashboard';
import { ALL_OPTION } from '../hooks/useSmartFilters';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilter: (key: keyof FilterState, value: string) => void;
  availableYears: string[];
  availableMonths: string[];
  availableCategories: string[];
  availableCampaignTypes?: string[];
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilter,
  availableYears,
  availableMonths,
  availableCategories,
  availableCampaignTypes = [],
  filteredCount,
}) => {
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
                BỘ LỌC THÔNG MINH (SMART CASCADING FILTERS)
              </h2>
              <span className="whitespace-nowrap inline-flex items-center justify-center flex-shrink-0 text-[10px] font-black bg-buzz text-white px-2.5 py-0.5 rounded-full shadow-sm">
                {filteredCount} KẾT QUẢ
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Lọc theo Năm ➔ Tháng ➔ Ngành Hàng ➔ Loại Chiến Dịch ➔ Từ Khóa
            </p>
          </div>
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full xl:w-auto">
          {/* Year Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-buzz" /> NĂM
            </label>
            <select
              value={filters.year}
              onChange={(e) => onUpdateFilter('year', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
            >
              <option value={ALL_OPTION}>Tất cả năm</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
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
              onChange={(e) => onUpdateFilter('month', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
            >
              <option value={ALL_OPTION}>Tất cả tháng</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-buzz" /> NGÀNH HÀNG
            </label>
            <select
              value={filters.category}
              onChange={(e) => onUpdateFilter('category', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz truncate"
            >
              <option value={ALL_OPTION}>Tất cả ngành hàng</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Campaign Type Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-buzz" /> LOẠI CAMPAIGN
            </label>
            <select
              value={filters.campaignType}
              onChange={(e) => onUpdateFilter('campaignType', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz truncate"
            >
              <option value={ALL_OPTION}>Tất cả loại campaign</option>
              <option value="Product Launch & Rebranding">🚀 Product Launch</option>
              <option value="Sponsor & Event">🎭 Sponsor & Event</option>
              <option value="Promotion">🎁 Promotion</option>
              <option value="CSR & Sustainability">🌿 CSR & Sustainability</option>
              <option value="Thematic & Brand Building">💎 Thematic</option>
            </select>
          </div>

          {/* Keyword Search Input */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Search className="w-3 h-3 text-buzz" /> TÌM THƯƠNG HIỆU / CAMP
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.brandSearch || filters.search || ''}
                onChange={(e) => onUpdateFilter('brandSearch', e.target.value)}
                placeholder="Nhập tên Brand/Camp..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
