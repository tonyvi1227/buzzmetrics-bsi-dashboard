import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { BarChart3, Target } from 'lucide-react';
import { CelebRecord } from '../../types/celeb';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface CelebComparisonChartProps {
  filteredData: CelebRecord[];
}

export const CelebComparisonChart: React.FC<CelebComparisonChartProps> = ({ filteredData }) => {
  const top10 = filteredData.slice(0, 10);

  const labels = top10.map(d => d.celebName);
  const bsiData = top10.map(d => d.bsi);
  const relevanceData = top10.map(d => Number((d.relevancy * 100).toFixed(1)));

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'BSI Score',
        data: bsiData,
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 6,
        yAxisID: 'yBsi',
      },
      {
        type: 'line' as const,
        label: 'Relevance Ratio (%)',
        data: relevanceData,
        borderColor: '#f43f5e',
        backgroundColor: '#f43f5e',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'yRel',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#64748b',
          font: { family: 'Inter', size: 11, weight: 600 as const },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.yAxisID === 'yBsi') {
              return ` BSI: ${Math.round(context.raw).toLocaleString('en-US')}`;
            }
            return ` Relevance: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10, weight: 500 as const } },
      },
      yBsi: {
        type: 'linear' as const,
        position: 'left' as const,
        grid: { color: 'rgba(226, 232, 240, 0.4)' },
        ticks: { color: '#64748b' },
        title: {
          display: true,
          text: 'BSI Score',
          color: '#6366f1',
          font: { size: 11 },
        },
      },
      yRel: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 0,
        max: 100,
        grid: { display: false },
        ticks: {
          color: '#f43f5e',
          callback: (val: any) => `${val}%`,
        },
        title: {
          display: true,
          text: 'Relevance Ratio (%)',
          color: '#f43f5e',
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            BSI & Relevance Metric Comparison (Top 10)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluating the relationship between overall BSI score and content relevance
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded font-medium border border-rose-200 dark:border-rose-800">
          <Target className="w-3.5 h-3.5" />
          Relevance Score Focus
        </div>
      </div>

      <div className="h-64">
        {top10.length > 0 ? (
          <Chart type="bar" data={chartData} options={chartOptions} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No data available for this filter
          </div>
        )}
      </div>
    </div>
  );
};
