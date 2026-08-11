import React from 'react';
import { Sun, Moon, Upload, Download, Calendar, Lock, Megaphone, Trophy, Sparkles, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  totalRecordsCount: number;
  activeTab: 'campaigns' | 'celebs';
  onTabChange: (tab: 'campaigns' | 'celebs') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  totalRecordsCount,
  activeTab,
  onTabChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdmin();

  return (
    <header className="glass-card rounded-2xl p-3.5 md:p-4 mb-5 shadow-sm flex flex-col gap-3 border-l-4 border-l-buzz">
      {/* Top Single Compact Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        
        {/* Left Title & Compact Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-buzz flex items-center justify-center text-white p-2 shadow-md shadow-orange-500/20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 10C27.9 10 10 27.9 10 50c0 8.8 2.8 17 7.7 23.7L10 90l17.2-7.2C33.6 87.1 41.5 89 50 89c22.1 0 40-17.9 40-39S72.1 10 50 10zm-15 60H25V45h10v25zm15 0H40V35h10v35zm15 0H55V25h10v45z"/>
            </svg>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase whitespace-nowrap">
              BUZZMETRICS <span className="text-buzz">BSI DASHBOARD</span>
            </h1>

            {isAdmin && (
              <span className="whitespace-nowrap inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <Lock className="w-2.5 h-2.5" /> ADMIN MODE
              </span>
            )}
          </div>
        </div>

        {/* Right Actions & Dataset Info Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          {/* Tracking Dataset Info Card */}
          <div className="whitespace-nowrap px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 pointer-events-none select-none">
            <Calendar className="w-4 h-4 text-buzz flex-shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block leading-none">Phạm vi dataset ban đầu</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold text-[11px]">
                Tháng 01/2025 – Tháng 06/2026 (18 Tháng) • <strong className="text-buzz font-black">Số lượng campaign: {totalRecordsCount}</strong>
              </span>
            </div>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode'}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition font-black flex items-center gap-1.5 cursor-pointer"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            )}
          </button>

          {/* Import Data Button */}
          <button
            onClick={onOpenImport}
            className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs border border-emerald-300 dark:border-emerald-700 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Cập nhật Data</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={onOpenExport}
            className="whitespace-nowrap px-3 py-1.5 bg-buzz-light dark:bg-orange-950/60 hover:bg-orange-100 text-buzz dark:text-orange-300 rounded-xl text-xs border border-buzz-border dark:border-orange-800 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Xuất Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Bottom Tab Navigation Bar */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onTabChange('campaigns')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-buzz text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            BSI TOP 10 CAMPAIGNS (Chiến Dịch)
          </button>

          <button
            onClick={() => onTabChange('celebs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'celebs'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            BSI TOP 10 CELEBRITIES (Nghệ Sĩ)
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </button>
        </div>
      </div>

    </header>
  );
};
