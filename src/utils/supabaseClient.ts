import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CampaignRecord } from '../types/dashboard';

const DEFAULT_SUPABASE_URL = 'https://pfuyxwdboqcjxnpvgrgv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_DRM2reRGhDnyNBlFPI1grw_KugMnmnb';

const SUPABASE_URL_KEY = 'buzz_supabase_url';
const SUPABASE_KEY_KEY = 'buzz_supabase_anon_key';

export function getSupabaseCredentials() {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem(SUPABASE_URL_KEY) || DEFAULT_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem(SUPABASE_KEY_KEY) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_KEY_KEY, anonKey.trim());
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

/**
 * Map Supabase DB row (snake_case) to CampaignRecord (camelCase)
 */
export function mapDbRowToRecord(row: any): CampaignRecord {
  return {
    id: row.id || `rec_${row.year}_${row.month}_${Math.random()}`,
    year: String(row.year || ''),
    month: String(row.month || ''),
    rawCategory: row.raw_category || row.category || 'Khác',
    category: row.category || 'Khác',
    brand: row.brand || 'KHÁC',
    campaign: row.campaign || '',
    bsi: Number(row.bsi || 0),
    buzzVolume: Number(row.buzz_volume || 0),
    contentQU: Number(row.content_qu || 0),
    quBuzzPct: Number(row.qu_buzz_pct || 0),
    sentiment: Number(row.sentiment || 0),
    quUser: Number(row.qu_user || 0),
    relevancy: Number(row.relevancy || 0),
    earnedPct: Number(row.earned_pct || 0),
    owned: Number(row.owned || 0),
    paid: Number(row.paid || 0),
    earned: Number(row.earned || 0),
  };
}

/**
 * Map CampaignRecord (camelCase) to Supabase DB row (snake_case)
 */
export function mapRecordToDbRow(r: CampaignRecord): any {
  return {
    id: r.id,
    year: r.year,
    month: r.month,
    raw_category: r.rawCategory,
    category: r.category,
    brand: r.brand,
    campaign: r.campaign,
    bsi: r.bsi,
    buzz_volume: r.buzzVolume,
    content_qu: r.contentQU,
    qu_buzz_pct: r.quBuzzPct,
    sentiment: r.sentiment,
    qu_user: r.quUser,
    relevancy: r.relevancy,
    earned_pct: r.earnedPct,
    owned: r.owned,
    paid: r.paid,
    earned: r.earned,
  };
}

/**
 * Fetch campaign records from Supabase table 'campaigns'
 */
export async function fetchCampaignsFromSupabase(): Promise<CampaignRecord[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('campaigns')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapDbRowToRecord);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
  }
  return null;
}

/**
 * Insert or Upsert records to Supabase table 'campaigns'
 */
export async function uploadCampaignsToSupabase(records: CampaignRecord[], mode: 'append' | 'overwrite'): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    if (mode === 'overwrite') {
      // Clear table before overwrite
      await client.from('campaigns').delete().neq('id', '0');
    }

    const dbRows = records.map(mapRecordToDbRow);
    const { error } = await client.from('campaigns').upsert(dbRows, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upload error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase write exception:', err);
    return false;
  }
}
