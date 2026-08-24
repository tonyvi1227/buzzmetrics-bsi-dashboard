import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';
import { CategoryBenchmark } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface CategoryBenchmarkPanelProps {
  categoryBenchmark: CategoryBenchmark | null;
  selectedCategoryName: string;
}

export const CategoryBenchmarkPanel: React.FC<CategoryBenchmarkPanelProps> = ({
  categoryBenchmark,
  selectedCategoryName,
}) => {
  if (!categoryBenchmark || selectedCategoryName === 'ALL') {
    return null;
  }

  return (
    <div className="glass-card border-2 border-buzz/40 dark:border-buzz/60 rounded-2xl p-5 mb-6 shadow-md bg-gradient-to-r from-orange-50/50 via-white to-orange-50/20 dark:from-slate-900 dark:via-slate-900/95 dark:to-orange-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-buzz text-white rounded-xl shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Dedicated Industry Benchmark: <span className="text-buzz uppercase">{selectedCategoryName}</span>
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Category-specific benchmark metrics & performance baseline
            </p>
          </div>
        </div>
        <span className="text-xs font-black bg-buzz text-white px-3 py-1 rounded-full shadow-sm">
          {categoryBenchmark.totalCampaigns} Campaigns in Category
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-orange-100/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase">
            <tr>
              <th className="p-3 rounded-l-xl">Category</th>
              <th className="p-3 text-right">Campaigns</th>
              <th className="p-3 text-right">Avg Buzz Vol</th>
              <th className="p-3 text-right">Avg BSI Score</th>
              <th className="p-3 text-right">Avg CFQU</th>
              <th className="p-3 text-right">Avg QU</th>
              <th className="p-3 text-right">Avg Sentiment</th>
              <th className="p-3 text-right">Avg Relevancy</th>
              <th className="p-3 text-right rounded-r-xl">Avg % Earned</th>
            </tr>
          </thead>
          <tbody className="font-extrabold text-slate-900 dark:text-slate-100">
            <tr className="border-b border-orange-200/60 dark:border-slate-800">
              <td className="p-3 font-black text-buzz">
                {categoryBenchmark.category}
              </td>
              <td className="p-3 text-right font-black">
                {categoryBenchmark.totalCampaigns}
              </td>
              <td className="p-3 text-right font-black text-buzz">
                {formatNum(Math.round(categoryBenchmark.avgBuzz))}
              </td>
              <td className="p-3 text-right font-black text-amber-600 dark:text-amber-400">
                {formatNum(Math.round(categoryBenchmark.avgBSI))}
              </td>
              <td className="p-3 text-right font-bold">
                {formatNum(Math.round(categoryBenchmark.avgContentQU))}
              </td>
              <td className="p-3 text-right font-bold">
                {formatNum(Math.round(categoryBenchmark.avgQUUser))}
              </td>
              <td className="p-3 text-right font-bold text-buzz">
                {formatNum(categoryBenchmark.avgSentiment, 2)}
              </td>
              <td className="p-3 text-right font-bold text-amber-600 dark:text-amber-400">
                {formatNum(categoryBenchmark.avgRelevancy, 2)}
              </td>
              <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                {formatNum(categoryBenchmark.avgEarnedPct, 2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
