import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { CampaignRecord, BrandStat } from '../types/dashboard';
import { formatNum } from '../utils/brandStandardizer';

interface TopBrandsTableProps {
  data: CampaignRecord[];
}

export const TopBrandsTable: React.FC<TopBrandsTableProps> = ({ data }) => {
  const topBrands: BrandStat[] = React.useMemo(() => {
    const brandStats: Record<string, { bsi: number; count: number; buzzVolume: number }> = {};

    data.forEach(d => {
      if (!brandStats[d.brand]) {
        brandStats[d.brand] = { bsi: 0, count: 0, buzzVolume: 0 };
      }
      brandStats[d.brand].bsi += d.bsi;
      brandStats[d.brand].count += 1;
      brandStats[d.brand].buzzVolume += d.buzzVolume;
    });

    return Object.entries(brandStats)
      .map(([brand, stat]) => ({
        brand,
        bsi: stat.bsi,
        count: stat.count,
        buzzVolume: stat.buzzVolume,
      }))
      .sort((a, b) => b.bsi - a.bsi)
      .slice(0, 5);
  }, [data]);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-buzz" /> Top 5 Thương Hiệu BSI Cao Nhất
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-2.5 text-center w-8">#</th>
                <th className="p-2.5">Thương hiệu</th>
                <th className="p-2.5 text-right">Tổng BSI</th>
                <th className="p-2.5 text-right">Campaigns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-black text-slate-900 dark:text-slate-100">
              {topBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 font-normal">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                topBrands.map((item, idx) => (
                  <tr
                    key={item.brand}
                    className="hover:bg-orange-50/60 dark:hover:bg-slate-800/60 transition"
                  >
                    <td className="p-2.5 text-center font-black text-buzz">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-[10px]">
                          1
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="p-2.5 font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {item.brand}
                    </td>
                    <td className="p-2.5 text-right font-black text-amber-600 dark:text-amber-400">
                      {formatNum(item.bsi)}
                    </td>
                    <td className="p-2.5 text-right font-black text-slate-700 dark:text-slate-300">
                      {item.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-4 text-right">
        *Xếp hạng theo tổng điểm BSI trong khoảng lọc
      </p>
    </div>
  );
};
