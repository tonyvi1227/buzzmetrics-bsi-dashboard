import { useState, useMemo, useCallback } from 'react';
import { CampaignRecord, FilterState } from '../types/dashboard';

export const ALL_OPTION = 'ALL';

const initialFilters: FilterState = {
  year: ALL_OPTION,
  month: ALL_OPTION,
  category: ALL_OPTION,
  campaignType: ALL_OPTION,
  brandSearch: '',
};

export function useSmartFilters(dataset: CampaignRecord[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Available Years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    dataset.forEach(d => {
      if (d.year) years.add(d.year);
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [dataset]);

  // Available Months cascading based on selected Year
  const availableMonths = useMemo(() => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = new Set<string>();

    dataset.forEach(d => {
      if (filters.year === ALL_OPTION || d.year === filters.year) {
        if (d.month) months.add(d.month);
      }
    });

    return Array.from(months).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
  }, [dataset, filters.year]);

  // Available Categories cascading based on selected Year & Month
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();

    dataset.forEach(d => {
      const matchYear = filters.year === ALL_OPTION || d.year === filters.year;
      const matchMonth = filters.month === ALL_OPTION || d.month === filters.month;

      if (matchYear && matchMonth) {
        if (d.category) categories.add(d.category);
      }
    });

    return Array.from(categories).sort();
  }, [dataset, filters.year, filters.month]);

  // Available Campaign Types cascading
  const availableCampaignTypes = useMemo(() => {
    const types = new Set<string>();

    dataset.forEach(d => {
      const matchYear = filters.year === ALL_OPTION || d.year === filters.year;
      const matchMonth = filters.month === ALL_OPTION || d.month === filters.month;
      const matchCategory = filters.category === ALL_OPTION || d.category === filters.category;

      if (matchYear && matchMonth && matchCategory) {
        if (d.campaignType) types.add(d.campaignType);
      }
    });

    return Array.from(types).sort();
  }, [dataset, filters.year, filters.month, filters.category]);

  // Smart Cascading Update Function
  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };

      // Reset dependent child filters if parent changes
      if (key === 'year') {
        next.month = ALL_OPTION;
        next.category = ALL_OPTION;
        next.campaignType = ALL_OPTION;
      } else if (key === 'month') {
        next.category = ALL_OPTION;
        next.campaignType = ALL_OPTION;
      } else if (key === 'category') {
        next.campaignType = ALL_OPTION;
      }

      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return dataset.filter(d => {
      if (filters.year !== ALL_OPTION && d.year !== filters.year) return false;
      if (filters.month !== ALL_OPTION && d.month !== filters.month) return false;
      if (filters.category !== ALL_OPTION && d.category !== filters.category) return false;
      if (filters.campaignType !== ALL_OPTION && d.campaignType !== filters.campaignType) return false;

      const searchTerm = (filters.brandSearch || filters.search || '').trim().toLowerCase();
      if (searchTerm) {
        const matchBrand = d.brand.toLowerCase().includes(searchTerm);
        const matchCampaign = d.campaign.toLowerCase().includes(searchTerm);
        if (!matchBrand && !matchCampaign) return false;
      }

      return true;
    });
  }, [dataset, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    availableYears,
    availableMonths,
    availableCategories,
    availableCampaignTypes,
    filteredData,
  };
}
