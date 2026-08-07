import { useState, useMemo } from 'react';
import { CelebRecord, MonthlyCelebRankRecord, AggregatedCelebRecord, CelebFilterState } from '../types/celeb';

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
    
    const monthOrder: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };

    const months = Array.from(new Set(filtered.map(d => d.month))).sort(
      (a, b) => (monthOrder[a] || 99) - (monthOrder[b] || 99)
    );
    return [ALL_OPTION, ...months];
  }, [rawDataset, filters.year]);

  const availableCategories = useMemo(() => {
    let filtered = rawDataset;
    if (filters.year !== ALL_OPTION) {
      filtered = filtered.filter(d => d.year === filters.year);
    }
    if (filters.month !== ALL_OPTION) {
      filtered = filtered.filter(d => d.month === filters.month);
    }
    const categories = Array.from(new Set(filtered.map(d => d.category))).sort();
    return [ALL_OPTION, ...categories];
  }, [rawDataset, filters.year, filters.month]);

  // Filter raw monthly rank records based on selected filter state
  const filteredMonthlyRecords = useMemo(() => {
    return datasetWithRanks.filter(item => {
      if (filters.year !== ALL_OPTION && item.year !== filters.year) return false;
      if (filters.month !== ALL_OPTION && item.month !== filters.month) return false;
      if (filters.category !== ALL_OPTION && item.category !== filters.category) return false;
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        const nameMatch = item.celebName.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);
        if (!nameMatch && !categoryMatch) return false;
      }
      return true;
    });
  }, [datasetWithRanks, filters]);

  // Step 2: Aggregate by Celeb Name
  const aggregatedCelebs = useMemo<AggregatedCelebRecord[]>(() => {
    const celebGroupMap: Record<string, MonthlyCelebRankRecord[]> = {};

    filteredMonthlyRecords.forEach(record => {
      const name = record.celebName;
      if (!celebGroupMap[name]) {
        celebGroupMap[name] = [];
      }
      celebGroupMap[name].push(record);
    });

    const aggregatedList: AggregatedCelebRecord[] = Object.entries(celebGroupMap).map(([celebName, records]) => {
      const count = records.length;
      const category = records[0].category;

      const sumRank = records.reduce((a, b) => a + b.monthRank, 0);
      const avgRank = Number((sumRank / count).toFixed(1));
      const bestRank = Math.min(...records.map(r => r.monthRank));

      const sumBsi = records.reduce((a, b) => a + b.bsi, 0);
      const avgBsi = Math.round(sumBsi / count);

      const sumBuzz = records.reduce((a, b) => a + b.buzzVolume, 0);
      const avgBuzz = Math.round(sumBuzz / count);

      const sumContentQU = records.reduce((a, b) => a + b.contentQU, 0);
      const avgContentQU = Math.round(sumContentQU / count);

      const sumQuUser = records.reduce((a, b) => a + b.quUser, 0);
      const avgQuUser = Math.round(sumQuUser / count);

      const sumSentiment = records.reduce((a, b) => a + b.sentiment, 0);
      const avgSentiment = Number((sumSentiment / count).toFixed(2));

      const sumRelevancy = records.reduce((a, b) => a + b.relevancy, 0);
      const avgRelevancy = Number((sumRelevancy / count).toFixed(4));

      return {
        celebName,
        category,
        totalAppearances: count,
        avgRank,
        bestRank,
        avgBsi,
        totalBsi: sumBsi,
        avgBuzz,
        avgContentQU,
        avgQuUser,
        avgSentiment,
        avgRelevancy,
        monthlyRecords: records.sort((a, b) => b.year.localeCompare(a.year) || a.month.localeCompare(b.month)),
      };
    });

    // Default sorting: Order by totalAppearances descending, then avgRank ascending (lower rank number = better)
    return aggregatedList.sort((a, b) => {
      if (b.totalAppearances !== a.totalAppearances) {
        return b.totalAppearances - a.totalAppearances;
      }
      if (a.avgRank !== b.avgRank) {
        return a.avgRank - b.avgRank;
      }
      return b.avgBsi - a.avgBsi;
    });
  }, [filteredMonthlyRecords]);

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
  };
}
