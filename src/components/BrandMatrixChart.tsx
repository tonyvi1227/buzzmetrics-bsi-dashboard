import React, { useMemo } from 'react';
import { Compass } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';

ChartJS.register(...registerables);

interface BrandMatrixChartProps {
  data: CampaignRecord[];
}

export const BrandMatrixChart: React.FC<BrandMatrixChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Aggregate stats per brand using Average Buzz Volume & Average BSI
  const matrixData = useMemo(() => {
    const brandMap: Record<string, { brand: string; bsiTotal: number; buzzTotal: number; count: number; sentimentTotal: number }> = {};

    data.forEach(d => {
      if (!brandMap[d.brand]) {
        brandMap[d.brand] = { brand: d.brand, bsiTotal: 0, buzzTotal: 0, count: 0, sentimentTotal: 0 };
      }
      brandMap[d.brand].bsiTotal += d.bsi;
      brandMap[d.brand].buzzTotal += d.buzzVolume;
      brandMap[d.brand].sentimentTotal += d.sentiment;
      brandMap[d.brand].count += 1;
    });

    const brands = Object.values(brandMap)
      .map(b => {
        const avgBuzz = Math.round(b.buzzTotal / b.count);
        const avgBSI = Math.round(b.bsiTotal / b.count);
        const avgSentiment = parseFloat((b.sentimentTotal / b.count).toFixed(2));
        return {
          brand: b.brand,
          x: Math.round(avgBuzz / 1000), // Average Buzz Volume in Thousands (K)
          y: avgBSI, // Average BSI Score
          avgBuzzRaw: avgBuzz,
          avgBSI,
          avgSentiment,
          count: b.count,
        };
      })
      .filter(b => b.x > 0 || b.y > 0)
      .sort((a, b) => b.y - a.y)
      .slice(0, 15); // Top 15 brands for readability

    return brands;
  }, [data]);

  const chartData = useMemo(() => {
    const isDark = theme === 'dark';

    return {
      datasets: [
        {
          label: 'Ma Trận Vị Thế (TB Buzz Vol vs TB BSI)',
          data: matrixData.map(b => ({
            x: b.x,
            y: b.y,
            brand: b.brand,
            avgBuzzRaw: b.avgBuzzRaw,
            avgBSI: b.avgBSI,
            avgSentiment: b.avgSentiment,
            count: b.count,
          })),
          backgroundColor: '#E57D24',
          borderColor: isDark ? '#f97316' : '#c2410c',
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 11,
        },
      ],
    };
  }, [matrixData, theme]);

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            label: (ctx: any) => {
              const item = ctx.raw;
              return [
                `Thương hiệu: ${item.brand} (${item.count} Campaign)`,
                `Average Buzz Volume: ${formatNum(item.avgBuzzRaw)}`,
                `Average BSI Score: ${formatNum(item.avgBSI)}`,
                `Average Sentiment: ${item.avgSentiment}`,
              ];
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
            text: 'Average Buzz Volume (K)',
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            color: textColor,
          },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false }, // NO GRID LINES
        },
        y: {
          type: 'linear' as const,
          title: {
            display: true,
            text: 'Average BSI Score',
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            color: textColor,
          },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false }, // NO GRID LINES
        },
      },
    };
  }, [theme]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-buzz" /> Ma Trận Vị Thế Thương Hiệu (Average Buzz Vol vs Average BSI)
          </h3>
          <span className="text-[10px] font-black text-buzz bg-buzz-light dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-buzz-border dark:border-orange-800">
            Top 15 Brands
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Trục hoành: <strong>Average Buzz Volume</strong> (K) | Trục tung: <strong>Average BSI Score</strong>
        </p>

        <div className="h-64">
          <Scatter data={chartData} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Góc trên-phải: High Avg Buzz, High Avg BSI (Leaders)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Góc trên-trái: Low Avg Buzz, High Avg BSI (Niche)</span>
        </div>
      </div>
    </div>
  );
};
