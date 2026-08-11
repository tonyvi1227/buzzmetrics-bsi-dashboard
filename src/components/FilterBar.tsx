import React from 'react';
import { Filter, Calendar, Layers, Search, Tag, Trophy, ArrowRight, Clock } from 'lucide-react';
import { FilterState } from '../types/dashboard';
import { ALL_OPTION, MONTH_ORDER } from '../hooks/useSmartFilters';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilter: (key: keyof FilterState, value: any) => void;
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
      <div className="flex flex-col gap-4">
        {/* Top Header Row: Title, Scope Toggle & Date Mode Toggle */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 flex-shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white leading-snug">
                  BỘ LỌC THÔNG MINH (SMART CASCADING FILTERS)
                </h2>
                <span className="whitespace-nowrap inline-flex items-center justify-center flex-shrink-0 text-[10px] font-black bg-buzz text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  {filteredCount} KẾT QUẢ
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Lọc theo Khoảng Thời Gian ➔ Ngành Hàng ➔ Loại Chiến Dịch ➔ Từ Khóa
              </p>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
            {/* Toggle Date Filter Mode: Single vs Range */}
            <button
              onClick={() => onUpdateFilter('dateRangeMode', !filters.dateRangeMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
                filters.dateRangeMode
                  ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-800 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{filters.dateRangeMode ? 'Đang dùng: Khoảng Thời Gian (Range)' : 'Chuyển sang: Lọc Khoảng Thời Gian'}</span>
            </button>

            {/* Toggle Scope: All Campaigns vs Top 10 BSI Per Month */}
            <button
              onClick={() => onUpdateFilter('top10BsiOnly', !filters.top10BsiOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
                filters.top10BsiOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${filters.top10BsiOnly ? 'text-white' : 'text-amber-500'}`} />
              <span>{filters.top10BsiOnly ? 'Đang bật: Top 10 BSI / Tháng' : 'Tất cả Campaign'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
          {/* Time Filter Column (Single vs Range Mode) */}
          {filters.dateRangeMode ? (
            /* Range Selector spanning 2 grid columns on large screens */
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 bg-sky-50/50 dark:bg-sky-950/30 p-2 rounded-xl border border-sky-200 dark:border-sky-900">
              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> TỪ (START)
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <select
                    value={filters.startMonth}
                    onChange={(e) => onUpdateFilter('startMonth', e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                  >
                    {MONTH_ORDER.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={filters.startYear}
                    onChange={(e) => onUpdateFilter('startYear', e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                  >
                    {availableYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> ĐẾN (END)
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <select
                    value={filters.endMonth}
                    onChange={(e) => onUpdateFilter('endMonth', e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                  >
                    {MONTH_ORDER.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={filters.endYear}
                    onChange={(e) => onUpdateFilter('endYear', e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                  >
                    {availableYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Single Year & Month Selectors */
            <>
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
            </>
          )}

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
          <div className="space-y-1">
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
