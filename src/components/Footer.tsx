import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} Buzzmetrics BSI Campaign Dashboard v3.13</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-slate-400">Credit:</span>
        <span className="text-buzz font-black bg-orange-50 dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
          GiangLe
        </span>
      </div>
    </footer>
  );
};
