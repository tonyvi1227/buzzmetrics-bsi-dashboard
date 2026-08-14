import React from 'react';
import { ABVariant } from '../types/leadGen';
import { forceAssignedVariant, resetLockStateForTesting, unlockUserPermanently } from '../utils/abTestingEngine';

interface DevABToolbarProps {
  currentVariant: ABVariant;
  isUnlocked: boolean;
  onUpdateState: (newVariant: ABVariant, newUnlocked: boolean) => void;
}

export const DevABToolbar: React.FC<DevABToolbarProps> = ({
  currentVariant,
  isUnlocked,
  onUpdateState,
}) => {
  const handleSelectVariant = (v: ABVariant) => {
    forceAssignedVariant(v);
    resetLockStateForTesting();
    onUpdateState(v, false);
  };

  const handleToggleLock = () => {
    if (isUnlocked) {
      resetLockStateForTesting();
      onUpdateState(currentVariant, false);
    } else {
      unlockUserPermanently(false);
      onUpdateState(currentVariant, true);
    }
  };

  return (
    <div className="mb-4 p-2.5 bg-slate-900 text-white rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-2 text-xs border border-slate-700">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-black text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
          🧪 DEV A/B TEST TOOLBAR:
        </span>
        <span className="font-extrabold text-slate-300">Biến Thể Đang Xem:</span>
        
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => handleSelectVariant('A')}
            className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
              currentVariant === 'A' ? 'bg-buzz text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Variant A (Form Gate)
          </button>

          <button
            onClick={() => handleSelectVariant('B')}
            className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
              currentVariant === 'B' ? 'bg-buzz text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Variant B (AI Chatbot)
          </button>

          <button
            onClick={() => handleSelectVariant('C')}
            className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
              currentVariant === 'C' ? 'bg-buzz text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Variant C (3-Click Freemium)
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleLock}
          className={`px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1 border ${
            isUnlocked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <span>{isUnlocked ? '✓ UNLOCKED (Mở khóa 100%)' : 'Bản Thử Nghiệm Free (Bấm để Mở khóa)'}</span>
        </button>
      </div>
    </div>
  );
};
