import React, { useMemo } from 'react';
import { Tag, Download } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';
import { InfoTooltip } from './common/InfoTooltip';
import { downloadChartAsImage } from '../utils/chartExporter';

ChartJS.register(...registerables, ChartDataLabels);

// Custom Donut Center Label Plugin
const donutCenterLabelPlugin = {
  id: 'donutCenterText',
  beforeDraw(chart: any) {
    const { width, height, ctx, chartArea } = chart;
    if (!chartArea) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();

    const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);

    ctx.font = '900 18px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = chart.options.plugins.donutCenterText?.textColor || '#0f172a';
    ctx.fillText(`${total}`, centerX, centerY - 6);

    ctx.font = '700 9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('CAMPAIGNS', centerX, centerY + 10);

    ctx.restore();
  },
};

interface CampaignTypeChartProps {
  data: CampaignRecord[];
}

export const CampaignTypeChart: React.FC<CampaignTypeChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Aggregate stats per campaign type and sort from largest to smallest per guideline
  const typeStats = useMemo(() => {
    const map: Record<string, { typeName: string; rawType: string; count: number; buzz: number }> = {
      'Thematic & Brand Building': { typeName: 'Thematic', rawType: 'Thematic & Brand Building', count: 0, buzz: 0 },
      'Product Launch & Rebranding': { typeName: 'Product Launch', rawType: 'Product Launch & Rebranding', count: 0, buzz: 0 },
      'Sponsor & Event': { typeName: 'Sponsor & Event', rawType: 'Sponsor & Event', count: 0, buzz: 0 },
      'Promotion': { typeName: 'Promotion', rawType: 'Promotion', count: 0, buzz: 0 },
      'CSR & Sustainability': { typeName: 'CSR & Sustainability', rawType: 'CSR & Sustainability', count: 0, buzz: 0 },
    };

    data.forEach(d => {
      const typeKey = d.campaignType || 'Thematic & Brand Building';
      if (map[typeKey]) {
        map[typeKey].count += 1;
        map[typeKey].buzz += d.buzzVolume;
      }
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [data]);

  const chartData = useMemo(() => {
    // Buzzmetrics Official Palette: Dark Blue, Signature Orange, Light Orange, Sandy Orange, Grey
    const buzzPalette = ['#e68228', '#125876', '#e69650', '#fabe8c', '#969696'];

    return {
      labels: typeStats.map(t => t.typeName),
      datasets: [
        {
          data: typeStats.map(t => t.count),
          backgroundColor: buzzPalette.slice(0, typeStats.length),
          borderWidth: 2,
          borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
          cutout: '62%',
        },
      ],
    };
  }, [typeStats, theme]);

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 0,
          bottom: 0,
        },
      },
      plugins: {
        donutCenterText: {
          textColor: textColor,
        },
        legend: {
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle',
          },
          position: 'bottom' as const,
        },
        datalabels: {
          color: '#ffffff',
          font: { family: "'Inter', sans-serif", weight: 'bold' as const, size: 11 },
          formatter: (value: number, ctx: any) => {
            const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            if (sum === 0 || value === 0) return '';
            const pct = (value * 100) / sum;
            if (pct < 4) return ''; // Hide datalabels for small slices (<4%) to prevent overlapping text bleeding
            return `${pct.toFixed(1)}%`;
          },
        },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            label: (ctx: any) => {
              const item = typeStats[ctx.dataIndex];
              return [
                `Type: ${item.rawType}`,
                `Count: ${item.count} Campaigns`,
                `Total Buzz Volume: ${formatNum(item.buzz)}`,
              ];
            },
          },
        },
      },
    };
  }, [theme, typeStats]);

  return (
    <div id="campaign-type-container" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-buzz" /> CAMPAIGN TYPE DISTRIBUTION
            <InfoTooltip
              title="Campaign Type Distribution"
              content="Breakdown of Top 10 Campaigns categorized by marketing objective."
            />
          </h3>

          {/* Export PNG Chart Widget Button */}
          <button
            onClick={() => downloadChartAsImage('campaign-type-container', 'campaign-type-distribution.png')}
            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-500 transition cursor-pointer"
            title="Export Chart Image PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Share of Marketing Objectives (Product Launch, Sponsor, Promotion, CSR, Thematic)
        </p>

        <div className="h-[270px] relative">
          <Doughnut data={chartData} options={options} plugins={[donutCenterLabelPlugin]} />
        </div>
      </div>
    </div>
  );
};
