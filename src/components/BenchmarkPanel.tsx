import React, { useState } from 'react';
import { BenchmarkMetrics } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface BenchmarkPanelProps {
  metrics: BenchmarkMetrics;
}

interface CardTooltipProps {
  content: string;
}

const InfoTooltip: React.FC<CardTooltipProps> = ({ content }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type="button"
        className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-[10px] inline-flex items-center justify-center transition cursor-pointer"
        aria-label="Metric Info"
      >
        i
      </button>

      {show && (
        <div className="absolute right-0 bottom-full mb-2 w-48 sm:w-52 p-2.5 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-xl z-50 pointer-events-none animate-fadeIn border border-slate-700 leading-tight">
          {content}
          <div className="absolute right-1.5 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ metrics }) => {
  const cfquRatioPct = metrics.avgBuzz > 0 ? ((metrics.avgContentQU / metrics.avgBuzz) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-2 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-1 gap-1">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          AVERAGE BENCHMARK METRICS (Current Filter Scope)
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-buzz">
          Scope: {metrics.totalCount} Campaigns
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-3">
        {/* 1. Total Campaigns */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Total Campaigns</span>
            <InfoTooltip content="Total number of campaigns matching the current filter criteria." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{metrics.totalCount}</p>
          </div>
        </div>

        {/* 2. AVG Buzz Volume */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Buzz Vol</span>
            <InfoTooltip content={`Average total social discussions per campaign in dataset. Min: ${formatNum(metrics.minBuzz)} | Max: ${formatNum(metrics.maxBuzz)}`} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-buzz leading-none">{formatNum(metrics.avgBuzz)}</p>
          </div>
        </div>

        {/* 3. AVG BSI Score */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG BSI Score</span>
            <InfoTooltip content="Average Buzzmetrics Social Index (BSI) overall brand health score across selected campaigns." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgBSI)}</p>
          </div>
        </div>

        {/* 4. AVG CFQU */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG CFQU</span>
            <InfoTooltip content="Content from Qualified Users - Average discussions/posts generated by real, high-quality users." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgContentQU)}</p>
          </div>
        </div>

        {/* 5. Average QU */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Average QU</span>
            <InfoTooltip content="Qualified Users - Average number of genuine unique users participating in discussions." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgQUUser)}</p>
          </div>
        </div>

        {/* 6. AVG Sentiment */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Sentiment</span>
            <InfoTooltip content="Average Sentiment Index (Ratio of Positive vs Negative discussions) for selected campaigns." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{metrics.avgSentiment.toFixed(2)}</p>
          </div>
        </div>

        {/* 7. AVG Relevancy */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Relevancy</span>
            <InfoTooltip content="Average Relevancy Score (Proportion of discussions directly mentioning brand or campaign message)." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{metrics.avgRelevancy.toFixed(2)}</p>
          </div>
        </div>

        {/* 8. AVG Earned Media % */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Earned %</span>
            <InfoTooltip content="Average % of organic word-of-mouth discussions generated by the community." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{metrics.avgEarnedPct.toFixed(1)}%</p>
          </div>
        </div>

        {/* 9. % CFQU / Total Buzz Ratio */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-orange-200 dark:border-orange-900/60 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-buzz">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate">% CFQU / BUZZ</span>
            <InfoTooltip content="Percentage ratio of Content from Qualified Users (CFQU) over Total Buzz Volume." />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-buzz leading-none">
              {cfquRatioPct}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
