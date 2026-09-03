import React from 'react';
import { Target, TrendingUp, Star, Sparkles } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface TeaserDataSectionProps {
  onOpenContactModal?: () => void;
  isUnlocked?: boolean;
}

export const TeaserDataSection: React.FC<TeaserDataSectionProps> = ({
  onOpenContactModal,
  isUnlocked = false,
}) => {
  const { t } = useTranslation();
  if (isUnlocked) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-orange-950/20 dark:to-slate-900 rounded-2xl p-4 md:p-5 border border-orange-200 dark:border-orange-900/60 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-orange-200/80 dark:border-orange-900/40">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="p-1 rounded-md bg-buzz text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {t.teaserSection.title}
          </h3>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-buzz border border-orange-200 dark:border-orange-800 shadow-2xs">
            {t.teaserSection.badge}
          </span>
        </div>

        {onOpenContactModal && (
          <button
            onClick={onOpenContactModal}
            className="text-xs font-black text-buzz hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 cursor-pointer transition"
          >
            <span>{t.teaserSection.unlockBtn}</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3.5">
        {/* Benefit 1 */}
        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-orange-100 dark:border-slate-800 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-buzz font-black text-xs">
            <Target className="w-4 h-4" />
            <span>{t.teaserSection.card1Title}</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {t.teaserSection.card1Desc}
          </p>
        </div>

        {/* Benefit 2 */}
        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-orange-100 dark:border-slate-800 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-buzz font-black text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>{t.teaserSection.card2Title}</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {t.teaserSection.card2Desc}
          </p>
        </div>

        {/* Benefit 3 */}
        <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/80 border border-orange-100 dark:border-slate-800 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-buzz font-black text-xs">
            <Star className="w-4 h-4 text-buzz" />
            <span>{t.teaserSection.card3Title}</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {t.teaserSection.card3Desc}
          </p>
        </div>
      </div>
    </div>
  );
};
