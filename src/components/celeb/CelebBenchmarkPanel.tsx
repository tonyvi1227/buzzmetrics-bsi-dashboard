import React from 'react';
import { Award, Users, Trophy, MessageSquare, Target, Heart, Sparkles, Flame } from 'lucide-react';
import { CelebBenchmarkMetrics } from '../../types/celeb';
import { InfoTooltip } from '../common/InfoTooltip';

interface CelebBenchmarkPanelProps {
  metrics: CelebBenchmarkMetrics;
}

export const CelebBenchmarkPanel: React.FC<CelebBenchmarkPanelProps> = ({ metrics }) => {
  const formatNum = (num: number) => Math.round(num).toLocaleString('vi-VN');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-3 mb-6">
      {/* 1. Top 1 Celeb */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-2 xl:col-span-2 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60">
        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            Top 1 BSI Dẫn Đầu
            <InfoTooltip
              title="Top 1 BSI Dẫn Đầu"
              content="Nghệ sĩ đạt điểm BSI cao nhất trong toàn bộ tập dữ liệu được chọn."
            />
          </span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 leading-tight my-0.5 break-words">
          {metrics.topCeleb || 'N/A'}
        </p>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1">
          Điểm BSI: <strong className="text-slate-900 dark:text-white font-black">{formatNum(metrics.topBsi)}</strong>
        </span>
      </div>

      {/* 2. Total Celebs */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            Tổng Nghệ Sĩ
            <InfoTooltip
              title="Tổng số nghệ sĩ"
              content="Số lượng nghệ sĩ độc lập có ít nhất 1 tháng lọt BSI Top 10 trong kỳ."
            />
          </span>
          <Flame className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.totalCount}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Nghệ sĩ độc lập</span>
      </div>

      {/* 3. AVG BSI Score */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG BSI Score
            <InfoTooltip
              title="Điểm BSI Trung Bình"
              content="BSI = Buzz Volume * Sentiment Index * Content QU * Qualified User * Relevance Score."
            />
          </span>
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <p className="text-xl font-black text-buzz">{formatNum(metrics.avgBsi)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">BSI trung bình</span>
      </div>

      {/* 4. AVG Buzz Volume */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Buzz Volume
            <InfoTooltip
              title="Tổng Thảo Luận Trung Bình"
              content="Tổng số bài viết, bình luận, chia sẻ tạo ra liên quan đến nghệ sĩ."
            />
          </span>
          <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgBuzz)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Thảo luận trung bình</span>
      </div>

      {/* 5. Qualified User (QU) */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            Qualified User
            <InfoTooltip
              title="Qualified User (QU)"
              content="Lượng người dùng thực sự tham gia thảo luận chất lượng, không trùng lặp và loại trừ bot."
            />
          </span>
          <Users className="w-3.5 h-3.5 text-buzz-darkblue" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{formatNum(metrics.avgQuUser)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">QU trung bình</span>
      </div>

      {/* 6. AVG Sentiment */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Sentiment
            <InfoTooltip
              title="Chỉ số Cảm xúc (Sentiment Index)"
              content="Chỉ số cảm xúc trung bình (-1 đến 1). Mức >= 0.9 thể hiện cảm xúc rất tích cực từ khán giả."
            />
          </span>
          <Heart className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{metrics.avgSentiment.toFixed(2)}</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Chỉ số cảm xúc</span>
      </div>

      {/* 7. AVG Relevance */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            AVG Relevance
            <InfoTooltip
              title="Trung bình thảo luận liên quan"
              content="Tỷ lệ phần trăm thảo luận tập trung đúng vào nghệ sĩ và hoạt động chính."
            />
          </span>
          <Target className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white">{(metrics.avgRelevancy * 100).toFixed(1)}%</p>
        <span className="text-[10px] text-slate-400 font-bold mt-1">Thảo luận liên quan</span>
      </div>

      {/* 8. Quality Ratio */}
      <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-buzz-light/60 dark:bg-orange-950/40 border-buzz-border dark:border-orange-900">
        <div className="flex items-center justify-between text-buzz mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            Quality Ratio
            <InfoTooltip
              title="Tỷ lệ Chất lượng Thảo luận"
              content="Tỷ lệ thảo luận chất lượng = (Content QU / Buzz Volume) * 100%."
            />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-buzz" />
        </div>
        <p className="text-xl font-black text-buzz">
          {((metrics.avgContentQU / (metrics.avgBuzz || 1)) * 100).toFixed(1)}%
        </p>
        <span className="text-[10px] text-buzz dark:text-orange-300 font-extrabold mt-1">Content QU / Buzz</span>
      </div>
    </div>
  );
};
