export type CampaignType =
  | 'Product Launch & Rebranding'
  | 'Sponsor & Event'
  | 'Promotion'
  | 'CSR & Sustainability'
  | 'Thematic & Brand Building';

export interface CampaignRecord {
  id: string;
  year: string;
  month: string;
  category: string;
  rawCategory?: string;
  brand: string;
  campaign: string;
  buzzVolume: number;
  contentQU: number;
  quUser: number;
  bsi: number;
  sentiment: number;
  relevancy: number;
  earnedPct: number;
  paid: number;
  owned: number;
  earned: number;
  quBuzzPct?: number;
  campaignType?: CampaignType;
}

export interface FilterState {
  year: string;
  month: string;
  category: string;
  campaignType: string;
  search: string;
  brandSearch?: string;
  // Date Range Selection
  dateRangeMode: boolean;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  // Top 10 BSI per month toggle
  top10BsiOnly: boolean;
  // Extra brands toggle (TW Đoàn)
  includeExtraBrands?: boolean;
}

export interface BenchmarkMetrics {
  totalCount: number;
  avgBuzz: number;
  minBuzz: number;
  maxBuzz: number;
  avgContentQU: number;
  avgQUUser: number;
  avgBSI: number;
  avgSentiment: number;
  avgRelevancy: number;
  avgEarnedPct: number;
}

export interface CategoryBenchmark {
  category: string;
  totalCampaigns: number;
  avgBuzz: number;
  avgBSI: number;
  avgContentQU: number;
  avgQUUser: number;
  avgSentiment: number;
  avgRelevancy: number;
  avgEarnedPct: number;
}

export type SortColumn = keyof CampaignRecord | 'time';
export type SortDirection = 'asc' | 'desc';
export type SortOrder = 'asc' | 'desc';

export interface BrandStat {
  brand: string;
  totalBSI: number;
  totalBuzz: number;
  campaignCount: number;
  avgSentiment: number;
  avgContentQU: number;
  avgQUUser: number;
}
