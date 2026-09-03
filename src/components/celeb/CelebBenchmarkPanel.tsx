import React, { useState } from 'react';
import { CelebBenchmarkMetrics } from '../../types/celeb';
import { formatNum } from '../../utils/brandStandardizer';
import { useTranslation } from '../../context/LanguageContext';

interface CelebBenchmarkPanelProps {
  metrics: CelebBenchmarkMetrics;
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

export const CelebBenchmarkPanel: React.FC<CelebBenchmarkPanelProps> = ({ metrics }) => {
  const { t } = useTranslation();
  const cfquRatioPct = metrics.avgBuzz > 0 ? ((metrics.avgContentQU / metrics.avgBuzz) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-2 mb-6">
      {/* Top Header Row Matching Campaign Benchmark */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-1 gap-1">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.celebBenchmarks.title}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-buzz">
          {t.celebBenchmarks.scope(metrics.totalCount)}
        </span>
      </div>

      {/* 8 Benchmark KPI Cards Matching Campaign Benchmark */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-3">
        {/* 1. Total Celebrities */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.totalCelebs}
            </span>
            <InfoTooltip content={t.celebBenchmarks.totalCelebsTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{metrics.totalCount}</p>
          </div>
        </div>

        {/* 2. AVG Buzz Volume */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.avgBuzz}
            </span>
            <InfoTooltip content={t.celebBenchmarks.avgBuzzTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-buzz leading-none">{formatNum(metrics.avgBuzz)}</p>
          </div>
        </div>

        {/* 3. AVG BSI Score */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.avgBsi}
            </span>
            <InfoTooltip content={t.celebBenchmarks.avgBsiTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgBsi)}</p>
          </div>
        </div>

        {/* 4. AVG CFQU */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.avgCfqu}
            </span>
            <InfoTooltip content={t.celebBenchmarks.avgCfquTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgContentQU)}</p>
          </div>
        </div>

        {/* 5. Average QU */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.avgQu}
            </span>
            <InfoTooltip content={t.celebBenchmarks.avgQuTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgQuUser)}</p>
          </div>
        </div>

        {/* 6. AVG Sentiment */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.avgSentiment}
            </span>
            <InfoTooltip content={t.celebBenchmarks.avgSentimentTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{metrics.avgSentiment.toFixed(2)}</p>
          </div>
        </div>

        {/* 7. AVG Relevancy */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {t.celebBenchmarks.avgRelevancy}
            </span>
            <InfoTooltip content={t.celebBenchmarks.avgRelevancyTooltip} />
          </div>
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{(metrics.avgRelevancy * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* 8. % CFQU / Total Buzz Ratio */}
        <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-xl border border-orange-200 dark:border-orange-900/60 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[76px] sm:min-h-[82px] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-buzz">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate">
              {t.celebBenchmarks.cfquBuzzRatio}
            </span>
            <InfoTooltip content={t.celebBenchmarks.cfquBuzzRatioTooltip} />
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
