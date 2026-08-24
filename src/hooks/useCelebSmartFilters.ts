import { useState, useMemo, useCallback } from 'react';
import { CelebRecord, MonthlyCelebRankRecord, AggregatedCelebRecord, CelebFilterState, CelebBenchmarkMetrics, TopCelebHighlights } from '../types/celeb';
import { MONTH_ORDER, getMonthValue } from './useSmartFilters';

export const ALL_OPTION = 'ALL';

const initialCelebFilters: CelebFilterState = {
  category: ALL_OPTION,
  search: '',
  startYear: '2025',
  startMonth: 'Jan',
  endYear: '2026',
  endMonth: 'Jun',
  top10BsiOnly: true,
};

export function useCelebSmartFilters(rawDataset: CelebRecord[]) {
  const [filters, setFilters] = useState<CelebFilterState>(initialCelebFilters);

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
    const years = Array.from(new Set(rawDataset.map(d => d.year))).filter(Boolean);
    return years.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [rawDataset]);

  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(rawDataset.map(d => d.month))).filter(Boolean);
    return months.sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b));
  }, [rawDataset]);

  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(rawDataset.map(d => d.category))).filter(Boolean).sort();
    return cats;
  }, [rawDataset]);

  // Step 2: Filter monthly rank records based on Date Range & Category & top10BsiOnly
  const filteredMonthlyRecords = useMemo(() => {
    const startVal = getMonthValue(filters.startYear, filters.startMonth);
    const endVal = getMonthValue(filters.endYear, filters.endMonth);

    return datasetWithRanks.filter(item => {
      const itemVal = getMonthValue(item.year, item.month);
      if (itemVal < startVal || itemVal > endVal) return false;
      if (filters.category !== ALL_OPTION && item.category !== filters.category) return false;
      if (filters.top10BsiOnly && item.monthRank > 10) return false;
      return true;
    });
  }, [datasetWithRanks, filters.startYear, filters.startMonth, filters.endYear, filters.endMonth, filters.category, filters.top10BsiOnly]);

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
        category: records[0].category || 'Other',
        totalAppearances: count,
        avgRank: Number(avgRank.toFixed(1)),
        bestRank,
        avgBsi: Math.round(totalBsi / count),
        totalBsi,
        avgBuzz: Math.round(totalBuzz / count),
        avgContentQU: Math.round(totalContentQU / count),
        avgQuUser: Math.round(totalQuUser / count),
        avgSentiment: Number((totalSentiment / count).toFixed(2)),
        avgRelevancy: totalRelevancy / count,
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
    const avgRelevancy = aggregatedCelebs.reduce((sum, c) => sum + c.avgRelevancy, 0) / totalCount;

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

  // Step 5: Compute 4 Top Highlight Leaders under the filter
  const topCelebHighlights = useMemo<TopCelebHighlights>(() => {
    if (filteredMonthlyRecords.length === 0 || aggregatedCelebs.length === 0) {
      return {
        peakBsiCeleb: null,
        mostConsistentCeleb: null,
        highestAvgBsiCeleb: null,
        highestQuCeleb: null,
      };
    }

    // 1. Peak Single Monthly BSI Score
    const peakRecord = [...filteredMonthlyRecords].sort((a, b) => b.bsi - a.bsi)[0];
    const peakBsiCeleb = peakRecord
      ? { name: peakRecord.celebName, bsi: peakRecord.bsi, month: peakRecord.month, year: peakRecord.year, category: peakRecord.category }
      : null;

    // 2. Most Consistent Leader (Most Appearances in Top 10)
    const mostConsistentRecord = [...aggregatedCelebs].sort(
      (a, b) => b.totalAppearances - a.totalAppearances || a.avgRank - b.avgRank
    )[0];
    const mostConsistentCeleb = mostConsistentRecord
      ? { name: mostConsistentRecord.celebName, appearances: mostConsistentRecord.totalAppearances, avgRank: mostConsistentRecord.avgRank, category: mostConsistentRecord.category }
      : null;

    // 3. Highest Average BSI Score
    const highestAvgBsiRecord = [...aggregatedCelebs].sort((a, b) => b.avgBsi - a.avgBsi)[0];
    const highestAvgBsiCeleb = highestAvgBsiRecord
      ? { name: highestAvgBsiRecord.celebName, avgBsi: highestAvgBsiRecord.avgBsi, totalBsi: highestAvgBsiRecord.totalBsi, category: highestAvgBsiRecord.category }
      : null;

    // 4. Highest Qualified Users (QU)
    const highestQuRecord = [...aggregatedCelebs].sort((a, b) => b.avgQuUser - a.avgQuUser)[0];
    const highestQuCeleb = highestQuRecord
      ? { name: highestQuRecord.celebName, avgQuUser: highestQuRecord.avgQuUser, totalQuUser: highestQuRecord.totalBsi, category: highestQuRecord.category }
      : null;

    return {
      peakBsiCeleb,
      mostConsistentCeleb,
      highestAvgBsiCeleb,
      highestQuCeleb,
    };
  }, [filteredMonthlyRecords, aggregatedCelebs]);

  const updateFilter = useCallback((key: keyof CelebFilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialCelebFilters);
  }, []);

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
    topCelebHighlights,
  };
}
