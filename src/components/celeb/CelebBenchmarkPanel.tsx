import React from 'react';
import { CelebBenchmarkMetrics } from '../../types/celeb';
import { InfoTooltip } from '../common/InfoTooltip';
import { formatNum } from '../../utils/brandStandardizer';

interface CelebBenchmarkPanelProps {
  metrics: CelebBenchmarkMetrics;
}

export const CelebBenchmarkPanel: React.FC<CelebBenchmarkPanelProps> = ({ metrics }) => {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 mb-6">
      {/* 1. Total Celebs */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px]">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            Total Celebs
          </span>
          <InfoTooltip
            title="Total Celebrities"
            content="Count of unique celebrities who appeared at least once in the BSI Top 10 during the period."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{metrics.totalCount}</p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate">Unique Celebs</span>
      </div>

      {/* 2. AVG BSI Score */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px]">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            AVG BSI
          </span>
          <InfoTooltip
            title="Average BSI Score"
            content="BSI = Buzz Volume * Sentiment Index * Content QU * Qualified User * Relevance Score."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-buzz leading-tight">{formatNum(metrics.avgBsi)}</p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate">Average BSI</span>
      </div>

      {/* 3. AVG Buzz Volume */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px]">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            AVG Buzz
          </span>
          <InfoTooltip
            title="Average Discussion Volume"
            content="Total posts, comments, and shares generated related to the celebrity."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{formatNum(metrics.avgBuzz)}</p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate">Average Buzz</span>
      </div>

      {/* 4. Qualified User (QU) */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px]">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            Qualified User
          </span>
          <InfoTooltip
            title="Qualified User (QU)"
            content="Number of genuine unique users actively generating discussions."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{formatNum(metrics.avgQuUser)}</p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate">Average QU</span>
      </div>

      {/* 5. AVG Sentiment */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px]">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            AVG Sentiment
          </span>
          <InfoTooltip
            title="Sentiment Index"
            content="Average sentiment score (-1 to 1). Values >= 0.9 indicate overwhelmingly positive audience feedback."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{metrics.avgSentiment.toFixed(2)}</p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate">Sentiment Index</span>
      </div>

      {/* 6. AVG Relevance */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px]">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            AVG Relevance
          </span>
          <InfoTooltip
            title="Average Relevance"
            content="Percentage of discussions directly focused on the celebrity."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{(metrics.avgRelevancy * 100).toFixed(1)}%</p>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 truncate">Relevance %</span>
      </div>

      {/* 7. Quality Ratio */}
      <div className="glass-card p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[78px] bg-buzz-light/60 dark:bg-orange-950/40 border-buzz-border dark:border-orange-900 col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-buzz mb-1">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            Quality Ratio
          </span>
          <InfoTooltip
            title="Discussion Quality Ratio"
            content="Quality ratio = (Content QU / Buzz Volume) * 100%."
          />
        </div>
        <p className="text-lg sm:text-xl font-black text-buzz leading-tight">
          {((metrics.avgContentQU / (metrics.avgBuzz || 1)) * 100).toFixed(1)}%
        </p>
        <span className="text-[9px] sm:text-[10px] text-buzz dark:text-orange-300 font-extrabold mt-0.5 truncate">CFQU / Buzz</span>
      </div>
    </div>
  );
};
