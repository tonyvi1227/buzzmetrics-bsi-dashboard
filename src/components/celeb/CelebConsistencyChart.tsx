import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Flame } from 'lucide-react';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';
import { InfoTooltip } from '../common/InfoTooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CelebConsistencyChartProps {
  celebs: AggregatedCelebRecord[];
}

export const CelebConsistencyChart: React.FC<CelebConsistencyChartProps> = ({ celebs }) => {
  const { theme } = useTheme();

  const topConsistent = useMemo(() => {
    return [...celebs]
      .sort((a, b) => b.totalAppearances - a.totalAppearances || a.avgRank - b.avgRank || b.avgBsi - a.avgBsi)
      .slice(0, 10);
  }, [celebs]);

  const labels = topConsistent.map(c => c.celebName);
  const appearancesData = topConsistent.map(c => c.totalAppearances);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Số tháng lọt Top 10 BSI',
        data: appearancesData,
        backgroundColor: '#e68228', // Signature Buzzmetrics Orange
        borderRadius: 4,
      },
    ],
  };

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          },
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            afterLabel: (context: any) => {
              const idx = context.dataIndex;
              const celeb = topConsistent[idx];
              if (celeb) {
                return [
                  ` • Average BSI Top 10 Rank: #${celeb.avgRank}`,
                  ` • Điểm BSI Trung bình: ${Math.round(celeb.avgBsi).toLocaleString('vi-VN')}`,
                  ` • Qualified User (QU): ${Math.round(celeb.avgQuUser).toLocaleString('vi-VN')}`,
                ];
              }
              return '';
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const } },
        },
        y: {
          grid: { display: false },
          ticks: { stepSize: 1, color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          title: {
            display: true,
            text: 'Số tháng lọt Top 10 BSI',
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
        },
      },
    };
  }, [theme, topConsistent]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-buzz" />
          TOP 10 NGHỆ SĨ THƯỜNG XUYÊN ON TOP (SỐ THÁNG LỌT TOP 10 BSI)
          <InfoTooltip
            title="Độ Duy Trì Phong Độ"
            content="Thống kê Top 10 nghệ sĩ có số tháng duy trì vị thế lọt vào BSI Top 10 nhiều nhất trong khoảng thời gian chọn."
          />
        </h3>
        <span className="whitespace-nowrap inline-flex items-center justify-center text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
          RANKING CONSISTENCY
        </span>
      </div>

      <div className="h-[270px]">
        {topConsistent.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
            Không có dữ liệu cho bộ lọc này
          </div>
        )}
      </div>
    </div>
  );
};
