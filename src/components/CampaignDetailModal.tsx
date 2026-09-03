import React, { useState, useMemo } from 'react';
import { X, Trophy, MessageSquare, Heart, ThumbsUp, Tag, Share2, Sparkles, TrendingUp, TrendingDown, Minus, Network, Table } from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { CampaignRecord } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';

ChartJS.register(...registerables);

interface CampaignDetailModalProps {
  campaign: CampaignRecord | null;
  allData: CampaignRecord[];
  onClose: () => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, allData, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'radar' | 'table'>('radar');

  React.useEffect(() => {
    if (campaign) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [campaign]);

  // Compute Category Average Benchmark for Comparison - Call Hooks unconditionally at top level
  const categoryBenchmark = useMemo(() => {
    if (!campaign) return null;
    const categoryRecords = allData.filter(d => d.category === campaign.category);
    const count = categoryRecords.length;
    if (count === 0) return null;

    return {
      category: campaign.category,
      count,
      avgBuzz: Math.round(categoryRecords.reduce((a, b) => a + b.buzzVolume, 0) / count),
      avgBSI: Math.round(categoryRecords.reduce((a, b) => a + b.bsi, 0) / count),
      avgContentQU: Math.round(categoryRecords.reduce((a, b) => a + b.contentQU, 0) / count),
      avgQUUser: Math.round(categoryRecords.reduce((a, b) => a + b.quUser, 0) / count),
      avgSentiment: parseFloat((categoryRecords.reduce((a, b) => a + b.sentiment, 0) / count).toFixed(2)),
      avgRelevancy: parseFloat((categoryRecords.reduce((a, b) => a + b.relevancy, 0) / count).toFixed(2)),
      avgEarnedPct: parseFloat((categoryRecords.reduce((a, b) => a + b.earnedPct, 0) / count).toFixed(2)),
    };
  }, [campaign, allData]);

  // Compute Radar Chart Data normalized relative to Industry Benchmark (100 pts)
  const radarChartData = useMemo(() => {
    if (!campaign || !categoryBenchmark) return null;

    const benchmarkBase = [100, 100, 100, 100, 100];

    const getRatio = (val: number, avg: number) => {
      if (!avg || avg === 0) return 100;
      const ratio = (val / avg) * 100;
      return Math.min(Math.round(ratio), 220); // Cap at 220 for radar visualization sanity
    };

    const campaignScores = [
      getRatio(campaign.earnedPct, categoryBenchmark.avgEarnedPct),
      getRatio(campaign.relevancy, categoryBenchmark.avgRelevancy),
      getRatio(campaign.contentQU, categoryBenchmark.avgContentQU),
      getRatio(campaign.quUser, categoryBenchmark.avgQUUser),
      getRatio(campaign.sentiment, categoryBenchmark.avgSentiment),
    ];

    return {
      labels: ['% Earned Media', 'Relevancy Score', 'AVG CFQU', 'Average QU', 'Sentiment Index'],
      datasets: [
        {
          label: `Campaign (${campaign.campaign})`,
          data: campaignScores,
          backgroundColor: 'rgba(230, 130, 40, 0.25)',
          borderColor: '#e68228', // Buzzmetrics Signature Orange
          borderWidth: 2.5,
          pointBackgroundColor: '#e68228',
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#e68228',
          pointRadius: 5,
        },
        {
          label: `Industry Avg: ${campaign.category} (100 Benchmark)`,
          data: benchmarkBase,
          backgroundColor: 'rgba(18, 88, 118, 0.25)',
          borderColor: '#125876', // Buzzmetrics Dark Blue
          borderWidth: 2,
          borderDash: [4, 4],
          pointBackgroundColor: '#125876',
          pointBorderColor: '#ffffff',
          pointRadius: 4,
        },
      ],
    };
  }, [campaign, categoryBenchmark]);

  const radarOptions = useMemo(() => {
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
            usePointStyle: true,
          },
          position: 'top' as const,
        },
        datalabels: { display: false },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", size: 12, weight: 'bold' as const },
          bodyFont: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          callbacks: {
            label: (ctx: any) => {
              if (!campaign || !categoryBenchmark) return '';
              const idx = ctx.dataIndex;
              const isCampaign = ctx.datasetIndex === 0;

              const metricsList = [
                { name: '% Earned Media', val: campaign.earnedPct, avg: categoryBenchmark.avgEarnedPct, isPct: true },
                { name: 'Relevancy Score', val: campaign.relevancy, avg: categoryBenchmark.avgRelevancy, isDecimal: true },
                { name: 'AVG CFQU', val: campaign.contentQU, avg: categoryBenchmark.avgContentQU, isNum: true },
                { name: 'Average QU', val: campaign.quUser, avg: categoryBenchmark.avgQUUser, isNum: true },
                { name: 'Sentiment Index', val: campaign.sentiment, avg: categoryBenchmark.avgSentiment, isDecimal: true },
              ];

              const m = metricsList[idx];
              if (!m) return '';

              if (isCampaign) {
                const diffPct = m.avg > 0 ? (((m.val - m.avg) / m.avg) * 100).toFixed(1) : '0';
                let formattedVal = '';
                if (m.isPct) formattedVal = `${m.val.toFixed(1)}%`;
                else if (m.isDecimal) formattedVal = m.val.toFixed(2);
                else formattedVal = formatNum(m.val);

                return `${m.name} (Campaign): ${formattedVal} (${diffPct >= '0' ? '+' : ''}${diffPct}% vs Industry Avg)`;
              } else {
                let formattedAvg = '';
                if (m.isPct) formattedAvg = `${m.avg.toFixed(1)}%`;
                else if (m.isDecimal) formattedAvg = m.avg.toFixed(2);
                else formattedAvg = formatNum(m.avg);

                return `${m.name} (Industry Avg ${campaign.category}): ${formattedAvg}`;
              }
            },
          },
        },
      },
      scales: {
        r: {
          angleLines: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
          grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
          pointLabels: {
            color: textColor,
            font: { family: "'Inter', sans-serif", size: 11, weight: 'bold' as const },
          },
          ticks: {
            display: false,
          },
          suggestedMin: 0,
          suggestedMax: 150,
        },
      },
    };
  }, [campaign, categoryBenchmark, theme]);

  // Safe early return ONLY AFTER all hooks are called
  if (!campaign) return null;

  const renderDiffBadge = (val: number, avgVal: number) => {
    if (!avgVal || avgVal === 0) return null;
    const diffPct = ((val - avgVal) / avgVal) * 100;
    const formattedDiff = Math.abs(diffPct).toFixed(1);

    if (diffPct > 0.5) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <TrendingUp className="w-3 h-3" /> +{formattedDiff}% {t.campaignDetail.vsIndustryAvg}
        </span>
      );
    } else if (diffPct < -0.5) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
          <TrendingDown className="w-3 h-3" /> -{formattedDiff}% {t.campaignDetail.vsIndustryAvg}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
          <Minus className="w-3 h-3" /> {t.campaignDetail.atIndustryAvg}
        </span>
      );
    }
  };

  const renderTypeBadge = (type?: string) => {
    switch (type) {
      case 'Product Launch & Rebranding':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            🚀 {t.campaignFilters.typeLaunchShort}
          </span>
        );
      case 'Sponsor & Event':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            🎭 {t.campaignFilters.typeSponsor}
          </span>
        );
      case 'Promotion':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            🎁 {t.campaignFilters.typePromotion}
          </span>
        );
      case 'CSR & Sustainability':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            🌿 {t.campaignFilters.typeCsr}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            💎 {t.campaignFilters.typeThematic}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex justify-center items-start p-3 sm:p-6 pt-6 sm:pt-10 md:pt-14 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[85vh] md:max-h-[660px] flex flex-col overscroll-contain overflow-hidden">
        {/* Modal Fixed Header */}
        <div className="p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-800/80 flex-shrink-0 z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black border border-slate-200 dark:border-slate-700">
                📅 {campaign.month} {campaign.year}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950 text-buzz dark:text-orange-300 text-xs font-black border border-orange-200 dark:border-orange-900">
                {campaign.category}
              </span>
              {renderTypeBadge(campaign.campaignType)}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {campaign.brand} – <span className="text-buzz">{campaign.campaign}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1 overscroll-contain">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-buzz mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">Buzz Volume</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatNum(campaign.buzzVolume)}</p>
              {categoryBenchmark && (
                <div className="mt-1">
                  {renderDiffBadge(campaign.buzzVolume, categoryBenchmark.avgBuzz)}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">BSI Score</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatNum(campaign.bsi)}</p>
              {categoryBenchmark && (
                <div className="mt-1">
                  {renderDiffBadge(campaign.bsi, categoryBenchmark.avgBSI)}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">AVG CFQU</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatNum(campaign.contentQU)}</p>
              {categoryBenchmark && (
                <div className="mt-1">
                  {renderDiffBadge(campaign.contentQU, categoryBenchmark.avgContentQU)}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-rose-500 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">Sentiment Index</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{campaign.sentiment.toFixed(2)}</p>
              {categoryBenchmark && (
                <div className="mt-1">
                  {renderDiffBadge(campaign.sentiment, categoryBenchmark.avgSentiment)}
                </div>
              )}
            </div>
          </div>

          {/* Industry Benchmark Radar & Table Section */}
          {categoryBenchmark && (
            <div className="p-5 bg-orange-50/40 dark:bg-orange-950/20 rounded-2xl border border-orange-200/80 dark:border-orange-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-buzz" />
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.campaignDetail.compareWithAvg(campaign.category)}
                  </h4>
                </div>

                {/* View Mode Toggle: Radar Spider Chart vs Details Table */}
                <div className="flex items-center gap-2">
                  <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-sm">
                    <button
                      onClick={() => setViewMode('radar')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        viewMode === 'radar'
                          ? 'bg-buzz text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>{t.campaignDetail.radarViewBtn}</span>
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        viewMode === 'table'
                          ? 'bg-buzz text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>{t.campaignDetail.tableViewBtn}</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950 text-buzz px-2.5 py-1 rounded-full border border-orange-300 dark:border-orange-800">
                    {t.campaignDetail.campaignsInCategory(categoryBenchmark.count)}
                  </span>
                </div>
              </div>

              {/* View Option 1: Radar Spider Chart */}
              {viewMode === 'radar' && radarChartData && (
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 text-center">
                    {t.campaignDetail.radarSubtitle}
                  </p>
                  <div className="h-72 flex justify-center items-center">
                    <Radar data={radarChartData} options={radarOptions} />
                  </div>
                </div>
              )}

              {/* View Option 2: Detail Table (Full 7 Metrics) */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-orange-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        <th className="py-2">{t.campaignDetail.colMetric}</th>
                        <th className="py-2 text-right">{t.campaignDetail.colThisCampaign}</th>
                        <th className="py-2 text-right">{t.campaignDetail.colIndustryAvg(campaign.category)}</th>
                        <th className="py-2 text-center">{t.campaignDetail.colDiff}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100 dark:divide-slate-800 font-bold">
                      <tr className="bg-orange-50/30 dark:bg-orange-950/20">
                        <td className="py-2 text-slate-900 dark:text-white">% Earned Media</td>
                        <td className="py-2 text-right text-buzz font-black">{campaign.earnedPct.toFixed(1)}%</td>
                        <td className="py-2 text-right text-slate-500">{categoryBenchmark.avgEarnedPct.toFixed(1)}%</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.earnedPct, categoryBenchmark.avgEarnedPct)}</td>
                      </tr>
                      <tr className="bg-orange-50/30 dark:bg-orange-950/20">
                        <td className="py-2 text-slate-900 dark:text-white">Relevancy Score</td>
                        <td className="py-2 text-right text-buzz font-black">{campaign.relevancy.toFixed(2)}</td>
                        <td className="py-2 text-right text-slate-500">{categoryBenchmark.avgRelevancy.toFixed(2)}</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.relevancy, categoryBenchmark.avgRelevancy)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-900 dark:text-white">AVG CFQU</td>
                        <td className="py-2 text-right font-black">{formatNum(campaign.contentQU)}</td>
                        <td className="py-2 text-right text-slate-500">{formatNum(categoryBenchmark.avgContentQU)}</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.contentQU, categoryBenchmark.avgContentQU)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-900 dark:text-white">Average QU</td>
                        <td className="py-2 text-right font-black">{formatNum(campaign.quUser)}</td>
                        <td className="py-2 text-right text-slate-500">{formatNum(categoryBenchmark.avgQUUser)}</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.quUser, categoryBenchmark.avgQUUser)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-900 dark:text-white">Sentiment Index</td>
                        <td className="py-2 text-right font-black">{campaign.sentiment.toFixed(2)}</td>
                        <td className="py-2 text-right text-slate-500">{categoryBenchmark.avgSentiment.toFixed(2)}</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.sentiment, categoryBenchmark.avgSentiment)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-900 dark:text-white">Buzz Volume</td>
                        <td className="py-2 text-right text-buzz font-black">{formatNum(campaign.buzzVolume)}</td>
                        <td className="py-2 text-right text-slate-500">{formatNum(categoryBenchmark.avgBuzz)}</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.buzzVolume, categoryBenchmark.avgBuzz)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-900 dark:text-white">BSI Score</td>
                        <td className="py-2 text-right text-buzz font-black">{formatNum(campaign.bsi)}</td>
                        <td className="py-2 text-right text-slate-500">{formatNum(categoryBenchmark.avgBSI)}</td>
                        <td className="py-2 text-center">{renderDiffBadge(campaign.bsi, categoryBenchmark.avgBSI)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Channel Share Section */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-buzz" /> {t.campaignDetail.channelDistTitle}
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-sky-600 dark:text-sky-400">{t.campaignDetail.earnedMediaTitle}</span>
                  <span>{campaign.earnedPct.toFixed(2)}% ({formatNum(campaign.earned)})</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${Math.min(campaign.earnedPct, 100)}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400 block mb-0.5">{t.campaignDetail.paidMediaTitle}</span>
                  <span className="text-sm font-black">{formatNum(campaign.paid)}</span>
                </div>
                <div>
                  <span className="text-rose-500 block mb-0.5">{t.campaignDetail.ownedMediaTitle}</span>
                  <span className="text-sm font-black">{formatNum(campaign.owned)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
