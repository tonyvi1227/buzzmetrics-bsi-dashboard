import React, { useMemo } from 'react';
import { X, Award, TrendingUp, Users, Target, Smile, Calendar, Sparkles, MessageSquare, Flame } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface CelebDetailModalProps {
  celeb: AggregatedCelebRecord | null;
  onClose: () => void;
}

export const CelebDetailModal: React.FC<CelebDetailModalProps> = ({
  celeb,
  onClose,
}) => {
  const { theme } = useTheme();

  if (!celeb) return null;

  // Chronologically sort history from oldest to newest month
  const history = useMemo(() => {
    const monthOrder: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return [...celeb.monthlyRecords].sort((a, b) => {
      if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
      return (monthOrder[a.month] || 0) - (monthOrder[b.month] || 0);
    });
  }, [celeb]);

  const trendChartData = {
    labels: history.map(h => `${h.month}/${h.year}`),
    datasets: [
      {
        label: 'Điểm BSI',
        data: history.map(h => h.bsi),
        borderColor: '#ff5e1e', // Buzzmetrics signature orange
        backgroundColor: 'rgba(255, 94, 30, 0.12)',
        fill: true,
        tension: 0.4, // Smooth curve
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const isDark = theme === 'dark';
  const textColor = isDark ? '#f8fafc' : '#0f172a';

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: { display: false }, // Flat design - no overlapping text on points
      tooltip: {
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
        bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
        callbacks: {
          label: (context: any) => ` Điểm BSI: ${Math.round(context.raw).toLocaleString('vi-VN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false }, // Flat design rule - no grid lines
        ticks: { color: textColor, font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const } },
      },
      y: {
        grid: { display: false }, // Flat design rule - no grid lines
        ticks: {
          color: textColor,
          font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          callback: (val: any) => `${Math.round(val / 1000)}K`, // Standard clean K-unit rule
        },
      },
    },
  };

  const formatNum = (num: number) => Math.round(num).toLocaleString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white rounded-t-3xl relative flex items-center justify-between border-b border-orange-900/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-buzz flex items-center justify-center font-black text-xl text-white shadow-lg shadow-orange-500/30">
              {celeb.celebName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black tracking-wide text-white">{celeb.celebName}</h2>
                <span className="text-xs bg-orange-950/80 text-orange-300 border border-orange-800 px-3 py-0.5 rounded-full font-bold">
                  {celeb.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-1 flex items-center gap-2">
                <span>Số tháng lọt Top 10 BSI: <strong className="text-buzz">{celeb.totalAppearances} tháng</strong></span>
                <span>•</span>
                <span>Thứ hạng TB: <strong className="text-amber-300">#{celeb.avgRank}</strong> (Cao nhất: #{celeb.bestRank})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Average BSI */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-buzz flex items-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5 text-buzz" />
                AVG BSI Score
              </div>
              <div className="text-lg font-black text-buzz">
                {formatNum(celeb.avgBsi)}
              </div>
            </div>

            {/* AVG Buzz Volume */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                AVG Buzz
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {formatNum(celeb.avgBuzz)}
              </div>
            </div>

            {/* Qualified User (QU) */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-buzz-darkblue flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5" />
                Qualified User (QU)
              </div>
              <div className="text-lg font-black text-buzz-darkblue">
                {formatNum(celeb.avgQuUser)}
              </div>
            </div>

            {/* Sentiment */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                <Smile className="w-3.5 h-3.5 text-emerald-500" />
                AVG Sentiment
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {celeb.avgSentiment.toFixed(2)}
              </div>
            </div>

            {/* AVG Relevance */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                AVG Relevance
              </div>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {(celeb.avgRelevancy * 100).toFixed(1)}%
              </div>
            </div>

            {/* Top 10 Rank */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/30">
              <div className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                AVG Top10 Rank
              </div>
              <div className="text-lg font-black text-amber-800 dark:text-amber-300">
                #{celeb.avgRank}
              </div>
            </div>

          </div>

          {/* Historical BSI Trend Line */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-buzz" />
              LỊCH SỬ BIẾN ĐỘNG ĐIỂM BSI QUA CÁC THÁNG ({history.length} mốc thời gian xuất hiện)
            </h4>
            <div className="h-56">
              {history.length > 0 ? (
                <Line data={trendChartData} options={trendChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                  Chưa có thêm mốc lịch sử khác cho nghệ sĩ này.
                </div>
              )}
            </div>
          </div>

          {/* Monthly Breakdown History Table */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/90 font-black text-xs text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              Bảng Chi Tiết Chỉ Số BSI Qua Từng Tháng
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-black">
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3 text-center">Rank BSI tháng</th>
                    <th className="py-2.5 px-3 text-right">Điểm BSI</th>
                    <th className="py-2.5 px-3 text-right">Buzz Volume</th>
                    <th className="py-2.5 px-3 text-right">Content QU</th>
                    <th className="py-2.5 px-3 text-right">Qualified User (QU)</th>
                    <th className="py-2.5 px-3 text-right">Sentiment</th>
                    <th className="py-2.5 px-3 text-right">AVG Relevance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                  {history.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white">
                        {row.month}/{row.year}
                      </td>
                      <td className="py-2.5 px-3 text-center font-black text-amber-600 dark:text-amber-400">
                        #{row.monthRank}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-buzz">
                        {formatNum(row.bsi)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                        {formatNum(row.buzzVolume)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                        {formatNum(row.contentQU)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-buzz-darkblue font-black">
                        {formatNum(row.quUser)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold">
                        {row.sentiment.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-indigo-600 dark:text-indigo-400 font-black">
                        {(row.relevancy * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
