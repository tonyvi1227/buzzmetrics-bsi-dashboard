import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { formatNum } from '../utils/brandStandardizer';

ChartJS.register(...registerables);

interface TimelineComboChartProps {
  data: CampaignRecord[];
}

export const TimelineComboChart: React.FC<TimelineComboChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const timelineMonths = React.useMemo(() => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timelineSet = new Set<string>();

    const default18Months = [
      'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
      'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025',
      'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'
    ];

    default18Months.forEach(m => timelineSet.add(m));
    data.forEach(d => {
      if (d.month && d.year) {
        timelineSet.add(`${d.month} ${d.year}`);
      }
    });

    return Array.from(timelineSet).sort((a, b) => {
      const [mA, yA] = a.split(' ');
      const [mB, yB] = b.split(' ');
      if (yA !== yB) return parseInt(yA) - parseInt(yB);
      return monthOrder.indexOf(mA) - monthOrder.indexOf(mB);
    });
  }, [data]);

  const chartData = React.useMemo(() => {
    const map: Record<string, { buzz: number; count: number }> = {};
    timelineMonths.forEach(m => {
      map[m] = { buzz: 0, count: 0 };
    });

    data.forEach(d => {
      const key = `${d.month} ${d.year}`;
      if (map[key]) {
        map[key].buzz += d.buzzVolume;
        map[key].count += 1;
      }
    });

    const buzzVolMillions = timelineMonths.map(k => parseFloat((map[k].buzz / 1000000).toFixed(2)));
    const campaignCounts = timelineMonths.map(k => map[k].count);

    return {
      labels: timelineMonths,
      datasets: [
        {
          type: 'bar' as const,
          label: 'Buzz Vol (Tr)',
          data: buzzVolMillions,
          backgroundColor: '#e68228', // Signature Buzzmetrics Orange
          borderRadius: 4,
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: 'Số Campaign',
          data: campaignCounts,
          borderColor: '#125876', // Buzzmetrics Dark Blue
          backgroundColor: '#125876',
          borderWidth: 2.5,
          pointRadius: 3.5,
          tension: 0.4, // Smooth line in charting to express softness & friendliness
          yAxisID: 'y1',
        },
      ],
    };
  }, [data, timelineMonths]);

  const options = React.useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
            color: textColor,
          },
          position: 'top' as const,
        },
        datalabels: { display: false },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          padding: 10,
          cornerRadius: 8,
          bodyFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          titleFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' as const },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", size: 9, weight: 'bold' as const } },
          grid: { display: false }, // Flat design - plain background
        },
        y: {
          type: 'linear' as const,
          position: 'left' as const,
          title: { display: true, text: 'Buzz Vol (Tr)', font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const }, color: textColor },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false },
        },
        y1: {
          type: 'linear' as const,
          position: 'right' as const,
          title: { display: true, text: 'Số Campaign', font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const }, color: textColor },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false },
        },
      },
    };
  }, [theme]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-buzz" /> Buzz Volume (Tr) & Số Campaign Timeline
      </h3>
      <div className="h-[270px]">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
};
