import React from 'react';
import { Upload, Download, Sparkles, KeyRound, BarChart3, Star, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { BUZZMETRICS_LOGO_BASE64 } from '../assets/buzzmetricsLogoData';
import { ABVariant } from '../types/leadGen';
import { MAX_FREE_CLICKS } from '../utils/abTestingEngine';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  activeTab: 'campaigns' | 'celebs';
  onTabChange: (tab: 'campaigns' | 'celebs') => void;
  onOpenContactModal?: () => void;
  onOpenUnlockModal?: () => void;
  isUnlocked?: boolean;
  variant?: ABVariant;
  clickCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  activeTab,
  onTabChange,
  onOpenContactModal,
  onOpenUnlockModal,
  isUnlocked = false,
  variant,
  clickCount = 0,
}) => {
  const { isAdmin } = useAdmin();
  const remainingClicks = Math.max(0, MAX_FREE_CLICKS - clickCount);

  return (
    <header className="bg-white dark:bg-slate-900 rounded-2xl p-3 md:p-4 mb-5 shadow-sm flex flex-col gap-3.5 border border-slate-200 dark:border-slate-800 border-l-4 border-l-buzz">
      {/* Top Header Row: Logo, Title, Live Badge & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        
        {/* Left Official Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <img
            src={BUZZMETRICS_LOGO_BASE64}
            alt="Buzzmetrics Logo"
            className="h-7 sm:h-8 md:h-9 object-contain"
          />

          <span className="text-xs md:text-sm font-black tracking-tight text-white uppercase whitespace-nowrap bg-slate-900 px-2.5 sm:px-3 py-1 rounded-xl border border-slate-700 shadow-md">
            BSI Top10 Dashboard
          </span>


          {/* Freemium 7-Action Live Countdown Badge for Variant C */}
          {!isUnlocked && variant === 'C' && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black border transition cursor-default shadow-sm ${
                remainingClicks > 2
                  ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                  : remainingClicks > 0
                  ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
              }`}
              title={`Freemium Preview: ${remainingClicks} of ${MAX_FREE_CLICKS} free interactive actions remaining`}
            >
              <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>{remainingClicks > 0 ? `FREE PREVIEW: ${remainingClicks}/${MAX_FREE_CLICKS} ACTIONS LEFT` : '0/7 ACTIONS LEFT (LIMIT REACHED)'}</span>
            </span>
          )}
        </div>

        {/* Right Section: Sign up to Unlock Insights, Unlock Full Version & Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {/* Main Lead Generation CTA Button */}
          {onOpenContactModal && (
            <button
              onClick={onOpenContactModal}
              className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 bg-buzz hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px]"
              title="Sign up to Unlock Insights & Industry Deep Dives"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Sign up to Unlock Insights</span>
            </button>
          )}

          {/* Unlock Full Version CTA Button - Always accessible */}
          {onOpenUnlockModal && (
            <button
              onClick={onOpenUnlockModal}
              className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black rounded-xl shadow-sm border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px]"
              title="Unlock Full Dashboard Version"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">{isUnlocked ? '✓ Unlocked' : 'Unlock Full Version'}</span>
            </button>
          )}

          {/* Hidden Admin-Only Toolbar Actions */}
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenImport}
                className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[36px]"
                title="Update Dashboard Data Set"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Update Data</span>
              </button>

              <button
                onClick={onOpenExport}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[36px]"
                title="Export Data Report"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Tabs Bar: Optimized for Desktop, Tablet, and Mobile */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
          {/* Tab 1: Campaigns */}
          <button
            onClick={() => onTabChange('campaigns')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap uppercase tracking-wider">Campaigns Benchmark</span>
          </button>

          {/* Tab 2: Celebrities */}
          <button
            onClick={() => onTabChange('celebs')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'celebs'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap uppercase tracking-wider">Influencer / Celeb Benchmark</span>
          </button>
        </div>
      </div>
    </header>
  );
};
