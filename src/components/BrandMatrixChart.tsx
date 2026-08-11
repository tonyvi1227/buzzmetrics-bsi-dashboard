import React, { useState, useMemo } from 'react';
import { Compass, EyeOff, Eye } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';
import { InfoTooltip } from './common/InfoTooltip';

ChartJS.register(...registerables);

interface BrandMatrixChartProps {
  data: CampaignRecord[];
}

export const BrandMatrixChart: React.FC<BrandMatrixChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const [excludeTWDoan, setExcludeTWDoan] = useState(true);

  // Aggregate stats for brands using AVG Buzz Volume & AVG BSI
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
      .filter(b => {
        if (excludeTWDoan) {
          const name = b.brand.toUpperCase();
          if (name.includes('TW ĐOÀN') || name.includes('ĐOÀN TNCS')) return false;
        }
        return true;
      })
      .map(b => {
        const avgBuzz = Math.round(b.buzzTotal / b.count);
        const avgBSI = Math.round(b.bsiTotal / b.count);
        const avgSentiment = parseFloat((b.sentimentTotal / b.count).toFixed(2));
        return {
          brand: b.brand,
          x: Math.round(avgBuzz / 1000), // AVG Buzz Volume in Thousands (K)
          y: avgBSI, // AVG BSI Score
          avgBuzzRaw: avgBuzz,
          avgBSI,
          avgSentiment,
          count: b.count,
        };
      })
      .filter(b => b.x > 0 || b.y > 0)
      .sort((a, b) => b.y - a.y);

    return brands;
  }, [data, excludeTWDoan]);

  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Ma Trận Vị Thế (AVG Buzz Vol vs AVG BSI)',
          data: matrixData.map(b => ({
            x: b.x,
            y: b.y,
            brand: b.brand,
            avgBuzzRaw: b.avgBuzzRaw,
            avgBSI: b.avgBSI,
            avgSentiment: b.avgSentiment,
            count: b.count,
          })),
          backgroundColor: '#e68228', // Buzzmetrics Signature Orange
          borderColor: '#125876', // Buzzmetrics Dark Blue border
          borderWidth: 1.5,
          pointRadius: 7,
          pointHoverRadius: 10,
        },
      ],
    };
  }, [matrixData]);

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
                `Brand: ${item.brand} (${item.count} Campaign)`,
                `AVG Buzz Volume: ${formatNum(item.avgBuzzRaw)}`,
                `AVG BSI Score: ${formatNum(item.avgBSI)}`,
                `AVG Sentiment: ${item.avgSentiment}`,
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
            text: 'AVG Buzz Volume (K)',
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            color: textColor,
          },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false }, // Flat design - plain background
        },
        y: {
          type: 'linear' as const,
          title: {
            display: true,
            text: 'AVG BSI Score',
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            color: textColor,
          },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false }, // Flat design - plain background
        },
      },
    };
  }, [theme]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-buzz" /> Ma Trận Vị Thế Thương Hiệu (AVG Buzz Vol vs AVG BSI)
            <InfoTooltip
              title="Ma Trận Vị Thế Thương Hiệu"
              content="Phân tích tương quan 4 vùng giữa Quy mô thảo luận trung bình (Trục X - AVG Buzz Volume) và Điểm sức khỏe thương hiệu (Trục Y - AVG BSI Score)."
            />
          </h3>
          <span className="text-[10px] font-black text-buzz bg-buzz-light dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-buzz-border dark:border-orange-800">
            {matrixData.length} Thương Hiệu
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Trục hoành: <strong>AVG Buzz Volume</strong> (K) | Trục tung: <strong>AVG BSI Score</strong>
        </p>

        <div className="h-64">
          <Scatter data={chartData} options={options} />
        </div>
      </div>

      <div className="space-y-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Góc trên-phải: High AVG Buzz, High AVG BSI (Leaders)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Góc trên-trái: Low AVG Buzz, High AVG BSI (Niche)</span>
          </div>
        </div>

        {/* Toggle Button to Exclude / Include TW ĐOÀN TNCS HỒ CHÍ MINH */}
        <div className="flex justify-end">
          <button
            onClick={() => setExcludeTWDoan(prev => !prev)}
            className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
              excludeTWDoan
                ? 'bg-orange-100 text-buzz border-orange-300 dark:bg-orange-950 dark:border-orange-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {excludeTWDoan ? (
              <>
                <Eye className="w-3 h-3 text-buzz" />
                <span>Hiển thị lại TW ĐOÀN TNCS HỒ CHÍ MINH</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 text-slate-400" />
                <span>Bỏ TW ĐOÀN TNCS HỒ CHÍ MINH khỏi Chart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
