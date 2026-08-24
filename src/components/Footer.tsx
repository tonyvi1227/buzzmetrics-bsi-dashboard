import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenDevPassword?: () => void;
  isDevAuthed?: boolean;
  totalRecordsCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDevPassword,
  isDevAuthed = false,
  totalRecordsCount = 318,
}) => {
  return (
    <footer className="mt-10 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
      {/* Left Copyright */}
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} Buzzmetrics BSI Dashboard v1.42</span>
      </div>

      {/* Center Dataset Scope Card */}
      <div className="whitespace-nowrap px-3 py-1.5 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 pointer-events-none select-none">
        <Calendar className="w-4 h-4 text-buzz flex-shrink-0" />
        <div className="text-left">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block leading-none">Dataset Scope</span>
          <span className="text-slate-800 dark:text-slate-200 font-extrabold text-[11px]">
            Jan 2025 – Jun 2026 (18 Months) • <strong className="text-buzz font-black">Total Records: {totalRecordsCount}</strong>
          </span>
        </div>
      </div>

      {/* Right Credits & Hidden Dev A/B Button (Only visible after unlocking dev mode) */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 font-bold">Credits:</span>
        <span className="text-buzz font-black bg-orange-50 dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
          Idea - GiangLHT
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-buzz font-black bg-orange-50 dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
          Dev - TuanVM
        </span>

        {/* Dev A/B Button: Only visible once Dev Mode is unlocked */}
        {isDevAuthed && onOpenDevPassword && (
          <button
            onClick={onOpenDevPassword}
            title="Dev A/B Toolbar"
            className="ml-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>⚡ Dev A/B</span>
          </button>
        )}
      </div>
    </footer>
  );
};
