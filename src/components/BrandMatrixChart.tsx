import React, { useMemo } from 'react';
import { Compass, Download } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';
import { InfoTooltip } from './common/InfoTooltip';
import { downloadChartAsImage } from '../utils/chartExporter';

ChartJS.register(...registerables);

// Custom Chart.js Plugin to draw Quadrant Dashed Lines at EXACT Statistical Dataset Means
const dynamicQuadrantPlugin = {
  id: 'dynamicQuadrantLines',
  beforeDraw(chart: any) {
    const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
    if (!x || !y) return;

    const avgX = chart.options.plugins?.dynamicQuadrantLines?.avgX || 0;
    const avgY = chart.options.plugins?.dynamicQuadrantLines?.avgY || 0;

    // Get precise pixel positions mapped from dataset means
    let linePixelX = x.getPixelForValue(avgX);
    let linePixelY = y.getPixelForValue(avgY);

    // Clamp within chart bounds
    linePixelX = Math.max(left + 15, Math.min(right - 15, linePixelX));
    linePixelY = Math.max(top + 15, Math.min(bottom - 15, linePixelY));

    ctx.save();
    ctx.strokeStyle = 'rgba(230, 130, 40, 0.45)'; // Buzzmetrics Orange Dashed Axis
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);

    // Vertical Mean Line (Avg Buzz Volume)
    ctx.beginPath();
    ctx.moveTo(linePixelX, top);
    ctx.lineTo(linePixelX, bottom);
    ctx.stroke();

    // Horizontal Mean Line (Avg BSI Score)
    ctx.beginPath();
    ctx.moveTo(left, linePixelY);
    ctx.lineTo(right, linePixelY);
    ctx.stroke();

    ctx.restore();
  },
};

interface BrandMatrixChartProps {
  data: CampaignRecord[];
}

export const BrandMatrixChart: React.FC<BrandMatrixChartProps> = ({ data }) => {
  const { theme } = useTheme();

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
  }, [data]);

  // Calculate EXACT dataset averages for dynamic quadrant lines
  const { avgX, avgY } = useMemo(() => {
    if (matrixData.length === 0) return { avgX: 0, avgY: 0 };
    const sumX = matrixData.reduce((acc, b) => acc + b.x, 0);
    const sumY = matrixData.reduce((acc, b) => acc + b.y, 0);
    return {
      avgX: Math.round(sumX / matrixData.length),
      avgY: Math.round(sumY / matrixData.length),
    };
  }, [matrixData]);

  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Brand Positioning Matrix',
          data: matrixData.map(b => ({
            x: b.x,
            y: b.y,
            brand: b.brand,
            avgBuzzRaw: b.avgBuzzRaw,
            avgBSI: b.avgBSI,
            avgSentiment: b.avgSentiment,
            count: b.count,
          })),
          backgroundColor: 'rgba(230, 130, 40, 0.75)', // Translucent bubbles
          borderColor: '#125876', // Buzzmetrics Dark Blue border
          borderWidth: 1.5,
          pointRadius: 7,
          pointHoverRadius: 11,
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
        dynamicQuadrantLines: {
          avgX: avgX,
          avgY: avgY,
        },
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
          grid: { display: false },
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
          grid: { display: false },
        },
      },
    };
  }, [theme, avgX, avgY]);

  return (
    <div id="brand-matrix-container" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition relative">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-buzz" /> BRAND POSITIONING MATRIX
            <InfoTooltip
              title="Brand Positioning Matrix"
              content="Scatter matrix dividing brands into 4 performance segments based on exact dataset means of Buzz Volume (X-axis) and BSI Score (Y-axis)."
            />
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-buzz bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-900">
              {matrixData.length} BRANDS
            </span>

            {/* Export PNG Chart Widget Button */}
            <button
              onClick={() => downloadChartAsImage('brand-matrix-container', 'brand-positioning-matrix.png')}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-500 transition cursor-pointer"
              title="Export Chart Image PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Statistical Means: <strong>AVG Buzz = {formatNum(avgX * 1000)}</strong> | <strong>AVG BSI = {formatNum(avgY)}</strong>
        </p>

        <div className="h-[250px] relative">
          <Scatter data={chartData} options={options} plugins={[dynamicQuadrantPlugin]} />
        </div>
      </div>

      {/* Clean 4 Segment Badge Legends (No Text Overlap with Data Points) */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-200/80 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="truncate">Top-Right: <strong>HIGH-PERFORMANCE</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-md border border-sky-200/80 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
            <span className="truncate">Top-Left: <strong>QUALITY-FOCUSED</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-md border border-amber-200/80 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="truncate">Bottom-Right: <strong>VIRAL-FOCUSED</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200/80 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="truncate">Bottom-Left: <strong>FOR IMPROVEMENT</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
