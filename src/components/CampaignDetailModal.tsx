import React, { useMemo } from 'react';
import { X, Award, BarChart2, PieChart, Smile, Target, Calendar, Share2, TrendingUp, TrendingDown, Minus, Layers } from 'lucide-react';
import { CampaignRecord, CategoryBenchmark } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface CampaignDetailModalProps {
  campaign: CampaignRecord | null;
  allData: CampaignRecord[];
  onClose: () => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, allData, onClose }) => {
  if (!campaign) return null;

  // Calculate Category Benchmark for this campaign's specific category
  const categoryBenchmark: CategoryBenchmark | null = useMemo(() => {
    const categoryRecords = allData.filter(d => d.category === campaign.category);
    const count = categoryRecords.length;
    if (count === 0) return null;

    return {
      category: campaign.category,
      totalCampaigns: count,
      avgBuzz: categoryRecords.reduce((a, b) => a + b.buzzVolume, 0) / count,
      avgBSI: categoryRecords.reduce((a, b) => a + b.bsi, 0) / count,
      avgContentQU: categoryRecords.reduce((a, b) => a + b.contentQU, 0) / count,
      avgQUUser: categoryRecords.reduce((a, b) => a + b.quUser, 0) / count,
      avgSentiment: categoryRecords.reduce((a, b) => a + b.sentiment, 0) / count,
      avgRelevancy: categoryRecords.reduce((a, b) => a + b.relevancy, 0) / count,
      avgEarnedPct: categoryRecords.reduce((a, b) => a + b.earnedPct, 0) / count,
    };
  }, [campaign, allData]);

  const totalShare = campaign.earned + campaign.paid + campaign.owned;
  const earnedShare = totalShare > 0 ? ((campaign.earned / totalShare) * 100).toFixed(1) : '0';
  const paidShare = totalShare > 0 ? ((campaign.paid / totalShare) * 100).toFixed(1) : '0';
  const ownedShare = totalShare > 0 ? ((campaign.owned / totalShare) * 100).toFixed(1) : '0';

  // Helper to render comparison diff badge vs category benchmark
  const renderDiffBadge = (val: number, avgVal: number, isPercent = false) => {
    if (!avgVal || avgVal === 0) return null;
    const diffPct = ((val - avgVal) / avgVal) * 100;
    const isHigher = diffPct > 0;
    const isNeutral = Math.abs(diffPct) < 0.5;

    if (isNeutral) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
          <Minus className="w-2.5 h-2.5" /> Ngang TB ngành
        </span>
      );
    }

    return isHigher ? (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
        <TrendingUp className="w-2.5 h-2.5" /> +{diffPct.toFixed(1)}% vs TB ngành
      </span>
    ) : (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 px-1.5 py-0.5 rounded">
        <TrendingDown className="w-2.5 h-2.5" /> {diffPct.toFixed(1)}% vs TB ngành
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-buzz text-white">
                {campaign.category}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-buzz" /> {campaign.month} {campaign.year}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {campaign.campaign}
            </h2>
            <p className="text-xs font-bold text-buzz mt-0.5">
              Thương hiệu: {campaign.brand}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 md:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-orange-50/60 dark:bg-slate-800/80 rounded-xl border border-orange-200 dark:border-slate-700 text-center flex flex-col justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase">Buzz Volume</p>
              <p className="text-lg font-black text-buzz mt-1">{formatNum(campaign.buzzVolume)}</p>
              {categoryBenchmark && renderDiffBadge(campaign.buzzVolume, categoryBenchmark.avgBuzz)}
            </div>

            <div className="p-3.5 bg-amber-50/60 dark:bg-slate-800/80 rounded-xl border border-amber-200 dark:border-slate-700 text-center flex flex-col justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase">BSI Score</p>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1">{formatNum(campaign.bsi)}</p>
              {categoryBenchmark && renderDiffBadge(campaign.bsi, categoryBenchmark.avgBSI)}
            </div>

            <div className="p-3.5 bg-emerald-50/60 dark:bg-slate-800/80 rounded-xl border border-emerald-200 dark:border-slate-700 text-center flex flex-col justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase">% Earned</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatNum(campaign.earnedPct, 2)}%</p>
              {categoryBenchmark && renderDiffBadge(campaign.earnedPct, categoryBenchmark.avgEarnedPct, true)}
            </div>

            <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase">Sentiment</p>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{formatNum(campaign.sentiment, 2)}</p>
              {categoryBenchmark && renderDiffBadge(campaign.sentiment, categoryBenchmark.avgSentiment)}
            </div>
          </div>

          {/* DEDICATED CATEGORY BENCHMARK COMPARISON TABLE */}
          {categoryBenchmark && (
            <div className="p-4 bg-orange-50/40 dark:bg-slate-800/40 rounded-xl border border-orange-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-buzz" /> Bảng So Sánh Chỉ Số Với Benchmark Ngành: <span className="text-buzz uppercase">{campaign.category}</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {categoryBenchmark.totalCampaigns} Campaign trong ngành
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-black">
                    <tr>
                      <th className="p-2.5">Chỉ số</th>
                      <th className="p-2.5 text-right">Chiến dịch này</th>
                      <th className="p-2.5 text-right">TB Ngành {campaign.category}</th>
                      <th className="p-2.5 text-center">Chênh lệch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60 font-bold">
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">Buzz Volume</td>
                      <td className="p-2.5 text-right font-black text-buzz">{formatNum(campaign.buzzVolume)}</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(Math.round(categoryBenchmark.avgBuzz))}</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.buzzVolume, categoryBenchmark.avgBuzz)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">BSI Score</td>
                      <td className="p-2.5 text-right font-black text-amber-600 dark:text-amber-400">{formatNum(campaign.bsi)}</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(Math.round(categoryBenchmark.avgBSI))}</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.bsi, categoryBenchmark.avgBSI)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">Content QU</td>
                      <td className="p-2.5 text-right font-bold">{formatNum(campaign.contentQU)}</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(Math.round(categoryBenchmark.avgContentQU))}</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.contentQU, categoryBenchmark.avgContentQU)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">QU User Count</td>
                      <td className="p-2.5 text-right font-bold">{formatNum(campaign.quUser)}</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(Math.round(categoryBenchmark.avgQUUser))}</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.quUser, categoryBenchmark.avgQUUser)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">Sentiment Index</td>
                      <td className="p-2.5 text-right font-bold text-buzz">{formatNum(campaign.sentiment, 2)}</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(categoryBenchmark.avgSentiment, 2)}</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.sentiment, categoryBenchmark.avgSentiment)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">Relevancy Score</td>
                      <td className="p-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{formatNum(campaign.relevancy, 2)}</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(categoryBenchmark.avgRelevancy, 2)}</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.relevancy, categoryBenchmark.avgRelevancy)}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">% Earned Media</td>
                      <td className="p-2.5 text-right font-black text-emerald-600 dark:text-emerald-400">{formatNum(campaign.earnedPct, 2)}%</td>
                      <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">{formatNum(categoryBenchmark.avgEarnedPct, 2)}%</td>
                      <td className="p-2.5 text-center">{renderDiffBadge(campaign.earnedPct, categoryBenchmark.avgEarnedPct, true)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Channel Share Breakdown Progress Bars */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase mb-3 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-buzz" /> Kênh Thảo Luận Media Breakdown
            </h4>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-media-earned">Earned Media ({formatNum(campaign.earned)})</span>
                  <span className="text-slate-700 dark:text-slate-300">{earnedShare}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#7CAAD9] h-full rounded-full" style={{ width: `${earnedShare}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-media-paid">Paid Media ({formatNum(campaign.paid)})</span>
                  <span className="text-slate-700 dark:text-slate-300">{paidShare}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2BB59B] h-full rounded-full" style={{ width: `${paidShare}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-media-owned">Owned Media ({formatNum(campaign.owned)})</span>
                  <span className="text-slate-700 dark:text-slate-300">{ownedShare}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#F57888] h-full rounded-full" style={{ width: `${ownedShare}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-buzz text-white text-xs font-black rounded-xl hover:bg-buzz-hover transition shadow-sm"
          >
            Đóng Chi Tiết
          </button>
        </div>
      </div>
    </div>
  );
};
