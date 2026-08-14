import { useState, useMemo } from 'react';
import { CelebRecord, MonthlyCelebRankRecord, AggregatedCelebRecord, CelebFilterState, CelebBenchmarkMetrics } from '../types/celeb';

export const ALL_OPTION = 'Tất cả';

export function useCelebSmartFilters(rawDataset: CelebRecord[]) {
  const [filters, setFilters] = useState<CelebFilterState>({
    year: ALL_OPTION,
    month: ALL_OPTION,
    category: ALL_OPTION,
    search: '',
  });

  // Step 1: Pre-calculate monthly rankings for each year-month in the dataset
  const datasetWithRanks = useMemo<MonthlyCelebRankRecord[]>(() => {
    const monthGroups: Record<string, CelebRecord[]> = {};
    rawDataset.forEach(item => {
      const key = `${item.year}-${item.month}`;
      if (!monthGroups[key]) monthGroups[key] = [];
      monthGroups[key].push(item);
    });

    const result: MonthlyCelebRankRecord[] = [];

    Object.values(monthGroups).forEach(group => {
      // Sort by BSI descending to get monthly rank
      const sorted = [...group].sort((a, b) => b.bsi - a.bsi);
      sorted.forEach((item, index) => {
        result.push({
          ...item,
          monthRank: index + 1,
        });
      });
    });

    return result;
  }, [rawDataset]);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(rawDataset.map(d => d.year))).sort((a, b) => b.localeCompare(a));
    return [ALL_OPTION, ...years];
  }, [rawDataset]);

  const availableMonths = useMemo(() => {
    let filtered = rawDataset;
    if (filters.year !== ALL_OPTION) {
      filtered = filtered.filter(d => d.year === filters.year);
    }
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = Array.from(new Set(filtered.map(d => d.month)));
    return [ALL_OPTION, ...months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))];
  }, [rawDataset, filters.year]);

  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(rawDataset.map(d => d.category))).filter(Boolean).sort();
    return [ALL_OPTION, ...cats];
  }, [rawDataset]);

  // Step 2: Filter monthly rank records based on selected Year, Month, Category
  const filteredMonthlyRecords = useMemo(() => {
    return datasetWithRanks.filter(item => {
      if (filters.year !== ALL_OPTION && item.year !== filters.year) return false;
      if (filters.month !== ALL_OPTION && item.month !== filters.month) return false;
      if (filters.category !== ALL_OPTION && item.category !== filters.category) return false;
      return true;
    });
  }, [datasetWithRanks, filters]);

  // Step 3: Aggregate records by celebName for multi-month views
  const aggregatedCelebs = useMemo<AggregatedCelebRecord[]>(() => {
    const groups: Record<string, MonthlyCelebRankRecord[]> = {};

    filteredMonthlyRecords.forEach(item => {
      const name = item.celebName.trim();
      if (!groups[name]) groups[name] = [];
      groups[name].push(item);
    });

    const aggregatedList: AggregatedCelebRecord[] = Object.entries(groups).map(([name, records]) => {
      const count = records.length;
      const totalBsi = records.reduce((sum, r) => sum + r.bsi, 0);
      const totalBuzz = records.reduce((sum, r) => sum + r.buzzVolume, 0);
      const totalContentQU = records.reduce((sum, r) => sum + r.contentQU, 0);
      const totalQuUser = records.reduce((sum, r) => sum + r.quUser, 0);
      const totalSentiment = records.reduce((sum, r) => sum + r.sentiment, 0);
      const totalRelevancy = records.reduce((sum, r) => sum + (r.relevancy || 0), 0);

      const avgRank = records.reduce((sum, r) => sum + r.monthRank, 0) / count;
      const bestRank = Math.min(...records.map(r => r.monthRank));

      return {
        celebName: name,
        category: records[0].category || 'Khác',
        totalAppearances: count,
        avgRank: Number(avgRank.toFixed(1)),
        bestRank,
        avgBsi: Math.round(totalBsi / count),
        totalBsi,
        avgBuzz: Math.round(totalBuzz / count),
        avgContentQU: Math.round(totalContentQU / count),
        avgQuUser: Math.round(totalQuUser / count),
        avgSentiment: Number((totalSentiment / count).toFixed(2)),
        avgRelevancy: Math.round(totalRelevancy / count),
        monthlyRecords: records.sort((a, b) => b.year.localeCompare(a.year) || a.month.localeCompare(b.month)),
      };
    });

    // Apply Search Filter
    let result = aggregatedList;
    if (filters.search && filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(c => c.celebName.toLowerCase().includes(query) || c.category.toLowerCase().includes(query));
    }

    return result.sort((a, b) => {
      if (b.totalAppearances !== a.totalAppearances) return b.totalAppearances - a.totalAppearances;
      return a.avgRank - b.avgRank;
    });
  }, [filteredMonthlyRecords, filters.search]);

  // Step 4: Compute Benchmark Metrics
  const benchmarkMetrics = useMemo<CelebBenchmarkMetrics>(() => {
    const totalCount = aggregatedCelebs.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        topCeleb: 'N/A',
        topBsi: 0,
        avgBsi: 0,
        avgBuzz: 0,
        avgContentQU: 0,
        avgQuUser: 0,
        avgSentiment: 0,
        avgRelevancy: 0,
      };
    }

    const topCelebObj = [...aggregatedCelebs].sort((a, b) => b.avgBsi - a.avgBsi)[0];
    const avgBsi = Math.round(aggregatedCelebs.reduce((sum, c) => sum + c.avgBsi, 0) / totalCount);
    const avgBuzz = Math.round(aggregatedCelebs.reduce((sum, c) => sum + c.avgBuzz, 0) / totalCount);
    const avgContentQU = Math.round(aggregatedCelebs.reduce((sum, c) => sum + c.avgContentQU, 0) / totalCount);
    const avgQuUser = Math.round(aggregatedCelebs.reduce((sum, c) => sum + c.avgQuUser, 0) / totalCount);
    const avgSentiment = Number((aggregatedCelebs.reduce((sum, c) => sum + c.avgSentiment, 0) / totalCount).toFixed(2));
    const avgRelevancy = Math.round(aggregatedCelebs.reduce((sum, c) => sum + c.avgRelevancy, 0) / totalCount);

    return {
      totalCount,
      topCeleb: topCelebObj ? topCelebObj.celebName : 'N/A',
      topBsi: topCelebObj ? topCelebObj.avgBsi : 0,
      avgBsi,
      avgBuzz,
      avgContentQU,
      avgQuUser,
      avgSentiment,
      avgRelevancy,
    };
  }, [aggregatedCelebs]);

  const updateFilter = (key: keyof CelebFilterState, value: string) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'year') {
        updated.month = ALL_OPTION;
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({
      year: ALL_OPTION,
      month: ALL_OPTION,
      category: ALL_OPTION,
      search: '',
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    availableYears,
    availableMonths,
    availableCategories,
    filteredMonthlyRecords,
    aggregatedCelebs,
    benchmarkMetrics,
  };
}
