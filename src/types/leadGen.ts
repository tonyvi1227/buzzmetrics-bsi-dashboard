export type ABVariant = 'A' | 'B' | 'C';

export interface LeadRecord {
  id: string;
  sessionId?: string;
  variant: ABVariant;
  fullName: string;
  workEmail: string;
  phone: string;
  company: string;
  categoryInterest: string;
  brandInterest?: string;
  actualNeed?: string;
  customNeedNote?: string;
  aiConversationSummary?: string;
  leadScore: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'DISQUALIFIED';
  createdAt: string;
}

export interface ABSession {
  sessionId: string;
  variant: ABVariant;
  isUnlocked: boolean;
  unlockedAt?: string;
  clickCount: number;
}
