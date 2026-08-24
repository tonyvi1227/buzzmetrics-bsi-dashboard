import React, { useMemo } from 'react';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { CampaignRecord } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';
import { InfoTooltip } from './common/InfoTooltip';
import { useAdmin } from '../context/AdminContext';
import { isUserUnlocked, isInternalUnlocked } from '../utils/abTestingEngine';

interface TopBrandsTableProps {
  data: CampaignRecord[];
  isUnlocked?: boolean;
}

export const TopBrandsTable: React.FC<TopBrandsTableProps> = ({ data, isUnlocked = false }) => {
  const { isAdmin } = useAdmin();
  const showFormula = isAdmin || isUnlocked || isUserUnlocked() || isInternalUnlocked();

  const topBrands = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Step 1: Group campaigns by month & year to compute monthly rank
    const monthGroups: Record<string, CampaignRecord[]> = {};
    data.forEach(d => {
      const key = `${d.year}-${d.month}`;
      if (!monthGroups[key]) monthGroups[key] = [];
      monthGroups[key].push(d);
    });

    const campaignsWithRank: { campaign: CampaignRecord; monthRank: number }[] = [];
    Object.values(monthGroups).forEach(group => {
      const sorted = [...group].sort((a, b) => b.bsi - a.bsi);
      sorted.forEach((item, idx) => {
        campaignsWithRank.push({
          campaign: item,
          monthRank: idx + 1,
        });
      });
    });

    // Step 2: Aggregate by brand
    const brandMap: Record<
      string,
      {
        brand: string;
        totalBSI: number;
        totalBuzz: number;
        count: number;
        distinctMonths: Set<string>;
        ranks: number[];
      }
    > = {};

    campaignsWithRank.forEach(({ campaign: d, monthRank }) => {
      if (!brandMap[d.brand]) {
        brandMap[d.brand] = {
          brand: d.brand,
          totalBSI: 0,
          totalBuzz: 0,
          count: 0,
          distinctMonths: new Set<string>(),
          ranks: [],
        };
      }
      brandMap[d.brand].totalBSI += d.bsi;
      brandMap[d.brand].totalBuzz += d.buzzVolume;
      brandMap[d.brand].count += 1;
      brandMap[d.brand].distinctMonths.add(`${d.year}-${d.month}`);
      brandMap[d.brand].ranks.push(monthRank);
    });

    const rawBrandList = Object.values(brandMap).map(b => {
      const avgBSI = Math.round(b.totalBSI / b.count);
      const avgBuzz = Math.round(b.totalBuzz / b.count);
      const monthsOnTop10 = b.distinctMonths.size;
      const avgRank = Number((b.ranks.reduce((acc, r) => acc + r, 0) / b.ranks.length).toFixed(1));
      const bestRank = Math.min(...b.ranks);

      return {
        brand: b.brand,
        totalBSI: b.totalBSI,
        totalBuzz: b.totalBuzz,
        count: b.count,
        avgBSI,
        avgBuzz,
        monthsOnTop10,
        avgRank,
        bestRank,
      };
    });

    // Require minimum 2 months on Top 10 if there are >= 5 qualifying brands, else fallback
    const qualifyingBrands = rawBrandList.filter(b => b.monthsOnTop10 >= 2);
    const brandList = qualifyingBrands.length >= 5 ? qualifyingBrands : rawBrandList;

    // Step 3: Compute min/max ranges for normalization
    const maxBSI = Math.max(...brandList.map(b => b.avgBSI), 1);
    const minBSI = Math.min(...brandList.map(b => b.avgBSI), 0);
    const maxMonths = Math.max(...brandList.map(b => b.monthsOnTop10), 1);
    const minMonths = Math.min(...brandList.map(b => b.monthsOnTop10), 0);
    const maxRank = Math.max(...brandList.map(b => b.avgRank), 10);
    const minRank = Math.min(...brandList.map(b => b.avgRank), 1);

    // Compute Weighted Score: 50% Avg BSI + 25% Avg Rank + 25% Months on Top 10
    const scoredBrands = brandList.map(b => {
      const normBsi = (b.avgBSI - minBSI) / (maxBSI - minBSI || 1);
      const normMonths = (b.monthsOnTop10 - minMonths) / (maxMonths - minMonths || 1);
      // Invert rank: lower rank number is better (Rank 1 -> 1.0)
      const normRank = maxRank === minRank ? 1 : 1 - (b.avgRank - minRank) / (maxRank - minRank);

      const compositeScore = normBsi * 0.50 + normRank * 0.25 + normMonths * 0.25;

      return {
        ...b,
        compositeScore,
      };
    });

    return scoredBrands
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 5); // Top 5 Brands
  }, [data]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span
          className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs inline-flex items-center justify-center shadow-sm border border-amber-200"
          title="Rank #1 Gold"
        >
          <Crown className="w-3 h-3 fill-current text-slate-950" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span
          className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-bold text-xs inline-flex items-center justify-center shadow border border-slate-300"
          title="Rank #2 Silver"
        >
          <Medal className="w-3 h-3 text-slate-900" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span
          className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-bold text-xs inline-flex items-center justify-center shadow border border-amber-600"
          title="Rank #3 Bronze"
        >
          <Award className="w-3 h-3 text-white" />
        </span>
      );
    }
    return <span className="text-slate-400 text-[11px] font-extrabold">{rank}</span>;
  };

  const tooltipText = showFormula
    ? "Top Brands Performance: 50% Avg BSI + 25% Avg Rank + 25% Months on Top 10 (Min 2 months on Top 10)."
    : "Leaderboard of top performing brands ranked by combined BSI performance, average ranking, and campaign consistency.";

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> TOP BRANDS RANKING
            <InfoTooltip
              title="Top Brands Ranking"
              content={tooltipText}
            />
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                <th className="py-2.5 pl-3 w-12 text-center">Rank</th>
                <th className="py-2.5 px-2">Brand</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap min-w-[90px]">Avg BSI</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap min-w-[130px]">Months on Top 10</th>
                <th className="py-2.5 pr-3 text-right whitespace-nowrap min-w-[80px]">Avg Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-bold">
              {topBrands.map((b, idx) => (
                <tr
                  key={b.brand}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="py-2.5 pl-3 text-center">{getRankBadge(idx + 1)}</td>
                  <td className="py-2.5 px-2 font-extrabold text-slate-900 dark:text-white truncate max-w-[160px]">
                    {b.brand}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-buzz tabular-nums whitespace-nowrap">
                    {formatNum(b.avgBSI)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      {b.monthsOnTop10} {b.monthsOnTop10 === 1 ? 'Month' : 'Months'}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-black text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                    #{b.avgRank}
                  </td>
                </tr>
              ))}
              {topBrands.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400 text-xs">
                    No brand data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
