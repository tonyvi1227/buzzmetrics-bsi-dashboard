import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart } from 'lucide-react';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';
import { InfoTooltip } from '../common/InfoTooltip';
import { useTranslation } from '../../context/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CelebCategoryChartProps {
  celebs: AggregatedCelebRecord[];
}

export const CelebCategoryChart: React.FC<CelebCategoryChartProps> = ({ celebs }) => {
  const { theme } = useTheme();
  const { lang, t } = useTranslation();

  const categoryStats = useMemo(() => {
    const map: Record<string, { bsiSum: number; count: number }> = {};
    celebs.forEach(d => {
      const catKey = d.category || 'Others';
      if (!map[catKey]) {
        map[catKey] = { bsiSum: 0, count: 0 };
      }
      map[catKey].bsiSum += d.avgBsi;
      map[catKey].count += 1;
    });

    return Object.entries(map).map(([category, stat]) => ({
      category,
      bsiSum: stat.bsiSum,
      count: stat.count,
    })).sort((a, b) => b.count - a.count);
  }, [celebs]);

  // Vibrant distinct colors matching English category names
  const categoryColors: Record<string, string> = {
    'Music': '#ff5e1e',          // Signature Buzzmetrics Orange
    'TV & MC': '#125876',        // Signature Buzzmetrics Dark Blue
    'Actor & Film': '#8b5cf6',   // Violet/Purple
    'Creator': '#f59e0b',        // Amber Gold
    'Sports': '#10b981',         // Emerald Green
    'Beauty & Model': '#ec4899', // Pink
    'Others': '#64748b',        // Slate Gray
  };

  const chartData = {
    labels: categoryStats.map(c => t.celebCategories[c.category] || c.category),
    datasets: [
      {
        data: categoryStats.map(c => c.count),
        backgroundColor: categoryStats.map(c => categoryColors[c.category] || '#64748b'),
        borderWidth: 2,
        borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
      },
    ],
  };

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { left: 10, right: 15, top: 10, bottom: 10 }
      },
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            padding: 16, // Space between legend labels!
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            label: (context: any) => {
              const count = context.raw || 0;
              const total = categoryStats.reduce((a, b) => a + b.count, 0);
              const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
              return ` ${count} Influencers (${pct}%)`;
            },
          },
        },
      },
    };
  }, [theme, categoryStats, lang, t]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <PieChart className="w-4 h-4 text-buzz" />
          {t.celebCharts.categoryShareTitle}
          <InfoTooltip
            title={t.celebCharts.categoryShareTooltipTitle}
            content={t.celebCharts.categoryShareTooltipContent}
          />
        </h3>
        <span className="whitespace-nowrap inline-flex items-center justify-center text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
          {t.celebCharts.categoryShareBadge}
        </span>
      </div>

      <div className="h-[270px] flex items-center justify-center px-2">
        {categoryStats.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="text-xs font-bold text-slate-400">{t.celebCharts.noData}</div>
        )}
      </div>
    </div>
  );
};
