import React from 'react';
import { LockKeyhole, Sparkles, CheckCircle2, KeyRound } from 'lucide-react';
import { ABVariant } from '../types/leadGen';
import { hasSubmittedLead } from '../utils/abTestingEngine';
import { useTranslation } from '../context/LanguageContext';

interface GatedOverlayProps {
  variant: ABVariant;
  onOpenGateModal: () => void;
  onUnlockNow?: () => void;
  onOpenPasscodeModal?: () => void;
  clickCount?: number;
}

export const GatedOverlay: React.FC<GatedOverlayProps> = ({
  variant,
  onOpenGateModal,
  onUnlockNow,
  onOpenPasscodeModal,
  clickCount = 0,
}) => {
  const { t } = useTranslation();
  const isAlreadySubmitted = hasSubmittedLead();

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 shadow-inner">
      <div className="max-w-md w-[95%] sm:w-full p-5 sm:p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-3.5 sm:space-y-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center border border-orange-200 dark:border-orange-800 shadow-sm">
          <LockKeyhole className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {t.gatedOverlay.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-bold mt-1.5 leading-relaxed">
            {isAlreadySubmitted
              ? t.gatedOverlay.submittedDesc
              : variant === 'C' && clickCount >= 5
              ? t.gatedOverlay.limitReachedDesc
              : t.gatedOverlay.defaultDesc}
          </p>
        </div>

        {isAlreadySubmitted && onUnlockNow ? (
          <button
            type="button"
            onClick={onUnlockNow}
            className="w-full py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{t.gatedOverlay.unlockFullRegistered}</span>
          </button>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onOpenGateModal}
              className="w-full py-3 sm:py-3.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs md:text-sm rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.gatedOverlay.signupFullReport}</span>
            </button>

            {onOpenPasscodeModal && (
              <button
                type="button"
                onClick={onOpenPasscodeModal}
                className="text-[11px] sm:text-xs font-bold text-slate-500 hover:text-buzz dark:text-slate-400 dark:hover:text-amber-400 underline transition cursor-pointer flex items-center justify-center gap-1 mx-auto py-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t.gatedOverlay.havePasscode}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
