import React from 'react';
import { Upload, Download, Sparkles, KeyRound, BarChart3, Star } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useTranslation } from '../context/LanguageContext';
import { BUZZMETRICS_LOGO_BASE64 } from '../assets/buzzmetricsLogoData';
import { ABVariant } from '../types/leadGen';

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
}) => {
  const { isAdmin } = useAdmin();
  const { lang, setLang, t } = useTranslation();

  return (
    <header className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 mb-5 shadow-sm flex flex-col gap-4 border border-slate-200 dark:border-slate-800 border-l-4 border-l-buzz">
      {/* Top Header Row: Logo, Badge, Description, Version & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Left Official Logo, BSI Top 10 Badge & Subtitle */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 sm:gap-3.5 flex-wrap">
            <a
              href="https://www.buzzmetrics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 transition cursor-pointer flex items-center flex-shrink-0"
              title="Visit Buzzmetrics Website"
            >
              <img
                src={BUZZMETRICS_LOGO_BASE64}
                alt="Buzzmetrics Logo"
                className="h-8 sm:h-9 md:h-10 object-contain"
              />
            </a>

            <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase whitespace-nowrap bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 shadow-sm flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-buzz" />
              BSI TOP10
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            {t.nav.subtitle}
          </p>
        </div>

        {/* Right Section: Language Switcher, Sign up, Unlock & Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
          {/* Main Lead Generation CTA Button */}
          {onOpenContactModal && (
            <button
              onClick={onOpenContactModal}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-buzz hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
              title={t.nav.signupUnlock}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">{t.nav.signupUnlock}</span>
            </button>
          )}

          {/* Unlock Full Version CTA Button (Input Code) */}
          {onOpenUnlockModal && (
            <button
              onClick={onOpenUnlockModal}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black rounded-xl shadow-sm border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
              title={isUnlocked ? t.nav.unlocked : t.nav.unlockFull}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">{isUnlocked ? t.nav.unlocked : t.nav.unlockFull}</span>
            </button>
          )}

          {/* Hidden Admin-Only Toolbar Actions */}
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenImport}
                className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[38px]"
                title={t.nav.updateData}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.nav.updateData}</span>
              </button>

              <button
                onClick={onOpenExport}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[38px]"
                title={t.nav.exportData}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.nav.exportData}</span>
              </button>
            </div>
          )}

          {/* Language Switcher: Flag Icons (VN & UK) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner gap-1">
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`p-1 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                lang === 'vi'
                  ? 'bg-white dark:bg-slate-700 shadow-sm ring-2 ring-buzz'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Tiếng Việt (Mặc định)"
            >
              <img src="/flags/vn.png" alt="Tiếng Việt" className="w-6 h-4 object-cover rounded shadow-xs" />
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-1 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-slate-700 shadow-sm ring-2 ring-buzz'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="English (UK)"
            >
              <img src="/flags/uk.png" alt="English (UK)" className="w-6 h-4 object-cover rounded shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Tabs Bar: Optimized for Desktop, Tablet, and Mobile */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
          {/* Tab 1: Campaigns */}
          <button
            onClick={() => onTabChange('campaigns')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap uppercase tracking-wider">{t.nav.campaignsTab}</span>
          </button>

          {/* Tab 2: Celebrities */}
          <button
            onClick={() => onTabChange('celebs')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'celebs'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap uppercase tracking-wider">{t.nav.celebsTab}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
