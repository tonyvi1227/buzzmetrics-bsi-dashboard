export interface CampaignRecord {
  id: string;
  year: string;
  month: string;
  rawCategory: string;
  category: string;
  brand: string;
  campaign: string;
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
  search: string;
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
  bsi: number;
  count: number;
  buzzVolume: number;
}

export type SortColumn = 
  | 'brand'
  | 'category'
  | 'campaign'
  | 'time'
  | 'buzzVolume'
  | 'contentQU'
  | 'quUser'
  | 'bsi'
  | 'sentiment'
  | 'relevancy'
  | 'earnedPct';

export type SortDirection = 'asc' | 'desc';
