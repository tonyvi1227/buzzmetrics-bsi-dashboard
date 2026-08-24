export interface CelebRecord {
  id: string;
  year: string;
  month: string;
  celebName: string;
  rawName: string;
  category: string;
  bsi: number;
  buzzVolume: number;
  contentQU: number;
  sentiment: number;
  quUser: number;
  relevancy: number;
  earnedPct: number;
}

export interface MonthlyCelebRankRecord extends CelebRecord {
  monthRank: number; // Rank #1, #2, #3... within that month
}

export interface AggregatedCelebRecord {
  celebName: string;
  category: string;
  totalAppearances: number;  // Số lần lọt Top 10 BSI
  avgRank: number;           // Average BSI top10 rank
  bestRank: number;          // Thứ hạng tốt nhất (#1, #2...)
  avgBsi: number;            // Điểm BSI trung bình khi xuất hiện
  totalBsi: number;          // Tổng BSI tích lũy
  avgBuzz: number;           // AVG Buzz Volume
  avgContentQU: number;      // AVG Content QU (Lượng thảo luận từ QU)
  avgQuUser: number;         // AVG Qualified User (QU)
  avgSentiment: number;      // AVG Sentiment Index
  avgRelevancy: number;      // AVG Relevance (Trung bình thảo luận liên quan)
  monthlyRecords: MonthlyCelebRankRecord[]; // Chi tiết lịch sử các tháng
}

export interface CelebFilterState {
  category: string;
  search: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  top10BsiOnly?: boolean;
}

export interface CelebBenchmarkMetrics {
  totalCount: number;        // Tổng số Celeb độc lập trong kỳ
  topCeleb: string;          // Celeb đứng đầu (BSI TB hoặc Rank TB cao nhất)
  topBsi: number;            // BSI của top Celeb
  avgBsi: number;            // Điểm BSI trung bình
  avgBuzz: number;           // Buzz Volume trung bình
  avgContentQU: number;      // Content QU trung bình
  avgQuUser: number;         // Qualified User (QU) trung bình
  avgSentiment: number;      // Sentiment Index trung bình
  avgRelevancy: number;      // AVG Relevance (Trung bình thảo luận liên quan)
}

export interface TopCelebHighlights {
  peakBsiCeleb: { name: string; bsi: number; month: string; year: string; category: string } | null;
  mostConsistentCeleb: { name: string; appearances: number; avgRank: number; category: string } | null;
  highestAvgBsiCeleb: { name: string; avgBsi: number; totalBsi: number; category: string } | null;
  highestQuCeleb: { name: string; avgQuUser: number; totalQuUser: number; category: string } | null;
}

export type CelebSortColumn = 
  | 'avgRank' 
  | 'totalAppearances' 
  | 'celebName' 
  | 'category' 
  | 'avgBsi' 
  | 'avgBuzz' 
  | 'avgContentQU' 
  | 'avgQuUser' 
  | 'avgSentiment' 
  | 'avgRelevancy';

export type SortDirection = 'asc' | 'desc';
