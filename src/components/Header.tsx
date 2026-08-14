import React from 'react';
import { Sun, Moon, Upload, Download, Lock, Megaphone, Trophy, Sparkles, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  activeTab: 'campaigns' | 'celebs';
  onTabChange: (tab: 'campaigns' | 'celebs') => void;
  onOpenContactModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  activeTab,
  onTabChange,
  onOpenContactModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdmin();

  return (
    <header className="glass-card rounded-2xl p-3.5 md:p-4 mb-5 shadow-sm flex flex-col gap-3 border-l-4 border-l-buzz">
      {/* Top Single Compact Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        
        {/* Left Official Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src="/buzzmetrics-logo.png"
            alt="Buzzmetrics Logo"
            className="h-8 md:h-9 object-contain dark:brightness-110"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs md:text-sm font-black tracking-tight text-white uppercase whitespace-nowrap bg-slate-900 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 shadow-md">
              BSI Top10 Dashboard
            </span>

            {/* Live Data Status Indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE DATA</span>
            </span>

            {isAdmin && (
              <span className="whitespace-nowrap inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <Lock className="w-2.5 h-2.5" /> ADMIN MODE
              </span>
            )}
          </div>
        </div>

        {/* Right Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
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

          {/* Request Custom Insights / Contact BD Button (For Visitors) */}
          <button
            onClick={onOpenContactModal}
            className="whitespace-nowrap px-3 py-1.5 bg-buzz-light dark:bg-orange-950/60 hover:bg-orange-100 text-buzz dark:text-orange-300 rounded-xl text-xs border border-buzz-border dark:border-orange-800 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Request Custom Insights</span>
          </button>

          {/* Import Data & Export Report Buttons ONLY SHOW AFTER ENTERING PASSWORD (isAdmin) */}
          {isAdmin && (
            <>
              <button
                onClick={onOpenImport}
                className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs border border-emerald-300 dark:border-emerald-700 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Update Data</span>
              </button>

              <button
                onClick={onOpenExport}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs border border-slate-700 transition shadow-sm font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Export Report</span>
              </button>
            </>
          )}
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
            BSI TOP 10 CAMPAIGNS
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
            BSI TOP 10 CELEBRITIES
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </button>
        </div>
      </div>

    </header>
  );
};
