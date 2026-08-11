import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { CampaignRecord } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface TopBrandsTableProps {
  data: CampaignRecord[];
}

export const TopBrandsTable: React.FC<TopBrandsTableProps> = ({ data }) => {
  const topBrands = useMemo(() => {
    const brandMap: Record<string, { brand: string; totalBSI: number; totalBuzz: number; count: number }> = {};

    data.forEach(d => {
      if (!brandMap[d.brand]) {
        brandMap[d.brand] = { brand: d.brand, totalBSI: 0, totalBuzz: 0, count: 0 };
      }
      brandMap[d.brand].totalBSI += d.bsi;
      brandMap[d.brand].totalBuzz += d.buzzVolume;
      brandMap[d.brand].count += 1;
    });

    return Object.values(brandMap)
      .sort((a, b) => b.totalBSI - a.totalBSI)
      .slice(0, 5); // Top 5 Brands by BSI
  }, [data]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Bảng Xếp Hạng Top 5 Thương Hiệu Hàng Đầu
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                <th className="py-2 pl-2">Hạng</th>
                <th className="py-2">Thương Hiệu</th>
                <th className="py-2 text-right">Tổng BSI</th>
                <th className="py-2 text-right">Tổng Buzz</th>
                <th className="py-2 text-center">Số Camp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-bold">
              {topBrands.map((b, idx) => (
                <tr key={b.brand} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-2.5 pl-2 font-black">
                    {idx === 0 ? (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-white inline-flex items-center justify-center text-[10px]">1</span>
                    ) : idx === 1 ? (
                      <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 text-white inline-flex items-center justify-center text-[10px]">2</span>
                    ) : idx === 2 ? (
                      <span className="w-5 h-5 rounded-full bg-amber-700 text-white inline-flex items-center justify-center text-[10px]">3</span>
                    ) : (
                      <span className="text-slate-400 pl-1.5">{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-2.5 font-black text-slate-900 dark:text-white">{b.brand}</td>
                  <td className="py-2.5 text-right font-black text-buzz text-xs whitespace-nowrap">{formatNum(b.totalBSI)}</td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">{formatNum(b.totalBuzz)}</td>
                  <td className="py-2.5 text-center text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{b.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
