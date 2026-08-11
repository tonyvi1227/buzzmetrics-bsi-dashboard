import React from 'react';
import { MessageSquare, Trophy, ThumbsUp, Heart, Share2, Target, BarChart2, Sparkles } from 'lucide-react';
import { BenchmarkMetrics } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface BenchmarkPanelProps {
  metrics: BenchmarkMetrics;
}

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-3 mb-6">
      {/* 1. Total Campaigns */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">Tổng Campaign</span>
          <BarChart2 className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.totalCount}</p>
      </div>

      {/* 2. AVG Buzz Volume */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">AVG Buzz Volume</span>
          <MessageSquare className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-buzz">{formatNum(metrics.avgBuzz)}</p>
        <span className="text-[9px] text-slate-400 font-bold mt-1">Min: {formatNum(metrics.minBuzz)} | Max: {formatNum(metrics.maxBuzz)}</span>
      </div>

      {/* 3. AVG BSI Score */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">AVG BSI Score</span>
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgBSI)}</p>
      </div>

      {/* 4. AVG CFQU */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">AVG CFQU</span>
          <ThumbsUp className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgContentQU)}</p>
      </div>

      {/* 5. Average QU */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">Average QU</span>
          <ThumbsUp className="w-3.5 h-3.5 text-buzz-darkblue" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgQUUser)}</p>
      </div>

      {/* 6. AVG Sentiment */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">AVG Sentiment</span>
          <Heart className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgSentiment.toFixed(2)}</p>
      </div>

      {/* 7. AVG Relevancy */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">AVG Relevancy</span>
          <Target className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgRelevancy.toFixed(2)}</p>
      </div>

      {/* 8. AVG Earned % */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">% Earned Media</span>
          <Share2 className="w-3.5 h-3.5 text-sky-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgEarnedPct.toFixed(1)}%</p>
      </div>

      {/* 9. Quality Index */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-buzz-light/60 dark:bg-orange-950/40 border-buzz-border dark:border-orange-900">
        <div className="flex items-center justify-between text-buzz mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">Quality Index</span>
          <Sparkles className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-buzz">
          {((metrics.avgContentQU / (metrics.avgBuzz || 1)) * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};
