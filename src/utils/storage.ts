import { CampaignRecord } from '../types/dashboard';
import { initialCampaigns } from '../data/campaignDataset';

const STORAGE_KEY = 'buzzmetrics_dashboard_data_v3';

export function getStoredCampaigns(): CampaignRecord[] {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Error saving campaigns to localStorage:', err);
  }
}

export function resetStoredCampaigns(): CampaignRecord[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
  return initialCampaigns;
}
