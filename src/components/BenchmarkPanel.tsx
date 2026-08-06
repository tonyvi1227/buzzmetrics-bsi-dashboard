import React from 'react';
import { Gauge, TrendingUp, ArrowDownRight, ArrowUpRight, Award, Smile, Target, Share2 } from 'lucide-react';
import { BenchmarkMetrics } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface BenchmarkPanelProps {
  metrics: BenchmarkMetrics;
}

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ metrics }) => {
  return (
    <div className="glass-card border border-orange-200 dark:border-orange-900/60 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-orange-100 dark:bg-orange-950/80 text-buzz rounded-xl border border-orange-200 dark:border-orange-800">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
              Bảng Chỉ Số Benchmark Trung Bình & Biên Độ Thảo Luận
            </h2>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Tổng quan sức khỏe thương hiệu thị trường
            </p>
          </div>
        </div>
        <span className="text-xs bg-orange-100/90 dark:bg-orange-950/90 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-800 px-3.5 py-1.5 rounded-full font-black flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-buzz animate-pulse"></span>
          Tính trên <span className="text-buzz dark:text-orange-400 font-black">{metrics.totalCount}</span> chiến dịch
        </span>
      </div>

      {/* 9 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
        {/* Card 1: Avg Buzz Vol */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg Buzz Vol
          </p>
          <p className="text-base font-black text-buzz dark:text-orange-400 mt-1">
            {formatNum(Math.round(metrics.avgBuzz))}
          </p>
        </div>

        {/* Card 2: Min Buzz Vol */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <ArrowDownRight className="w-3 h-3 text-rose-500" /> Min Buzz Vol
          </p>
          <p className="text-base font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatNum(metrics.minBuzz)}
          </p>
        </div>

        {/* Card 3: Max Buzz Vol */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Max Buzz Vol
          </p>
          <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatNum(metrics.maxBuzz)}
          </p>
        </div>

        {/* Card 4: Avg Content QU */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg Content QU
          </p>
          <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            {formatNum(Math.round(metrics.avgContentQU))}
          </p>
        </div>

        {/* Card 5: Avg QU User */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg QU User
          </p>
          <p className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            {formatNum(Math.round(metrics.avgQUUser))}
          </p>
        </div>

        {/* Card 6: Avg BSI Score */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <Award className="w-3 h-3 text-amber-500" /> Avg BSI Score
          </p>
          <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">
            {formatNum(Math.round(metrics.avgBSI))}
          </p>
        </div>

        {/* Card 7: Avg Sentiment */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <Smile className="w-3 h-3 text-buzz" /> Avg Sentiment
          </p>
          <p className="text-base font-black text-buzz dark:text-orange-400 mt-1">
            {formatNum(metrics.avgSentiment, 2)}
          </p>
        </div>

        {/* Card 8: Avg Relevancy */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <Target className="w-3 h-3 text-amber-500" /> Avg Relevancy
          </p>
          <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">
            {formatNum(metrics.avgRelevancy, 2)}
          </p>
        </div>

        {/* Card 9: Avg % Earned */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
            <Share2 className="w-3 h-3 text-emerald-500" /> Avg % Earned
          </p>
          <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatNum(metrics.avgEarnedPct, 2)}%
          </p>
        </div>
      </div>
    </div>
  );
};
