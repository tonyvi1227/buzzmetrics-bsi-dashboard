import React from 'react';
import { PieChart } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
          backgroundColor: ['#7CAAD9', '#2BB59B', '#F57888'],
          borderWidth: 2,
          borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
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
            font: { family: 'Inter', size: 11, weight: 'bold' as const },
          },
          position: 'bottom' as const,
        },
        datalabels: {
          color: '#ffffff',
          font: { family: 'Inter', weight: 'bold' as const, size: 11 },
          formatter: (value: number, ctx: any) => {
            const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            if (sum === 0) return '0.00%';
            return ((value * 100) / sum).toFixed(2) + '%';
          },
        },
      },
    };
  }, [theme]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
        <PieChart className="w-4 h-4 text-buzz" /> Tỷ Lệ % Paid - Owned - Earned
      </h3>
      <div className="h-64 flex justify-center items-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};
