import React from 'react';
import { MessageSquare, Trophy, ThumbsUp, Heart, Share2, Target, BarChart2, Sparkles } from 'lucide-react';
import { BenchmarkMetrics } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';
import { InfoTooltip } from './common/InfoTooltip';

interface BenchmarkPanelProps {
  metrics: BenchmarkMetrics;
}

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-3 mb-6">
      {/* 1. Total Campaigns */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            Tổng Campaign
            <InfoTooltip
              title="Tổng số Chiến dịch"
              content="Số lượng chiến dịch thương hiệu nằm trong tập dữ liệu lọc."
            />
          </span>
          <BarChart2 className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.totalCount}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Tập dữ liệu lọc</span>
      </div>

      {/* 2. AVG Buzz Volume */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Buzz Volume
            <InfoTooltip
              title="Tổng Thảo Luận Trung Bình"
              content="Lượng thảo luận trung bình tạo ra từ tất cả chiến dịch được chọn."
            />
          </span>
          <MessageSquare className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-buzz">{formatNum(metrics.avgBuzz)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Min: {formatNum(metrics.minBuzz)} | Max: {formatNum(metrics.maxBuzz)}</span>
      </div>

      {/* 3. AVG BSI Score */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG BSI Score
            <InfoTooltip
              title="Điểm BSI Trung Bình"
              content="Chỉ số sức khỏe thương hiệu truyền thông Buzzmetrics Social Index."
            />
          </span>
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgBSI)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Điểm sức khỏe thương hiệu</span>
      </div>

      {/* 4. AVG CFQU */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Content QU
            <InfoTooltip
              title="Content from QU (CFQU)"
              content="Lượng bài viết và bình luận tạo ra từ tệp khán giả chất lượng."
            />
          </span>
          <ThumbsUp className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgContentQU)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Content from QU</span>
      </div>

      {/* 5. Average QU */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider">Average QU</span>
          <ThumbsUp className="w-3.5 h-3.5 text-buzz-darkblue" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgQUUser)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Qualified Users</span>
      </div>

      {/* 6. AVG Sentiment */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Sentiment
            <InfoTooltip
              title="Chỉ số Cảm xúc"
              content="Tỷ lệ cảm xúc tích cực của khán giả dành cho chiến dịch."
            />
          </span>
          <Heart className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgSentiment.toFixed(2)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Chỉ số hài lòng</span>
      </div>

      {/* 7. AVG Relevancy */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Relevance
            <InfoTooltip
              title="Trung bình thảo luận liên quan"
              content="Mức độ liên quan giữa thảo luận của khán giả và thông điệp của chiến dịch."
            />
          </span>
          <Target className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgRelevancy.toFixed(2)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Độ liên quan thương hiệu</span>
      </div>

      {/* 8. AVG Earned % */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            % Earned Media
            <InfoTooltip
              title="Tỷ lệ Earned Media"
              content="Tỷ lệ thảo luận tự nhiên từ người dùng so với tổng thảo luận."
            />
          </span>
          <Share2 className="w-3.5 h-3.5 text-sky-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgEarnedPct.toFixed(1)}%</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Thảo luận tự nhiên</span>
      </div>

      {/* 9. Overall Quality Index */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-buzz-light/60 dark:bg-orange-950/40 border-buzz-border dark:border-orange-900">
        <div className="flex items-center justify-between text-buzz mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            Quality Index
            <InfoTooltip
              title="Quality Index"
              content="Tỷ lệ chất lượng thảo luận = (Content QU / Buzz Volume) * 100%."
            />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-buzz">
          {((metrics.avgContentQU / (metrics.avgBuzz || 1)) * 100).toFixed(1)}%
        </p>
        <span className="text-[10px] text-buzz dark:text-orange-300 font-extrabold mt-1">Tỷ lệ CFQU / Buzz</span>
      </div>
    </div>
  );
};
