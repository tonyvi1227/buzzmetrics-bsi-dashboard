import React, { useMemo } from 'react';
import { Users, Download } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';
import { downloadChartAsImage } from '../utils/chartExporter';

ChartJS.register(...registerables);

interface CategoryComparisonChartProps {
  data: CampaignRecord[];
}

export const CategoryComparisonChart: React.FC<CategoryComparisonChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Top 10 categories with highest AVG CFQU (Excluding 'Others' / 'Khác')
  const categoryStats = useMemo(() => {
    const catMap: Record<string, { category: string; count: number; contentQU: number; quUser: number }> = {};

    data.forEach(d => {
      // Exclude 'Others' or 'Khác' category per guideline requirement
      const normCat = (d.category || '').trim().toUpperCase();
      if (normCat === 'OTHERS' || normCat === 'KHÁC' || normCat === 'OTHER') {
        return;
      }

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
      .slice(0, 10); // TOP 10 SPECIFIC CATEGORIES
  }, [data]);

  const chartData = useMemo(() => {
    return {
      labels: categoryStats.map(c => c.category),
      datasets: [
        {
          label: 'AVG CFQU',
          data: categoryStats.map(c => c.avgContentQU),
          backgroundColor: '#e68228', // Buzzmetrics Signature Orange
          borderRadius: 6, // Refined rounded bar tops
        },
        {
          label: 'Average QU',
          data: categoryStats.map(c => c.avgQUUser),
          backgroundColor: '#125876', // Buzzmetrics Dark Blue
          borderRadius: 6,
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
      layout: {
        padding: {
          left: 0,
          right: 15,
          top: 0,
          bottom: 0,
        },
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
            padding: 14,
          },
          position: 'top' as const,
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            label: (ctx: any) => {
              const idx = ctx.dataIndex;
              const catItem = categoryStats[idx];
              if (!catItem) return `${ctx.dataset.label}: ${formatNum(ctx.raw)}`;

              if (ctx.datasetIndex === 0) {
                return `AVG CFQU: ${formatNum(catItem.avgContentQU)}`;
              } else {
                return `Average QU: ${formatNum(catItem.avgQUUser)}`;
              }
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const } },
          grid: { display: false },
        },
      },
    };
  }, [theme, categoryStats]);

  return (
    <div id="category-comparison-container" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-buzz" /> TOP 10 CATEGORIES: AVG CFQU & AVERAGE QU
          </h3>

          {/* Export PNG Chart Widget Button */}
          <button
            onClick={() => downloadChartAsImage('category-comparison-container', 'category-comparison-chart.png')}
            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-500 transition cursor-pointer"
            title="Export Chart Image PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Comparing Average Content Quality (CFQU) vs Genuine User Reach (QU) per Category
        </p>

        <div className="h-[270px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};
