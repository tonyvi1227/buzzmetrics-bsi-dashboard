import { CampaignRecord } from '../types/dashboard';
import { CelebRecord } from '../types/celeb';
import { initialCampaigns } from '../data/campaignDataset';
import { celebDataset } from '../data/celebDataset';

const CAMPAIGN_STORAGE_KEY = 'buzzmetrics_campaigns_v2';
const CELEB_STORAGE_KEY = 'buzzmetrics_celebs_v2';

// CAMPAIGNS STORAGE
export function getStoredCampaigns(): CampaignRecord[] {
  try {
    const dataStr = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!dataStr) return initialCampaigns;
    const parsed = JSON.parse(dataStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading campaigns from localStorage:', err);
  }
  return initialCampaigns;
}

export function saveStoredCampaigns(campaigns: CampaignRecord[]): void {
  try {
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Error saving campaigns to localStorage:', err);
  }
}

export function resetStoredCampaigns(): CampaignRecord[] {
  try {
    localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing campaign localStorage:', err);
  }
  return initialCampaigns;
}

// CELEBS STORAGE
export function getStoredCelebs(): CelebRecord[] {
  try {
    const dataStr = localStorage.getItem(CELEB_STORAGE_KEY);
    if (!dataStr) return celebDataset;
    const parsed = JSON.parse(dataStr);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading celebs from localStorage:', err);
  }
  return celebDataset;
}

export function saveStoredCelebs(celebs: CelebRecord[]): void {
  try {
    localStorage.setItem(CELEB_STORAGE_KEY, JSON.stringify(celebs));
  } catch (err) {
    console.error('Error saving celebs to localStorage:', err);
  }
}

export function resetStoredCelebs(): CelebRecord[] {
  try {
    localStorage.removeItem(CELEB_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing celeb localStorage:', err);
  }
  return celebDataset;
}
