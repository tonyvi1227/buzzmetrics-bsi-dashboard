import React from 'react';
import { Sun, Moon, Upload, Download, Lock, Megaphone, Trophy, Sparkles, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';
import { BUZZMETRICS_LOGO_BASE64 } from '../assets/buzzmetricsLogoData';

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
            src={BUZZMETRICS_LOGO_BASE64}
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
          </div>
        </div>

        {/* Right Section: Request Custom Insights CTA, Theme Toggle & Admin Hidden Actions */}
        <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
          {/* Main Lead Generation CTA Button */}
          {onOpenContactModal && (
            <button
              onClick={onOpenContactModal}
              className="px-3.5 py-1.5 bg-buzz hover:bg-buzz-dark text-white text-xs font-black rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="Request Custom Campaign Analysis & Industry Insights"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Custom Insights</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Hidden Admin-Only Toolbar Actions */}
          {isAdmin && (
            <>
              <button
                onClick={onOpenImport}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Update Dashboard Data Set"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Update Data</span>
              </button>

              <button
                onClick={onOpenExport}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Export Data Report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
