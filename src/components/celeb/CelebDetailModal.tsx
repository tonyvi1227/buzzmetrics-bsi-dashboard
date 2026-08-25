import React from 'react';
import { X, Trophy, MessageSquare, Heart, Sparkles, TrendingUp, Users, Target, Flame, Smile } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';
import { formatNum } from '../../utils/brandStandardizer';

ChartJS.register(...registerables);

interface CelebDetailModalProps {
  celeb: AggregatedCelebRecord | null;
  onClose: () => void;
}

export const CelebDetailModal: React.FC<CelebDetailModalProps> = ({ celeb, onClose }) => {
  const { theme } = useTheme();

  const history = celeb?.monthlyRecords || [];

  const trendChartData = React.useMemo(() => {
    if (!history || history.length === 0) return { labels: [], datasets: [] };

    // Sort chronologically ascending
    const sorted = [...history].sort((a, b) => {
      if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
      return parseInt(a.month) - parseInt(b.month);
    });

    const labels = sorted.map(h => `${h.month}/${h.year}`);
    const bsiScores = sorted.map(h => h.bsi);

    return {
      labels,
      datasets: [
        {
          label: 'Monthly BSI Score',
          data: bsiScores,
          borderColor: '#e68228', // Buzzmetrics signature orange
          backgroundColor: 'rgba(230, 130, 40, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#e68228',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [history]);

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#1e293b',
        titleFont: { family: 'Inter', weight: 'bold' as const },
        bodyFont: { family: 'Inter' },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
          font: { family: 'Inter', size: 11 },
        },
      },
      y: {
        grid: { color: theme === 'dark' ? '#334155' : '#f1f5f9' },
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
          font: { family: 'Inter', size: 11 },
          callback: (val: any) => `${Math.round(val / 1000)}K`,
        },
      },
    },
  };

  React.useEffect(() => {
    if (celeb) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [celeb]);

  if (!celeb) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex justify-center items-start p-3 sm:p-6 pt-6 sm:pt-10 md:pt-14 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[85vh] md:max-h-[660px] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors overscroll-contain">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-slate-900 text-white flex-shrink-0 relative flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-buzz flex items-center justify-center font-black text-xl text-white shadow-md">
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
                <span>Top 10 BSI Appearances: <strong className="text-buzz">{celeb.totalAppearances} Months</strong></span>
                <span>•</span>
                <span>Avg Rank: <strong className="text-amber-300">#{celeb.avgRank}</strong> (Best: #{celeb.bestRank})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1 space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Average BSI */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-buzz flex items-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5 text-buzz" />
                AVG BSI Score
              </div>
              <div className="text-lg font-black text-buzz">
                {formatNum(celeb.avgBsi)}
              </div>
            </div>

            {/* Total Buzz */}
            <div className="glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                AVG Buzz Vol
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {formatNum(celeb.avgBuzz)}
              </div>
            </div>

            {/* Qualified Users */}
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
              HISTORICAL BSI TREND OVER TIME ({history.length} Monthly Appearances)
            </h4>
            <div className="h-56">
              {history.length > 0 ? (
                <Line data={trendChartData} options={trendChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                  No additional historical data points found for this celebrity.
                </div>
              )}
            </div>
          </div>

          {/* Monthly Breakdown History Table */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/90 font-black text-xs text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              Monthly BSI Performance Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-black">
                    <th className="py-2.5 px-3">Timeline</th>
                    <th className="py-2.5 px-3 text-center">Monthly Rank</th>
                    <th className="py-2.5 px-3 text-right">BSI Score</th>
                    <th className="py-2.5 px-3 text-right">Buzz Volume</th>
                    <th className="py-2.5 px-3 text-right">Content QU</th>
                    <th className="py-2.5 px-3 text-right">Qualified User (QU)</th>
                    <th className="py-2.5 px-3 text-right">Sentiment</th>
                    <th className="py-2.5 px-3 text-right">Relevance</th>
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
