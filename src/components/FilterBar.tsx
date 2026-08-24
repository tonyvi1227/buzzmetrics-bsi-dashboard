import React from 'react';
import { Filter, Calendar, Search, ArrowRight, RotateCcw, Trophy, Building2 } from 'lucide-react';
import { FilterState } from '../types/dashboard';
import { ALL_OPTION, MONTH_ORDER } from '../hooks/useSmartFilters';
import { useAdmin } from '../context/AdminContext';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilter: (key: keyof FilterState, value: any) => void;
  onResetFilters: () => void;
  availableYears: string[];
  availableMonths: string[];
  availableCategories: string[];
  availableCampaignTypes?: string[];
  filteredCount: number;
  isUnlocked?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  availableYears,
  availableCategories,
  filteredCount,
  isUnlocked = false,
}) => {
  const { isAdmin } = useAdmin();
  const showScopeToggle = isAdmin || isUnlocked;

  return (
    <div className="glass-card p-4 md:p-5 rounded-2xl mb-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4">
        {/* Top Header Row: Title, Result Count Badge, Scope Toggle & Reset Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 flex-shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white leading-snug">
                  SMART CASCADING FILTERS
                </h2>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Filter by Date Range (From ... To ...) ➔ Category ➔ Campaign Type ➔ Brand Keyword
              </p>
            </div>
          </div>

          {/* Actions: Extra Brands Toggle, Scope Toggle & Reset Filters Button */}
          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            {/* Extra Brands (TW Đoàn) Toggle Button */}
            <button
              onClick={() => onUpdateFilter('includeExtraBrands', !filters.includeExtraBrands)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer shadow-sm ${
                filters.includeExtraBrands
                  ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300 dark:ring-purple-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title={filters.includeExtraBrands ? 'Hide Extra Brands (TW Đoàn)' : 'Show Extra Brands (TW Đoàn)'}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{filters.includeExtraBrands ? 'TW Đoàn: Shown' : 'Show TW Đoàn'}</span>
            </button>

            {showScopeToggle && (
              <button
                onClick={() => onUpdateFilter('top10BsiOnly', !filters.top10BsiOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer shadow-sm ${
                  filters.top10BsiOnly
                    ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 dark:ring-amber-800'
                    : 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 dark:ring-emerald-800'
                }`}
                title={filters.top10BsiOnly ? 'Switch to All Campaigns' : 'Switch to Top 10 Monthly Campaigns'}
              >
                <Trophy className="w-3.5 h-3.5 text-white" />
                <span>{filters.top10BsiOnly ? `Top 10 Monthly (${filteredCount} Campaigns)` : `All ${filteredCount} Campaigns`}</span>
              </button>
            )}

            {/* Reset Filters Button */}
            <button
              onClick={onResetFilters}
              className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Permanent Date Range & Cascading Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
          {/* Date Range Selector */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 bg-sky-50/60 dark:bg-sky-950/40 p-2 rounded-xl border border-sky-200 dark:border-sky-900">
            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-600 dark:text-sky-400" /> FROM (START)
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
                <ArrowRight className="w-3 h-3 text-sky-600 dark:text-sky-400" /> TO (END)
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

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              CATEGORY
            </label>
            <select
              value={filters.category}
              onChange={(e) => onUpdateFilter('category', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz truncate"
            >
              <option value={ALL_OPTION}>All Categories</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Campaign Type Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              CAMPAIGN TYPE
            </label>
            <select
              value={filters.campaignType}
              onChange={(e) => onUpdateFilter('campaignType', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz truncate"
            >
              <option value={ALL_OPTION}>All Campaign Types</option>
              <option value="Product Launch & Rebranding">Product Launch</option>
              <option value="Sponsor & Event">Sponsor & Event</option>
              <option value="Promotion">Promotion</option>
              <option value="CSR & Sustainability">CSR & Sustainability</option>
              <option value="Thematic & Brand Building">Thematic</option>
            </select>
          </div>

          {/* Keyword Search Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SEARCH BRAND / CAMPAIGN
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.brandSearch || filters.search || ''}
                onChange={(e) => onUpdateFilter('brandSearch', e.target.value)}
                placeholder="Search Brand/Campaign..."
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
