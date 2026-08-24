import React from 'react';
import { Filter, Calendar, Search, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { CelebFilterState } from '../../types/celeb';
import { ALL_OPTION } from '../../hooks/useCelebSmartFilters';
import { MONTH_ORDER } from '../../hooks/useSmartFilters';
import { useAdmin } from '../../context/AdminContext';

interface CelebFilterBarProps {
  filters: CelebFilterState;
  updateFilter: (key: keyof CelebFilterState, value: any) => void;
  resetFilters: () => void;
  availableYears: string[];
  availableCategories: string[];
  totalResults: number;
  isUnlocked?: boolean;
}

export const CelebFilterBar: React.FC<CelebFilterBarProps> = ({
  filters,
  updateFilter,
  resetFilters,
  availableYears,
  availableCategories,
  totalResults,
  isUnlocked = false,
}) => {
  const { isAdmin } = useAdmin();
  const showScopeToggle = isAdmin || isUnlocked;

  return (
    <div className="glass-card p-4 md:p-5 rounded-2xl mb-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4">
        {/* Top Header Row: Title, Scope Toggle & Reset Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-buzz-light dark:bg-orange-950/60 text-buzz border border-buzz-border dark:border-orange-800 flex-shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white leading-snug">
                  SMART CASCADING CELEB FILTERS
                </h2>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Filter by Date Range (From ... To ...) ➔ Profession / Category ➔ Search Celebrity Name
              </p>
            </div>
          </div>

          {/* Actions: Scope Toggle Button (Top 10 Monthly vs All Celebrities) & Reset Filters Button */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            {showScopeToggle && (
              <button
                onClick={() => updateFilter('top10BsiOnly', !filters.top10BsiOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer shadow-sm ${
                  filters.top10BsiOnly
                    ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 dark:ring-amber-800'
                    : 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 dark:ring-emerald-800'
                }`}
                title={filters.top10BsiOnly ? 'Switch to All Celebrities' : 'Switch to Top 10 Monthly Celebrities'}
              >
                <Trophy className="w-3.5 h-3.5 text-white" />
                <span>{filters.top10BsiOnly ? `Top 10 Monthly (${totalResults} Celebrities)` : `All ${totalResults} Celebrities`}</span>
              </button>
            )}

            {/* Reset Filters Button */}
            <button
              onClick={resetFilters}
              className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Date Range & Cascading Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {/* Date Range Selector (From ... To ...) */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 bg-sky-50/60 dark:bg-sky-950/40 p-2 rounded-xl border border-sky-200 dark:border-sky-900">
            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-600 dark:text-sky-400" /> FROM (START)
              </label>
              <div className="grid grid-cols-2 gap-1">
                <select
                  value={filters.startMonth}
                  onChange={(e) => updateFilter('startMonth', e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                >
                  {MONTH_ORDER.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={filters.startYear}
                  onChange={(e) => updateFilter('startYear', e.target.value)}
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
                  onChange={(e) => updateFilter('endMonth', e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                >
                  {MONTH_ORDER.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={filters.endYear}
                  onChange={(e) => updateFilter('endYear', e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-buzz"
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category / Profession Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              PROFESSION / CATEGORY
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz truncate"
            >
              <option value={ALL_OPTION}>All Professions</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search Celebrity Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SEARCH CELEBRITY NAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search celebrity name..."
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
