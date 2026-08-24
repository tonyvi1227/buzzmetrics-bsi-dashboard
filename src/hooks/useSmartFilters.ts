import { useState, useMemo, useCallback } from 'react';
import { CampaignRecord, FilterState } from '../types/dashboard';

export const ALL_OPTION = 'ALL';

export const MONTH_ORDER = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const getMonthValue = (yearStr: string, monthStr: string): number => {
  const y = parseInt(yearStr, 10) || 2025;
  const mIndex = MONTH_ORDER.indexOf(monthStr);
  return mIndex !== -1 ? y * 12 + mIndex : y * 12;
};

const initialFilters: FilterState = {
  year: ALL_OPTION,
  month: ALL_OPTION,
  category: ALL_OPTION,
  campaignType: ALL_OPTION,
  search: '',
  brandSearch: '',
  dateRangeMode: true, // Permanent Date Range Mode
  startYear: '2025',
  startMonth: 'Jan',
  endYear: '2026',
  endMonth: 'Jun',
  top10BsiOnly: true, // Default to Top 10 BSI Campaigns per Month for Customers
  includeExtraBrands: false, // Default to Hide TW Đoàn from all charts & tables
};

export function useSmartFilters(allCampaigns: CampaignRecord[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Helper to extract Top 10 BSI campaigns per month
  const filterTop10BsiPerMonth = useCallback((records: CampaignRecord[]): CampaignRecord[] => {
    const grouped: Record<string, CampaignRecord[]> = {};
    records.forEach(r => {
      const key = `${r.year}_${r.month}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    });

    const result: CampaignRecord[] = [];
    Object.values(grouped).forEach(group => {
      const sorted = [...group].sort((a, b) => b.bsi - a.bsi);
      result.push(...sorted.slice(0, 10));
    });

    return result;
  }, []);

  // Update a single filter field
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Reset all filters to default
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Get list of available Years in dataset
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allCampaigns.map(c => c.year))).filter(Boolean);
    return years.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [allCampaigns]);

  // Get available Months based on selected Year
  const availableMonths = useMemo(() => {
    let source = allCampaigns;
    if (filters.year !== ALL_OPTION) {
      source = source.filter(c => c.year === filters.year);
    }
    const months = Array.from(new Set(source.map(c => c.month))).filter(Boolean);
    return months.sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b));
  }, [allCampaigns, filters.year]);

  // Get available Categories based on active filters
  const availableCategories = useMemo(() => {
    let source = allCampaigns;
    if (filters.year !== ALL_OPTION) {
      source = source.filter(c => c.year === filters.year);
    }
    if (filters.month !== ALL_OPTION) {
      source = source.filter(c => c.month === filters.month);
    }
    const categories = Array.from(new Set(source.map(c => c.category))).filter(Boolean);
    return categories.sort();
  }, [allCampaigns, filters.year, filters.month]);

  // Available Campaign Types
  const availableCampaignTypes = useMemo(() => {
    const types = Array.from(new Set(allCampaigns.map(c => c.campaignType))).filter(Boolean) as string[];
    return types.sort();
  }, [allCampaigns]);

  // Filter dataset dynamically based on cascading criteria & date range
  const filteredData = useMemo(() => {
    let dataset = [...allCampaigns];

    // 0. Exclude Extra Brands (TW Đoàn) by default unless includeExtraBrands is true
    if (!filters.includeExtraBrands) {
      dataset = dataset.filter(
        c => !c.brand.toUpperCase().includes('TW ĐOÀN') && !c.brand.toUpperCase().includes('TW DOAN')
      );
    }

    // 1. If Top 10 BSI per month toggle is active, extract top 10 BSI per month first
    if (filters.top10BsiOnly) {
      dataset = filterTop10BsiPerMonth(dataset);
    }

    // 2. Date Range Filter Logic (Always Active)
    const startVal = getMonthValue(filters.startYear, filters.startMonth);
    const endVal = getMonthValue(filters.endYear, filters.endMonth);

    dataset = dataset.filter(c => {
      const itemVal = getMonthValue(c.year, c.month);
      return itemVal >= startVal && itemVal <= endVal;
    });

    // 3. Category Filter
    if (filters.category !== ALL_OPTION) {
      dataset = dataset.filter(c => c.category === filters.category);
    }

    // 4. Campaign Type Filter
    if (filters.campaignType !== ALL_OPTION) {
      dataset = dataset.filter(c => c.campaignType === filters.campaignType);
    }

    // 5. Search Keyword Filter (Brand / Campaign Name)
    const query = (filters.brandSearch || filters.search || '').trim().toLowerCase();
    if (query) {
      dataset = dataset.filter(
        c =>
          c.brand.toLowerCase().includes(query) ||
          c.campaign.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    return dataset;
  }, [allCampaigns, filters, filterTop10BsiPerMonth]);

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
