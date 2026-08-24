import React from 'react';
import { Upload, Download, Sparkles, KeyRound } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { BUZZMETRICS_LOGO_BASE64 } from '../assets/buzzmetricsLogoData';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  activeTab: 'campaigns' | 'celebs';
  onTabChange: (tab: 'campaigns' | 'celebs') => void;
  onOpenContactModal?: () => void;
  onOpenUnlockModal?: () => void;
  isUnlocked?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  onOpenContactModal,
  onOpenUnlockModal,
  isUnlocked = false,
}) => {
  const { isAdmin } = useAdmin();

  return (
    <header className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 md:p-4 mb-5 shadow-sm flex flex-col gap-3 border border-slate-200 dark:border-slate-800 border-l-4 border-l-buzz">
      {/* Top Single Compact Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        
        {/* Left Official Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src={BUZZMETRICS_LOGO_BASE64}
            alt="Buzzmetrics Logo"
            className="h-8 md:h-9 object-contain"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs md:text-sm font-black tracking-tight text-white uppercase whitespace-nowrap bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 shadow-md">
              BSI Top10 Dashboard
            </span>

            {/* Live Data Status Indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>LIVE DATA</span>
            </span>
          </div>
        </div>

        {/* Right Section: Unlock Full Version, Request Custom Insights & Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
          {/* Main Lead Generation CTA Button */}
          {onOpenContactModal && (
            <button
              onClick={onOpenContactModal}
              className="px-3.5 py-1.5 bg-buzz hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
              title="Request Custom Campaign Analysis & Industry Insights"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Custom Insights</span>
            </button>
          )}

          {/* Unlock Full Version CTA Button */}
          {!isUnlocked && onOpenUnlockModal && (
            <button
              onClick={onOpenUnlockModal}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black rounded-xl shadow-sm border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Unlock Full Dashboard Version"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlock Full Version</span>
            </button>
          )}

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
