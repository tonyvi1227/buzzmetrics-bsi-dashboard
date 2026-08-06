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
  rawCategory: string;
  category: string;
  brand: string;
  campaign: string;
  campaignType: CampaignType;
  bsi: number;
  buzzVolume: number;
  contentQU: number;
  quBuzzPct: number;
  sentiment: number;
  quUser: number;
  relevancy: number;
  earnedPct: number;
  owned: number;
  paid: number;
  earned: number;
}

export interface FilterState {
  year: string;
  month: string;
  category: string;
  campaignType: string;
  brandSearch: string;
  search?: string;
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

export interface BrandStat {
  brand: string;
  totalBSI: number;
  totalBuzz: number;
  campaignCount: number;
  avgSentiment: number;
}

export type SortColumn = 'time' | 'year' | 'month' | 'brand' | 'category' | 'campaign' | 'campaignType' | 'buzzVolume' | 'bsi' | 'contentQU' | 'quUser' | 'sentiment' | 'relevancy' | 'earnedPct';
export type SortOrder = 'asc' | 'desc';
export type SortDirection = 'asc' | 'desc';
