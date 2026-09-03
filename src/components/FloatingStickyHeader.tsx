import React, { useState, useEffect } from 'react';
import { Sparkles, KeyRound, BarChart3, Star } from 'lucide-react';
import { BUZZMETRICS_LOGO_BASE64 } from '../assets/buzzmetricsLogoData';
import { useTranslation } from '../context/LanguageContext';

interface FloatingStickyHeaderProps {
  activeTab: 'campaigns' | 'celebs';
  onTabChange: (tab: 'campaigns' | 'celebs') => void;
  onOpenContactModal?: () => void;
  onOpenUnlockModal?: () => void;
  isUnlocked?: boolean;
}

export const FloatingStickyHeader: React.FC<FloatingStickyHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenContactModal,
  onOpenUnlockModal,
  isUnlocked = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 160) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-7xl animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
        {/* Left Logo & Title */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://www.buzzmetrics.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-85 transition cursor-pointer flex items-center"
            title="Visit Buzzmetrics Website"
          >
            <img
              src={BUZZMETRICS_LOGO_BASE64}
              alt="Buzzmetrics Logo"
              className="h-6 md:h-7 object-contain"
            />
          </a>
          <span className="hidden sm:inline-block text-[11px] font-black tracking-tight text-white uppercase bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">
            BSI Top10
          </span>
        </div>

        {/* Center Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-black">
          <button
            onClick={() => onTabChange('campaigns')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.nav.campaignsTab}</span>
          </button>
          <button
            onClick={() => onTabChange('celebs')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'celebs'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.nav.celebsTab}</span>
          </button>
        </div>

        {/* Right CTA Actions & Language Switch */}
        <div className="flex items-center gap-2">
          {onOpenContactModal && (
            <button
              onClick={onOpenContactModal}
              className="px-3 py-1.5 bg-buzz hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Đăng ký tư vấn' : 'Sign up'}</span>
              <span className="sm:hidden">Sign up</span>
            </button>
          )}

          {onOpenUnlockModal && (
            <button
              onClick={onOpenUnlockModal}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-black rounded-xl shadow-sm border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isUnlocked ? t.nav.unlocked : (lang === 'vi' ? 'Mở khóa' : 'Unlock Full')}</span>
            </button>
          )}

          {/* Language Switcher: Flag Icons (VN & UK) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 gap-1">
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`p-0.5 rounded transition-all cursor-pointer ${
                lang === 'vi'
                  ? 'bg-white dark:bg-slate-700 ring-2 ring-buzz shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Tiếng Việt"
            >
              <img src="/flags/vn.png" alt="Tiếng Việt" className="w-5 h-3.5 object-cover rounded shadow-2xs" />
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-0.5 rounded transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-slate-700 ring-2 ring-buzz shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="English (UK)"
            >
              <img src="/flags/uk.png" alt="English (UK)" className="w-5 h-3.5 object-cover rounded shadow-2xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
