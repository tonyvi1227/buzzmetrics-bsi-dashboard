import React from 'react';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { ABVariant } from '../types/leadGen';

interface GatedOverlayProps {
  variant: ABVariant;
  onOpenGateModal: () => void;
  clickCount?: number;
}

export const GatedOverlay: React.FC<GatedOverlayProps> = ({
  variant,
  onOpenGateModal,
  clickCount = 0,
}) => {
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/40 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-inner animate-fadeIn"
      style={{
        willChange: 'transform, backdrop-filter',
        transform: 'translateZ(0)',
      }}
    >
      <div className="max-w-md w-full p-6 md:p-8 bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-4 shadow-orange-500/10">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center border border-orange-200 dark:border-orange-800 shadow-md">
          <LockKeyhole className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            UNLOCK BSI CAMPAIGN REPORT
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-1.5 leading-relaxed">
            {variant === 'C' && clickCount >= 3
              ? `You have reached the 3 free filter interaction limit. Register your contact to unlock full 100% access!`
              : 'Register your contact info to unlock full campaign deep-dive analytics & monthly top BSI benchmark reports.'}
          </p>
        </div>

        <button
          onClick={onOpenGateModal}
          className="w-full py-3.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs md:text-sm rounded-xl transition shadow-lg shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-2 transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>
            {variant === 'B'
              ? 'CHAT WITH AI CONSULTANT TO UNLOCK'
              : 'UNLOCK DEEP-DIVE CHARTS NOW'}
          </span>
        </button>
      </div>
    </div>
  );
};
