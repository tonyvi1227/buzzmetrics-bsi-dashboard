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
      {/* Left Copyright & Version */}
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} Buzzmetrics BSI Dashboard v4.41</span>
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

      {/* Right Actions & Dev Trigger */}
      <div className="flex items-center gap-2 flex-wrap">
        {onOpenDevPassword && (
          <button
            onClick={onOpenDevPassword}
            title="Dev Access"
            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition flex items-center gap-1 cursor-pointer opacity-60 hover:opacity-100"
          >
            <Sparkles className="w-3 h-3 text-slate-400" />
            <span>Dev Access</span>
          </button>
        )}
      </div>
    </footer>
  );
};
