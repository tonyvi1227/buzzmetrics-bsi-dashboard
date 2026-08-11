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
        className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-buzz-light dark:hover:bg-orange-950 text-slate-400 hover:text-buzz font-black text-[10px] inline-flex items-center justify-center transition border border-slate-200 dark:border-slate-700 cursor-pointer"
        aria-label="Thông tin chỉ số"
      >
        i
      </button>

      {show && (
        <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-xl z-50 pointer-events-none animate-fadeIn border border-slate-700 leading-tight">
          {content}
          <div className="absolute right-1.5 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-3 mb-6">
      {/* 1. Total Campaigns */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">Tổng Campaign</span>
          <InfoTooltip content="Tổng số lượng chiến dịch trong tập dữ liệu hiện tại." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{metrics.totalCount}</p>
      </div>

      {/* 2. AVG Buzz Volume */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">AVG Buzz Volume</span>
          <InfoTooltip content={`Tổng thảo luận trung bình mỗi chiến dịch. Min: ${formatNum(metrics.minBuzz)} | Max: ${formatNum(metrics.maxBuzz)}`} />
        </div>
        <p className="text-xl font-black text-buzz leading-none">{formatNum(metrics.avgBuzz)}</p>
      </div>

      {/* 3. AVG BSI Score */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">AVG BSI Score</span>
          <InfoTooltip content="Điểm số sức khỏe thương hiệu tổng hợp (Buzzmetrics Social Index) trung bình." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgBSI)}</p>
      </div>

      {/* 4. AVG CFQU */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">AVG CFQU</span>
          <InfoTooltip content="Content from Qualified Users - Số lượng bài viết/thảo luận tạo ra từ người dùng thực tế chất lượng." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgContentQU)}</p>
      </div>

      {/* 5. Average QU */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">Average QU</span>
          <InfoTooltip content="Qualified Users - Số lượng người dùng chất lượng thực tế tạo thảo luận." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{formatNum(metrics.avgQUUser)}</p>
      </div>

      {/* 6. AVG Sentiment */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">AVG Sentiment</span>
          <InfoTooltip content="Chỉ số yêu thích trung bình (Tỷ lệ Thảo luận Tích cực / Tiêu cực)." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{metrics.avgSentiment.toFixed(2)}</p>
      </div>

      {/* 7. AVG Relevancy */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">AVG Relevancy</span>
          <InfoTooltip content="Độ liên quan giữa nội dung thảo luận và thông điệp thương hiệu." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{metrics.avgRelevancy.toFixed(2)}</p>
      </div>

      {/* 8. AVG Earned % */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">% Earned Media</span>
          <InfoTooltip content="Tỷ lệ % thảo luận lan truyền tự nhiên thu được từ cộng đồng." />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{metrics.avgEarnedPct.toFixed(1)}%</p>
      </div>

      {/* 9. Quality Index */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[88px] bg-buzz-light/60 dark:bg-orange-950/40 border-buzz-border dark:border-orange-900">
        <div className="flex items-center justify-between text-buzz">
          <span className="text-[10px] font-black uppercase tracking-wider truncate">Quality Index</span>
          <InfoTooltip content="Chỉ số chất lượng nội dung thảo luận = Tỷ lệ % AVG CFQU / AVG Buzz Volume." />
        </div>
        <p className="text-xl font-black text-buzz leading-none">
          {((metrics.avgContentQU / (metrics.avgBuzz || 1)) * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
};
