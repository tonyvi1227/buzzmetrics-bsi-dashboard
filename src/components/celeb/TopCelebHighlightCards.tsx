import React from 'react';
import { Trophy, Flame, Award, Users } from 'lucide-react';
import { TopCelebHighlights } from '../../types/celeb';
import { formatNum } from '../../utils/brandStandardizer';

interface TopCelebHighlightCardsProps {
  highlights: TopCelebHighlights;
  onSelectCelebName?: (name: string) => void;
}

export const TopCelebHighlightCards: React.FC<TopCelebHighlightCardsProps> = ({
  highlights,
  onSelectCelebName,
}) => {

  const { peakBsiCeleb, mostConsistentCeleb, highestAvgBsiCeleb, highestQuCeleb } = highlights;

  if (!peakBsiCeleb && !mostConsistentCeleb && !highestAvgBsiCeleb && !highestQuCeleb) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-6 animate-fadeIn">
      {/* 1. Peak Single BSI Score */}
      {peakBsiCeleb && (
        <div
          onClick={() => onSelectCelebName?.(peakBsiCeleb.name)}
          className="glass-card p-3.5 sm:p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
              PEAK SINGLE BSI SCORE
            </span>
            <span className="text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900 whitespace-nowrap">
              Top 1 Peak
            </span>
          </div>

          <div className="my-1">
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-buzz transition truncate">
              {peakBsiCeleb.name}
            </h4>
            <p className="text-base sm:text-lg font-black text-buzz mt-0.5">
              {formatNum(peakBsiCeleb.bsi)} <span className="text-xs font-bold text-slate-400">BSI</span>
            </p>
          </div>

          <div className="pt-2 border-t border-amber-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Peak: <strong className="text-slate-800 dark:text-slate-200 font-bold">{peakBsiCeleb.month}/{peakBsiCeleb.year}</strong></span>
            <span className="text-[9px] sm:text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-extrabold">{peakBsiCeleb.category}</span>
          </div>
        </div>
      )}

      {/* 2. Most Consistent Leader (Most Top 10 Appearances) */}
      {mostConsistentCeleb && (
        <div
          onClick={() => onSelectCelebName?.(mostConsistentCeleb.name)}
          className="glass-card p-3.5 sm:p-4 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-gradient-to-br from-orange-50/70 via-white to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/30 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-buzz flex-shrink-0" />
              MOST TOP 10 APPEARANCES
            </span>
            <span className="text-[9px] font-black uppercase bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900 whitespace-nowrap">
              Consistency
            </span>
          </div>

          <div className="my-1">
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-buzz transition truncate">
              {mostConsistentCeleb.name}
            </h4>
            <p className="text-base sm:text-lg font-black text-buzz mt-0.5">
              {mostConsistentCeleb.appearances} <span className="text-xs font-bold text-slate-400">Months in Top 10</span>
            </p>
          </div>

          <div className="pt-2 border-t border-orange-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Avg Rank: <strong className="text-slate-800 dark:text-slate-200 font-bold">#{mostConsistentCeleb.avgRank}</strong></span>
            <span className="text-[9px] sm:text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-extrabold">{mostConsistentCeleb.category}</span>
          </div>
        </div>
      )}

      {/* 3. Highest Average BSI Score */}
      {highestAvgBsiCeleb && (
        <div
          onClick={() => onSelectCelebName?.(highestAvgBsiCeleb.name)}
          className="glass-card p-3.5 sm:p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              HIGHEST AVG BSI SCORE
            </span>
            <span className="text-[9px] font-black uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900 whitespace-nowrap">
              Top AVG BSI
            </span>
          </div>

          <div className="my-1">
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-buzz transition truncate">
              {highestAvgBsiCeleb.name}
            </h4>
            <p className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {formatNum(highestAvgBsiCeleb.avgBsi)} <span className="text-xs font-bold text-slate-400">Avg BSI</span>
            </p>
          </div>

          <div className="pt-2 border-t border-indigo-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Total: <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatNum(highestAvgBsiCeleb.totalBsi)}</strong></span>
            <span className="text-[9px] sm:text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-extrabold">{highestAvgBsiCeleb.category}</span>
          </div>
        </div>
      )}

      {/* 4. Highest Qualified Users (QU) */}
      {highestQuCeleb && (
        <div
          onClick={() => onSelectCelebName?.(highestQuCeleb.name)}
          className="glass-card p-3.5 sm:p-4 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-buzz-darkblue dark:text-sky-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-buzz-darkblue dark:text-sky-400 flex-shrink-0" />
              HIGHEST QUALIFIED USER (QU)
            </span>
            <span className="text-[9px] font-black uppercase bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-900 whitespace-nowrap">
              Top Reach
            </span>
          </div>

          <div className="my-1">
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-buzz transition truncate">
              {highestQuCeleb.name}
            </h4>
            <p className="text-base sm:text-lg font-black text-buzz-darkblue dark:text-sky-400 mt-0.5">
              {formatNum(highestQuCeleb.avgQuUser)} <span className="text-xs font-bold text-slate-400">Avg QU</span>
            </p>
          </div>

          <div className="pt-2 border-t border-sky-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Audience: <strong className="text-slate-800 dark:text-slate-200 font-bold">High Impact</strong></span>
            <span className="text-[9px] sm:text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-extrabold">{highestQuCeleb.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};
