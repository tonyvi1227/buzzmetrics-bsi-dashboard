import React from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import { InfoTooltip } from './common/InfoTooltip';
import { downloadChartAsImage } from '../utils/chartExporter';

ChartJS.register(...registerables);

interface TimelineComboChartProps {
  data: CampaignRecord[];
}

export const TimelineComboChart: React.FC<TimelineComboChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Shorten month format from "Jan 2025" -> "01/25" for clean horizontal display without tilting
  const formatMonthShort = (monthYearStr: string) => {
    const monthMap: Record<string, string> = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
    };
    const parts = monthYearStr.split(' ');
    if (parts.length === 2) {
      const m = monthMap[parts[0]] || parts[0];
      const y = parts[1].slice(-2);
      return `${m}/${y}`;
    }
    return monthYearStr;
  };

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

  const formattedLabels = React.useMemo(() => {
    return timelineMonths.map(m => formatMonthShort(m));
  }, [timelineMonths]);

  const chartData = React.useMemo(() => {
    const map: Record<string, { buzz: number; cfqu: number; count: number }> = {};
    timelineMonths.forEach(m => {
      map[m] = { buzz: 0, cfqu: 0, count: 0 };
    });

    data.forEach(d => {
      const key = `${d.month} ${d.year}`;
      if (map[key]) {
        map[key].buzz += d.buzzVolume;
        map[key].cfqu += (d.contentQU || 0);
        map[key].count += 1;
      }
    });

    const buzzVolMillions = timelineMonths.map(k => parseFloat((map[k].buzz / 1000000).toFixed(2)));
    const cfquPercentage = timelineMonths.map(k => {
      if (map[k].buzz === 0) return 0;
      return parseFloat(((map[k].cfqu / map[k].buzz) * 100).toFixed(1));
    });

    return {
      labels: formattedLabels,
      datasets: [
        {
          type: 'bar' as const,
          label: t.timelineChart.labelBuzz,
          data: buzzVolMillions,
          backgroundColor: '#e68228', // Signature Buzzmetrics Orange
          borderRadius: 6, // Refined rounded bar tops
          yAxisID: 'y',
        },
        {
          type: 'line' as const,
          label: t.timelineChart.labelCfqu,
          data: cfquPercentage,
          borderColor: '#125876', // Buzzmetrics Dark Blue
          backgroundColor: '#125876',
          borderWidth: 2.5,
          pointRadius: 3.5,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };
  }, [data, timelineMonths, formattedLabels, t]);

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
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const val = context.parsed.y;
              if (label.includes('%')) {
                return `${label}: ${val}%`;
              }
              return `${label}: ${val}M`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 9, weight: 'bold' as const },
            maxRotation: 0, // Force horizontal display without tilting!
            minRotation: 0,
          },
          grid: { display: false },
        },
        y: {
          type: 'linear' as const,
          position: 'left' as const,
          title: { display: true, text: 'Buzz Vol (M)', font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const }, color: textColor },
          ticks: { color: textColor, font: { family: "'Inter', sans-serif", weight: 'bold' as const } },
          grid: { display: false },
        },
        y1: {
          type: 'linear' as const,
          position: 'right' as const,
          title: { display: true, text: '% CFQU', font: { family: "'Inter', sans-serif", size: 10, weight: 'bold' as const }, color: textColor },
          ticks: {
            color: textColor,
            font: { family: "'Inter', sans-serif", weight: 'bold' as const },
            callback: (val: any) => `${val}%`,
          },
          grid: { display: false },
        },
      },
    };
  }, [theme]);

  return (
    <div id="timeline-combo-container" className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-buzz" /> {t.timelineChart.title}
          <InfoTooltip
            title={t.timelineChart.tooltipTitle}
            content={t.timelineChart.tooltipContent}
          />
        </h3>

        {/* Export PNG Chart Widget Button */}
        <button
          onClick={() => downloadChartAsImage('timeline-combo-container', 'timeline-combo-chart.png')}
          className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-buzz hover:text-white text-slate-500 transition cursor-pointer"
          title="Export Chart Image PNG"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-[270px]">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
};
