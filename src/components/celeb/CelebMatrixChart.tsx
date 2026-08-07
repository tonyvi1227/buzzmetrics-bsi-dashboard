import React, { useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Trophy } from 'lucide-react';
import { AggregatedCelebRecord } from '../../types/celeb';
import { useTheme } from '../../context/ThemeContext';
import { InfoTooltip } from '../common/InfoTooltip';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

interface CelebMatrixChartProps {
  celebs: AggregatedCelebRecord[];
}

export const CelebMatrixChart: React.FC<CelebMatrixChartProps> = ({ celebs }) => {
  const { theme } = useTheme();

  // Vibrant distinct colors matching English category names
  const categoryColors: Record<string, string> = {
    'Music': 'rgba(255, 94, 30, 0.85)',          // Signature Buzzmetrics Orange
    'TV & MC': 'rgba(18, 88, 118, 0.85)',        // Signature Buzzmetrics Dark Blue
    'Actor & Film': 'rgba(139, 92, 246, 0.85)',   // Violet/Purple
    'Creator': 'rgba(245, 158, 11, 0.85)',        // Amber Gold
    'Sports': 'rgba(16, 185, 129, 0.85)',         // Emerald Green
    'Beauty & Model': 'rgba(236, 72, 153, 0.85)', // Pink
    'Others': 'rgba(100, 116, 139, 0.85)',        // Slate Gray
  };

  const chartData = useMemo(() => {
    const categoryGroups: Record<string, AggregatedCelebRecord[]> = {};
    celebs.forEach(c => {
      const catKey = c.category || 'Others';
      if (!categoryGroups[catKey]) categoryGroups[catKey] = [];
      categoryGroups[catKey].push(c);
    });

    const datasets = Object.entries(categoryGroups).map(([cat, list]) => ({
      label: cat,
      data: list.map(item => ({
        x: item.avgRank,
        y: item.avgBsi,
        r: Math.max(6, Math.min(22, item.totalAppearances * 2.2)),
        celebName: item.celebName,
        totalAppearances: item.totalAppearances,
        avgBuzz: item.avgBuzz,
        bestRank: item.bestRank,
      })),
      backgroundColor: categoryColors[cat] || 'rgba(255, 94, 30, 0.85)',
      borderColor: '#ffffff',
      borderWidth: 1.5,
    }));

    return { datasets };
  }, [celebs]);

  const options = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 10, bottom: 5 }
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
            padding: 20, // Separates legend from chart canvas!
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            label: (context: any) => {
              const raw = context.raw;
              return [
                ` Nghệ sĩ: ${raw.celebName}`,
                ` • Ranking TB khi lọt Top: #${raw.x} (Cao nhất: #${raw.bestRank})`,
                ` • Số tháng lọt Top 10 BSI: ${raw.totalAppearances} tháng`,
                ` • Điểm BSI Trung bình: ${Math.round(raw.y).toLocaleString('vi-VN')}`,
                ` • Buzz Volume Trung bình: ${Math.round(raw.avgBuzz).toLocaleString('vi-VN')}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          reverse: true, // Rank #1 is best -> placed on far RIGHT!
          title: {
            display: true,
            text: '← Ranking TB Thấp dần | Ranking TB Cao dần (Sát Top #1) →',
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
          grid: { display: false },
          ticks: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            callback: (val: any) => `#${val}`,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Điểm BSI Trung Bình (AVG BSI Score)',
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
          },
          grid: { display: false },
          ticks: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const },
            callback: (val: any) => `${Math.round(val / 1000)}K`,
          },
        },
      },
    };
  }, [theme]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-buzz" />
          MA TRẬN VỊ THẾ CELEB (RANKING TB VS AVG BSI VS TẦN SUẤT TOP 10)
          <InfoTooltip
            title="Ma Trận Vị Thế Celeb"
            content="Phân tích 4 chiều: Trục X = Rank TB khi lọt Top (càng về bên phải càng gần #1); Trục Y = BSI trung bình; Kích thước bong bóng = Số tháng lọt Top 10 BSI; Màu sắc = Lĩnh vực hoạt động."
          />
        </h3>
        <span className="whitespace-nowrap inline-flex items-center justify-center text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-buzz dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
          POSITIONING MATRIX
        </span>
      </div>

      <div className="h-[280px]">
        {celebs.length > 0 ? (
          <Bubble data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
            Không có dữ liệu cho bộ lọc này
          </div>
        )}
      </div>
    </div>
  );
};
