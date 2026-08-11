import React, { useMemo } from 'react';
import { X, Trophy, MessageSquare, Heart, ThumbsUp, Layers, Tag, Share2, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CampaignRecord } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface CampaignDetailModalProps {
  campaign: CampaignRecord | null;
  allData: CampaignRecord[];
  onClose: () => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, allData, onClose }) => {
  if (!campaign) return null;

  // Compute Category Average Benchmark for Comparison
  const categoryBenchmark = useMemo(() => {
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

  const renderDiffBadge = (val: number, avgVal: number, isPct = false) => {
    if (!avgVal || avgVal === 0) return null;
    const diffPct = ((val - avgVal) / avgVal) * 100;
    const formattedDiff = Math.abs(diffPct).toFixed(1);

    if (diffPct > 0.5) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <TrendingUp className="w-3 h-3" /> +{formattedDiff}% vs TB ngành
        </span>
      );
    } else if (diffPct < -0.5) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
          <TrendingDown className="w-3 h-3" /> -{formattedDiff}% vs TB ngành
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
          <Minus className="w-3 h-3" /> Ngang TB ngành
        </span>
      );
    }
  };

  const renderTypeBadge = (type?: string) => {
    switch (type) {
      case 'Product Launch & Rebranding':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            🚀 Product Launch
          </span>
        );
      case 'Sponsor & Event':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            🎭 Sponsor & Event
          </span>
        );
      case 'Promotion':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            🎁 Promotion
          </span>
        );
      case 'CSR & Sustainability':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            🌿 CSR & Sustainability
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            💎 Thematic & Brand Building
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 backdrop-blur-md z-10">
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
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-buzz mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">Buzz Volume</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatNum(campaign.buzzVolume)}</p>
              {categoryBenchmark && <div className="mt-1.5">{renderDiffBadge(campaign.buzzVolume, categoryBenchmark.avgBuzz)}</div>}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-buzz mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">BSI Score</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatNum(campaign.bsi)}</p>
              {categoryBenchmark && <div className="mt-1.5">{renderDiffBadge(campaign.bsi, categoryBenchmark.avgBSI)}</div>}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-buzz mb-1">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">Content QU</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatNum(campaign.contentQU)}</p>
              {categoryBenchmark && <div className="mt-1.5">{renderDiffBadge(campaign.contentQU, categoryBenchmark.avgContentQU)}</div>}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-buzz mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">Sentiment Index</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{campaign.sentiment.toFixed(2)}</p>
              {categoryBenchmark && <div className="mt-1.5">{renderDiffBadge(campaign.sentiment, categoryBenchmark.avgSentiment)}</div>}
            </div>
          </div>

          {/* Benchmark Comparison Table */}
          {categoryBenchmark && (
            <div className="p-5 bg-orange-50/50 dark:bg-slate-800/40 rounded-2xl border border-orange-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-buzz" /> Bảng So Sánh Chỉ Số Với Trung Bình Ngành {campaign.category}
                </h4>
                <span className="text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950 text-buzz px-2.5 py-0.5 rounded-full border border-orange-300 dark:border-orange-800">
                  {categoryBenchmark.count} Chiến dịch trong ngành
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-orange-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                      <th className="py-2">Chỉ Số Phân Tích</th>
                      <th className="py-2 text-right">Chiến Dịch Này</th>
                      <th className="py-2 text-right">TB Ngành {campaign.category}</th>
                      <th className="py-2 text-center">Chênh Lệch (Diff)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100 dark:divide-slate-800 font-bold">
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
                    <tr>
                      <td className="py-2 text-slate-900 dark:text-white">Content QU (CFQU)</td>
                      <td className="py-2 text-right font-black">{formatNum(campaign.contentQU)}</td>
                      <td className="py-2 text-right text-slate-500">{formatNum(categoryBenchmark.avgContentQU)}</td>
                      <td className="py-2 text-center">{renderDiffBadge(campaign.contentQU, categoryBenchmark.avgContentQU)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-900 dark:text-white">QU User</td>
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
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Channel Share Section */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-buzz" /> Phân Bổ Kênh Thảo Luận (Channel Distribution)
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-sky-600 dark:text-sky-400">Earned Media (Thảo luận tự nhiên)</span>
                  <span>{campaign.earnedPct.toFixed(2)}% ({formatNum(campaign.earned)})</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${Math.min(campaign.earnedPct, 100)}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400 block mb-0.5">Paid Media (Quảng cáo trả phí)</span>
                  <span className="text-sm font-black">{formatNum(campaign.paid)}</span>
                </div>
                <div>
                  <span className="text-rose-500 block mb-0.5">Owned Media (Kênh chính chủ)</span>
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
