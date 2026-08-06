import React, { useMemo } from 'react';
import { Tag } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';

ChartJS.register(...registerables, ChartDataLabels);

interface CampaignTypeChartProps {
  data: CampaignRecord[];
}

export const CampaignTypeChart: React.FC<CampaignTypeChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const typeStats = useMemo(() => {
    const map: Record<string, { type: string; count: number; buzz: number }> = {
      'Product Launch & Rebranding': { type: '🚀 Product Launch', count: 0, buzz: 0 },
      'Sponsor & Event': { type: '🎭 Sponsor & Event', count: 0, buzz: 0 },
      'Promotion': { type: '🎁 Promotion', count: 0, buzz: 0 },
      'CSR & Sustainability': { type: '🌿 CSR & Sustainability', count: 0, buzz: 0 },
      'Thematic & Brand Building': { type: '💎 Thematic', count: 0, buzz: 0 },
    };

    data.forEach(d => {
      const typeKey = d.campaignType || 'Thematic & Brand Building';
      if (map[typeKey]) {
        map[typeKey].count += 1;
        map[typeKey].buzz += d.buzzVolume;
      }
    });

    return Object.values(map);
  }, [data]);

  const chartData = useMemo(() => {
    return {
      labels: typeStats.map(t => t.type),
      datasets: [
        {
          data: typeStats.map(t => t.count),
          backgroundColor: ['#8B5CF6', '#0284C7', '#F59E0B', '#10B981', '#E57D24'],
          borderWidth: 2,
          borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
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
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
          position: 'bottom' as const,
        },
        datalabels: {
          color: '#ffffff',
          font: { family: "'Inter', sans-serif", weight: 'bold' as const, size: 11 },
          formatter: (value: number, ctx: any) => {
            const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            if (sum === 0 || value === 0) return '';
            const pct = ((value * 100) / sum).toFixed(1);
            return `${pct}%`;
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
                `Loại hình: ${item.type}`,
                `Số lượng: ${item.count} Campaign`,
                `Tổng Buzz Volume: ${formatNum(item.buzz)}`,
              ];
            },
          },
        },
      },
    };
  }, [theme, typeStats]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-buzz" /> Phân Bổ Tỷ Lệ % Theo Loại Hình Chiến Dịch
          </h3>
          <span className="text-[10px] font-black text-buzz bg-buzz-light dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-buzz-border dark:border-orange-800">
            5 Loại Hình
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
          Tỷ lệ % phân bổ số lượng các loại hình Marketing (Launch, Sponsor & Event, Promo, CSR, Thematic).
        </p>

        <div className="h-64 flex justify-center items-center">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};
