import React from 'react';
import { PieChart, Download } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { downloadChartAsImage } from '../utils/chartExporter';
import { InfoTooltip } from './common/InfoTooltip';

ChartJS.register(...registerables, ChartDataLabels);

interface ChannelShareChartProps {
  data: CampaignRecord[];
}

export const ChannelShareChart: React.FC<ChannelShareChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const chartData = React.useMemo(() => {
    const totalOwned = data.reduce((a, b) => a + b.owned, 0);
    const totalPaid = data.reduce((a, b) => a + b.paid, 0);
    const totalEarned = data.reduce((a, b) => a + b.earned, 0);

    return {
      labels: ['Earned Media', 'Paid Media', 'Owned Media'],
      datasets: [
        {
          data: [totalEarned, totalPaid, totalOwned],
          backgroundColor: ['#125876', '#e68228', '#e69650'], // Buzzmetrics Palette: Dark Blue, Orange, Light Orange
          borderWidth: 2,
          borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
          cutout: '60%',
        },
      ],
    };
  }, [data, theme]);

  const options = React.useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          },
          position: 'bottom' as const,
        },
        datalabels: {
          color: '#ffffff',
          font: { family: "'Inter', sans-serif", weight: 'bold' as const, size: 11 },
          formatter: (value: number, ctx: any) => {
            const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            if (sum === 0) return '0.0%';
            return ((value * 100) / sum).toFixed(1) + '%';
          },
        },
      },
    };
  }, [theme]);

  return (
    <div id="channel-share-container" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <PieChart className="w-4 h-4 text-buzz" /> MEDIA CHANNEL SHARE DISTRIBUTION
          <InfoTooltip
            title="Media Channel Share"
            content="Proportional breakdown of total campaign discussion volume across Earned, Paid, and Owned media channels."
          />
        </h3>

        {/* Export PNG Chart Widget Button */}
        <button
          onClick={() => downloadChartAsImage('channel-share-container', 'channel-share-chart.png')}
          className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-500 transition cursor-pointer"
          title="Export Chart Image PNG"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-64 flex justify-center items-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};
