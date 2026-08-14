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
        <div className="absolute right-0 bottom-full mb-2 w-52 p-2.5 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-xl z-50 pointer-events-none animate-fadeIn border border-slate-700 leading-tight">
          {content}
          <div className="absolute right-1.5 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ metrics }) => {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          AVERAGE BENCHMARK METRICS (Tính trung bình theo phạm vi bộ lọc đang chọn)
        </span>
        <span className="text-[11px] font-bold text-buzz">
          Scope: {metrics.totalCount} Campaigns
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-3">
        {/* 1. Total Campaigns */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Total Campaigns</span>
            <InfoTooltip content="Tổng số lượng chiến dịch đáp ứng phạm vi bộ lọc hiện tại." />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{metrics.totalCount}</p>
            <span className="text-[10px] font-bold text-slate-400">Filtered Dataset</span>
          </div>
        </div>

        {/* 2. AVG Buzz Volume */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Buzz Vol</span>
            <InfoTooltip content={`Tổng thảo luận trung bình mỗi chiến dịch trong tập dữ liệu. Min: ${formatNum(metrics.minBuzz)} | Max: ${formatNum(metrics.maxBuzz)}`} />
          </div>
          <div>
            <p className="text-2xl font-black text-buzz leading-tight">{formatNum(metrics.avgBuzz)}</p>
            <span className="text-[10px] font-bold text-slate-400">Campaign Mean</span>
          </div>
        </div>

        {/* 3. AVG BSI Score */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG BSI Score</span>
            <InfoTooltip content="Điểm số sức khỏe thương hiệu tổng hợp (Buzzmetrics Social Index) trung bình của các chiến dịch đang chọn." />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{formatNum(metrics.avgBSI)}</p>
            <span className="text-[10px] font-bold text-slate-400">Campaign Mean</span>
          </div>
        </div>

        {/* 4. AVG CFQU */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG CFQU</span>
            <InfoTooltip content="Content from Qualified Users - Trung bình số thảo luận/bài viết từ người dùng thật chất lượng." />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{formatNum(metrics.avgContentQU)}</p>
            <span className="text-[10px] font-bold text-slate-400">Campaign Mean</span>
          </div>
        </div>

        {/* 5. Average QU */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">Average QU</span>
            <InfoTooltip content="Qualified Users - Trung bình số người dùng chất lượng thực tế tạo ra thảo luận." />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{formatNum(metrics.avgQUUser)}</p>
            <span className="text-[10px] font-bold text-slate-400">Campaign Mean</span>
          </div>
        </div>

        {/* 6. AVG Sentiment */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Sentiment</span>
            <InfoTooltip content="Chỉ số yêu thích trung bình (Tỷ lệ Thảo luận Tích cực vs Tiêu cực) của các chiến dịch đang chọn." />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{metrics.avgSentiment.toFixed(2)}</p>
            <span className="text-[10px] font-bold text-slate-400">Campaign Mean</span>
          </div>
        </div>

        {/* 7. AVG Relevancy */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Relevancy</span>
            <InfoTooltip content="Điểm số phù hợp trung bình (Tỷ lệ thảo luận trực tiếp nhắc đến thương hiệu/thông điệp chiến dịch)." />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{metrics.avgRelevancy.toFixed(2)}</p>
            <span className="text-[10px] font-bold text-slate-400">Campaign Mean</span>
          </div>
        </div>

        {/* 8. AVG Earned Media % */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">AVG Earned %</span>
            <InfoTooltip content="Tỷ lệ % thảo luận tự nhiên do cộng đồng tạo ra trung bình giữa các chiến dịch." />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">{metrics.avgEarnedPct.toFixed(1)}%</p>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Organic Share</span>
          </div>
        </div>

        {/* 9. Overall Dataset Score */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-orange-200 dark:border-orange-900/60 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[96px]">
          <div className="flex items-center justify-between text-buzz">
            <span className="text-[11px] font-black uppercase tracking-wider truncate">AVG DATASET SCORE</span>
            <InfoTooltip content="Điểm chất lượng tổng hợp trung bình gia quyền của tập chiến dịch đang được lọc (Sentiment x 0.4 + Earned% x 0.6)." />
          </div>
          <div>
            <p className="text-2xl font-black text-buzz leading-tight">
              {((metrics.avgSentiment * 0.4) + (metrics.avgEarnedPct / 100 * 0.6)).toFixed(2)}
            </p>
            <span className="text-[10px] font-bold text-buzz">
              Weighted Index
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
