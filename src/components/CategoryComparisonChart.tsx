import React, { useMemo } from 'react';
import { Users } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';

ChartJS.register(...registerables);

interface CategoryComparisonChartProps {
  data: CampaignRecord[];
}

export const CategoryComparisonChart: React.FC<CategoryComparisonChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Top 10 categories with highest Average Content QU
  const categoryStats = useMemo(() => {
    const catMap: Record<string, { category: string; count: number; contentQU: number; quUser: number }> = {};

    data.forEach(d => {
      if (!catMap[d.category]) {
        catMap[d.category] = { category: d.category, count: 0, contentQU: 0, quUser: 0 };
      }
      catMap[d.category].count += 1;
      catMap[d.category].contentQU += d.contentQU;
      catMap[d.category].quUser += d.quUser;
    });

    return Object.values(catMap)
      .map(c => ({
        category: c.category,
        avgContentQU: Math.round(c.contentQU / c.count),
        avgQUUser: Math.round(c.quUser / c.count),
        count: c.count,
      }))
      .sort((a, b) => b.avgContentQU - a.avgContentQU)
      .slice(0, 10); // TOP 10 CATEGORIES
  }, [data]);

  const chartData = useMemo(() => {
    return {
      labels: categoryStats.map(c => c.category),
      datasets: [
        {
          label: 'Avg Content QU (CFQU)',
          data: categoryStats.map(c => c.avgContentQU),
          backgroundColor: '#E57D24',
          borderRadius: 4,
        },
        {
          label: 'Avg QU User',
          data: categoryStats.map(c => c.avgQUUser),
          backgroundColor: '#2BB59B',
          borderRadius: 4,
        },
      ],
    };
  }, [categoryStats]);

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: 'Inter', size: 11, weight: 'bold' as const },
          },
          position: 'top' as const,
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx: any) => {
              const idx = ctx.dataIndex;
              const catItem = categoryStats[idx];
              if (!catItem) return `${ctx.dataset.label}: ${formatNum(ctx.raw)}`;

              if (ctx.datasetIndex === 0) {
                return `Avg Content QU: ${formatNum(catItem.avgContentQU)}`;
              } else {
                return `Avg QU User: ${formatNum(catItem.avgQUUser)}`;
              }
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear' as const,
          position: 'bottom' as const,
          title: {
            display: true,
            text: 'Số lượng Content QU & QU User Trung Bình',
            font: { size: 10, weight: 'bold' as const },
            color: textColor,
          },
          ticks: { color: textColor, font: { family: 'Inter', size: 9, weight: 'bold' as const } },
          grid: { display: false }, // NO GRID LINES
        },
        y: {
          ticks: { color: textColor, font: { family: 'Inter', size: 9, weight: 'bold' as const } },
          grid: { display: false }, // NO GRID LINES
        },
      },
    };
  }, [theme, categoryStats]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-buzz" /> Top 10 Ngành Hàng: Content QU & QU User Trung Bình
          </h3>
          <span className="text-[10px] font-black text-buzz bg-buzz-light dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-buzz-border dark:border-orange-800">
            Top 10 Ngành QU cao nhất
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Tỷ lệ tương tác chất lượng từ Qualified Users (Content QU & QU User) trung bình theo từng ngành.
        </p>

        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};
