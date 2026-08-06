import { useMemo, useState, useEffect } from 'react';
import { CampaignRecord, FilterState } from '../types/dashboard';

export const ALL_OPTION = 'ALL';

export function useSmartFilters(dataset: CampaignRecord[]) {
  const [filters, setFilters] = useState<FilterState>({
    year: ALL_OPTION,
    month: ALL_OPTION,
    category: ALL_OPTION,
    search: '',
  });

  // 1. Available Years (Sorted ascending)
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(dataset.map(d => d.year))).filter(Boolean).sort();
    return [ALL_OPTION, ...years];
  }, [dataset]);

  // 2. Cascading Available Months based on selected Year
  const availableMonths = useMemo(() => {
    let subset = dataset;
    if (filters.year !== ALL_OPTION) {
      subset = subset.filter(d => d.year === filters.year);
    }
    
    // Sort months chronologically
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsInSubset = Array.from(new Set(subset.map(d => d.month)))
      .filter(Boolean)
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    return [ALL_OPTION, ...monthsInSubset];
  }, [dataset, filters.year]);

  // 3. Cascading Available Categories based on selected Year & Month
  const availableCategories = useMemo(() => {
    let subset = dataset;
    if (filters.year !== ALL_OPTION) {
      subset = subset.filter(d => d.year === filters.year);
    }
    if (filters.month !== ALL_OPTION) {
      subset = subset.filter(d => d.month === filters.month);
    }
    
    const categoriesInSubset = Array.from(new Set(subset.map(d => d.category)))
      .filter(Boolean)
      .sort();

    return [ALL_OPTION, ...categoriesInSubset];
  }, [dataset, filters.year, filters.month]);

  // Validate & auto-reset Month if selected month doesn't exist in current Year selection
  useEffect(() => {
    if (filters.month !== ALL_OPTION && !availableMonths.includes(filters.month)) {
      setFilters(prev => ({ ...prev, month: ALL_OPTION }));
    }
  }, [availableMonths, filters.month]);

  // Validate & auto-reset Category if selected category doesn't exist in current Year/Month selection
  useEffect(() => {
    if (filters.category !== ALL_OPTION && !availableCategories.includes(filters.category)) {
      setFilters(prev => ({ ...prev, category: ALL_OPTION }));
    }
  }, [availableCategories, filters.category]);

  // Filter dataset according to active filters
  const filteredData = useMemo(() => {
    const searchVal = filters.search.toLowerCase().trim();
    return dataset.filter(d => {
      const matchYear = filters.year === ALL_OPTION || d.year === filters.year;
      const matchMonth = filters.month === ALL_OPTION || d.month === filters.month;
      const matchCat = filters.category === ALL_OPTION || d.category === filters.category;
      const matchSearch =
        !searchVal ||
        d.campaign.toLowerCase().includes(searchVal) ||
        d.brand.toLowerCase().includes(searchVal);
      return matchYear && matchMonth && matchCat && matchSearch;
    });
  }, [dataset, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
    filteredData,
  };
}
