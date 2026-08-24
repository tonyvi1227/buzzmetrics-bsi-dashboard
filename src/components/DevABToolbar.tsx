import React from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import { ABVariant } from '../types/leadGen';
import { forceAssignedVariant, resetLockStateForTesting, unlockUserPermanently } from '../utils/abTestingEngine';
import { exportTemplateCSV } from '../utils/exportUtils';

interface DevABToolbarProps {
  currentVariant: ABVariant;
  isUnlocked: boolean;
  onUpdateState: (newVariant: ABVariant, newUnlocked: boolean) => void;
  onOpenImport?: () => void;
}

export const DevABToolbar: React.FC<DevABToolbarProps> = ({
  currentVariant,
  isUnlocked,
  onUpdateState,
  onOpenImport,
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
      unlockUserPermanently(true);
      onUpdateState(currentVariant, true);
    }
  };

  return (
    <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs border border-slate-700">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-black text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
          🛠️ Dev Tool:
        </span>
        <span className="font-extrabold text-slate-300">Active Variant:</span>
        
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
            onClick={() => handleSelectVariant('C')}
            className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
              currentVariant === 'C' ? 'bg-buzz text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Variant C (Freemium 5-Action)
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Upload New Monthly Data Button */}
        {onOpenImport && (
          <button
            onClick={onOpenImport}
            className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
            title="Upload/Import New Monthly Data (e.g. Jul 2026)"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Data</span>
          </button>
        )}

        {/* Download CSV Template Button */}
        <button
          onClick={() => exportTemplateCSV()}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700"
          title="Download original standard template CSV"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-buzz" />
          <span>Template CSV</span>
        </button>

        {/* Toggle Lock State */}
        <button
          onClick={handleToggleLock}
          className={`px-3 py-1 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1 border ${
            isUnlocked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          <span>{isUnlocked ? '✓ UNLOCKED (Full Access)' : 'Locked Preview (Click to Unlock)'}</span>
        </button>
      </div>
    </div>
  );
};
