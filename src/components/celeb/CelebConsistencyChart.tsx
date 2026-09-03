import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Flame } from 'lucide-react';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';
import { InfoTooltip } from '../common/InfoTooltip';
import { useTranslation } from '../../context/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CelebConsistencyChartProps {
  celebs: AggregatedCelebRecord[];
}

export const CelebConsistencyChart: React.FC<CelebConsistencyChartProps> = ({ celebs }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const topConsistent = useMemo(() => {
    return [...celebs]
      .sort((a, b) => b.totalAppearances - a.totalAppearances || a.avgRank - b.avgRank || b.avgBsi - a.avgBsi)
      .slice(0, 10);
  }, [celebs]);

  const labels = topConsistent.map(c => c.celebName);
  const appearancesData = topConsistent.map(c => c.totalAppearances);

  const chartData = {
    labels,
    datasets: [
      {
        label: t.celebCharts.consistencyYAxis,
        data: appearancesData,
        backgroundColor: '#e68228', // Signature Buzzmetrics Orange
        borderRadius: 4,
      },
    ],
  };

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
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          },
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            afterLabel: (context: any) => {
              const idx = context.dataIndex;
              const celeb = topConsistent[idx];
              if (celeb) {
                return [
                  ` • ${t.celebDetail.avgRankBadge(celeb.avgRank, celeb.bestRank)}`,
                  ` • ${t.celebBenchmarks.avgBsi}: ${Math.round(celeb.avgBsi).toLocaleString('en-US')}`,
                  ` • ${t.celebBenchmarks.avgQu}: ${Math.round(celeb.avgQuUser).toLocaleString('en-US')}`,
                ];
              }
              return '';
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const } },
        },
        y: {
          grid: { display: false },
          ticks: { stepSize: 1, color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          title: {
            display: true,
            text: t.celebCharts.consistencyYAxis,
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
        },
      },
    };
  }, [theme, topConsistent, t]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-buzz" />
          {t.celebCharts.consistencyTitle}
          <InfoTooltip
            title={t.celebCharts.consistencyTooltipTitle}
            content={t.celebCharts.consistencyTooltipContent}
          />
        </h3>
        <span className="whitespace-nowrap inline-flex items-center justify-center text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
          {t.celebCharts.consistencyBadge}
        </span>
      </div>

      <div className="h-[270px]">
        {topConsistent.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
            {t.celebCharts.noData}
          </div>
        )}
      </div>
    </div>
  );
};
