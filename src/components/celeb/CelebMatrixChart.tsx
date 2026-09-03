import React, { useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Trophy } from 'lucide-react';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';
import { InfoTooltip } from '../common/InfoTooltip';
import { useTranslation } from '../../context/LanguageContext';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

interface CelebMatrixChartProps {
  celebs: AggregatedCelebRecord[];
}

export const CelebMatrixChart: React.FC<CelebMatrixChartProps> = ({ celebs }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Vibrant distinct colors matching English category names
  const categoryColors: Record<string, string> = {
    'Music': 'rgba(255, 94, 30, 0.85)',          // Signature Buzzmetrics Orange
    'TV & MC': 'rgba(18, 88, 118, 0.85)',        // Signature Buzzmetrics Dark Blue
    'Actor & Film': 'rgba(139, 92, 246, 0.85)',   // Violet/Purple
    'Creator': 'rgba(245, 158, 11, 0.85)',        // Amber Gold
    'Sports': 'rgba(16, 185, 129, 0.85)',         // Emerald Green
    'Beauty & Model': 'rgba(236, 72, 153, 0.85)', // Pink
    'Others': 'rgba(100, 116, 139, 0.85)',        // Slate Gray
  };

  const chartData = useMemo(() => {
    const categoryGroups: Record<string, AggregatedCelebRecord[]> = {};
    celebs.forEach(c => {
      const catKey = c.category || 'Others';
      if (!categoryGroups[catKey]) categoryGroups[catKey] = [];
      categoryGroups[catKey].push(c);
    });

    const datasets = Object.entries(categoryGroups).map(([cat, list]) => ({
      label: cat,
      data: list.map(item => ({
        x: item.avgRank,
        y: item.avgBsi,
        r: Math.max(6, Math.min(22, item.totalAppearances * 2.2)),
        celebName: item.celebName,
        category: cat,
        totalAppearances: item.totalAppearances,
      })),
      backgroundColor: categoryColors[cat] || 'rgba(100, 116, 139, 0.85)',
      borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
      borderWidth: 1.5,
    }));

    return { datasets };
  }, [celebs, theme]);

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            boxWidth: 8,
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
            title: (context: any) => {
              const item = context[0]?.raw;
              return item ? `${item.celebName} (${item.category})` : '';
            },
            label: (context: any) => {
              const raw = context.raw;
              return [
                ` • Avg Rank: #${raw.x}`,
                ` • Avg BSI Score: ${Math.round(raw.y).toLocaleString('en-US')}`,
                ` • Top 10 Months: ${raw.totalAppearances}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          reverse: true, // Rank 1 is on the far right (Honor zone)
          min: 0.5,
          max: 10.5,
          title: {
            display: true,
            text: 'Average Top 10 Rank (#1 Honor Zone on Right)',
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
          grid: { display: false },
          ticks: {
            stepSize: 1,
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            callback: (val: any) => `#${val}`,
          },
        },
        y: {
          title: {
            display: true,
            text: 'AVG BSI Score',
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
          grid: { display: false },
          ticks: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            callback: (val: any) => `${Math.round(val / 1000)}K`,
          },
        },
      },
    };
  }, [theme]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-buzz" />
          {t.celebCharts.matrixTitle}
          <InfoTooltip
            title={t.celebCharts.matrixTooltipTitle}
            content={t.celebCharts.matrixTooltipContent}
          />
        </h3>
        <span className="whitespace-nowrap inline-flex items-center justify-center text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
          {t.celebCharts.matrixBadge}
        </span>
      </div>

      <div className="h-[280px]">
        {celebs.length > 0 ? (
          <Bubble data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
            {t.celebCharts.noData}
          </div>
        )}
      </div>
    </div>
  );
};
