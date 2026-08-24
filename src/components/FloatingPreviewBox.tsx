import React, { useState } from 'react';
import { Zap, Sparkles, KeyRound, ChevronDown, ChevronUp } from 'lucide-react';
import { MAX_FREE_CLICKS } from '../utils/abTestingEngine';

interface FloatingPreviewBoxProps {
  clickCount: number;
  onOpenContactModal: () => void;
  onOpenUnlockModal: () => void;
}

export const FloatingPreviewBox: React.FC<FloatingPreviewBoxProps> = ({
  clickCount,
  onOpenContactModal,
  onOpenUnlockModal,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const remainingClicks = Math.max(0, MAX_FREE_CLICKS - clickCount);
  const progressPct = Math.round((remainingClicks / MAX_FREE_CLICKS) * 100);

  // Status colors based on remaining actions
  const isLimitReached = remainingClicks === 0;
  const isWarning = remainingClicks <= 2 && remainingClicks > 0;

  const accentColor = isLimitReached
    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900'
    : isWarning
    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900'
    : 'text-buzz bg-orange-50 dark:bg-orange-950/80 border-orange-200 dark:border-orange-900';

  const progressBarColor = isLimitReached
    ? 'bg-rose-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-buzz';

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-fadeIn">
        <button
          onClick={() => setIsMinimized(false)}
          className={`px-3.5 py-2 rounded-2xl shadow-xl border flex items-center gap-2 text-xs font-black transition cursor-pointer backdrop-blur-md ${
            isLimitReached
              ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
              : isWarning
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-slate-900 text-amber-400 border-slate-700 hover:bg-slate-800'
          }`}
          title="Expand Free Preview Status"
        >
          <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>{isLimitReached ? 'Preview Limit Reached (0/5)' : `Free: ${remainingClicks}/${MAX_FREE_CLICKS} Actions Left`}</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[92vw] max-w-[340px] animate-fadeIn">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl border ${accentColor} flex-shrink-0`}>
              <Zap className={`w-4 h-4 ${!isLimitReached ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-tight">
                Free Interactive Preview
              </h4>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {isLimitReached ? 'Action limit reached' : 'Interactive exploration mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${accentColor}`}
            >
              {remainingClicks}/{MAX_FREE_CLICKS} LEFT
            </span>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Minimize"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
            {isLimitReached
              ? 'You have used all 5 free actions. Sign up to unlock full report!'
              : 'Each filter selection or chart expansion uses 1 free action.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={onOpenContactModal}
            className="w-full py-2.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isLimitReached ? 'Sign up to Unlock Insights' : 'Unlock Unlimited Insights'}</span>
          </button>

          <button
            onClick={onOpenUnlockModal}
            className="w-full py-1 text-[11px] font-bold text-slate-500 hover:text-buzz dark:text-slate-400 dark:hover:text-amber-400 underline transition cursor-pointer flex items-center justify-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            <span>Already have an Access Code? Enter here</span>
          </button>
        </div>
      </div>
    </div>
  );
};
