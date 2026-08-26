import { ABVariant, LeadRecord } from '../types/leadGen';
import { getSupabaseClient } from './supabaseClient';
import { sendLeadEmailNotification } from './emailService';

const AB_VARIANT_KEY = 'buzz_ab_variant';
const UNLOCKED_KEY = 'buzz_is_unlocked';
const HAS_LEAD_KEY = 'buzz_has_submitted_lead';
const INTERNAL_UNLOCKED_KEY = 'buzz_internal_unlocked';
const CLICK_COUNT_KEY = 'buzz_click_count';
const WINNING_VARIANT_KEY = 'buzz_winning_variant';
const LOCAL_LEADS_KEY = 'buzz_local_leads';
const PASSCODE_LOGS_KEY = 'buzz_passcode_usage_logs';

// Blocked Personal / Free Email Domains
export const BLOCKED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.com.vn',
  'ymail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'zoho.com',
  'protonmail.com',
  'proton.me',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'yandex.com',
  'yandex.ru',
  'tutanota.com',
  'fastmail.com',
  'hushmail.com',
];

export function isCorporateEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return !BLOCKED_EMAIL_DOMAINS.includes(domain);
}

// Passcode Configuration:
// Tier 1: Dev Password (God Mode: Unlocks Dashboard, Full Admin Panel & Direct Upload Data without CIMKT)
export const DEV_PASSWORDS = ['D3VONLY'];

// Tier 2: Admin Password (Internal Management: Unlocks Dashboard & Has Upload Data Button)
export const ADMIN_PASSWORDS = ['CIMKT'];

// Tier 3: Internal Team Password (Internal View: Full Dashboard & Formula Breakdown, NO Upload & NO Admin Panel)
export const INTERNAL_PASSWORDS = ['BUZZINTERN@L', 'BUZZINTERNAL'];

// Tier 4: Client Passcodes (Client View: Full Dashboard View & Filtering Only, NO Upload & NO Admin Panel)
export const CLIENT_PASSCODES = [
  'BUZZBDK',
  'BUZZBDT',
  'BUZZBDN',
  'BUZZBDQ',
];

export function verifyDevPassword(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim().toUpperCase();
  return DEV_PASSWORDS.includes(cleaned);
}

export function verifyAdminPassword(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim().toUpperCase();
  return ADMIN_PASSWORDS.includes(cleaned);
}

export function verifyInternalPassword(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim().toUpperCase();
  return INTERNAL_PASSWORDS.includes(cleaned);
}

export function verifyClientPasscode(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim().toUpperCase();
  return CLIENT_PASSCODES.includes(cleaned);
}

export interface PasscodeVerificationResult {
  valid: boolean;
  tier: 'DEV' | 'ADMIN_CIMKT' | 'INTERNAL' | 'CLIENT' | 'NONE';
  isDev: boolean;
  isAdmin: boolean;
  isInternal: boolean;
  isClient: boolean;
}

export function verifyAnyPasscode(code: string): PasscodeVerificationResult {
  if (!code) return { valid: false, tier: 'NONE', isDev: false, isAdmin: false, isInternal: false, isClient: false };
  const cleaned = code.trim().toUpperCase();

  // Tier 1: D3VONLY
  if (DEV_PASSWORDS.includes(cleaned)) {
    return { valid: true, tier: 'DEV', isDev: true, isAdmin: true, isInternal: true, isClient: false };
  }
  // Tier 2: CIMKT
  if (ADMIN_PASSWORDS.includes(cleaned)) {
    return { valid: true, tier: 'ADMIN_CIMKT', isDev: false, isAdmin: true, isInternal: true, isClient: false };
  }
  // Tier 3: BUZZINTERN@L, BUZZINTERNAL
  if (INTERNAL_PASSWORDS.includes(cleaned)) {
    return { valid: true, tier: 'INTERNAL', isDev: false, isAdmin: false, isInternal: true, isClient: false };
  }
  // Tier 4: Client codes
  if (CLIENT_PASSCODES.includes(cleaned)) {
    return { valid: true, tier: 'CLIENT', isDev: false, isAdmin: false, isInternal: false, isClient: true };
  }

  return { valid: false, tier: 'NONE', isDev: false, isAdmin: false, isInternal: false, isClient: false };
}

export interface PasscodeUsageLog {
  id: string;
  passcode: string;
  passcodeType: 'DEV' | 'INTERNAL' | 'CLIENT' | 'INVALID';
  timestamp: string;
  success: boolean;
  userAgent?: string;
}

export function logPasscodeUsage(code: string, verification: PasscodeVerificationResult) {
  try {
    const raw = localStorage.getItem(PASSCODE_LOGS_KEY);
    const logs: PasscodeUsageLog[] = raw ? JSON.parse(raw) : [];

    let passcodeType: PasscodeUsageLog['passcodeType'] = 'INVALID';
    if (verification.isDev) passcodeType = 'DEV';
    else if (verification.isInternal) passcodeType = 'INTERNAL';
    else if (verification.isClient) passcodeType = 'CLIENT';

    const newLog: PasscodeUsageLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      passcode: code.trim().toUpperCase(),
      passcodeType,
      timestamp: new Date().toISOString(),
      success: verification.valid,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    logs.unshift(newLog);
    // Keep last 200 usage events locally
    localStorage.setItem(PASSCODE_LOGS_KEY, JSON.stringify(logs.slice(0, 200)));

    // Also persist log to Supabase 'passcode_logs' if database connected
    const supabase = getSupabaseClient();
    if (supabase && verification.valid) {
      Promise.resolve(
        supabase.from('passcode_logs').insert({
          id: newLog.id,
          passcode: newLog.passcode,
          passcode_type: newLog.passcodeType,
          success: newLog.success,
          created_at: newLog.timestamp,
          user_agent: newLog.userAgent,
        })
      ).catch(() => {});
    }
  } catch (e) {}
}

export function getPasscodeUsageStats(): Record<string, { count: number; lastUsed: string; type: string }> {
  try {
    const raw = localStorage.getItem(PASSCODE_LOGS_KEY);
    const logs: PasscodeUsageLog[] = raw ? JSON.parse(raw) : [];
    const stats: Record<string, { count: number; lastUsed: string; type: string }> = {};

    // Pre-populate known client codes with 0
    for (const c of CLIENT_PASSCODES) {
      stats[c] = { count: 0, lastUsed: 'Never', type: 'CLIENT' };
    }

    for (const log of logs) {
      if (log.success) {
        if (!stats[log.passcode]) {
          stats[log.passcode] = { count: 0, lastUsed: log.timestamp, type: log.passcodeType };
        }
        stats[log.passcode].count += 1;
        if (stats[log.passcode].lastUsed === 'Never') {
          stats[log.passcode].lastUsed = log.timestamp;
        }
      }
    }
    return stats;
  } catch (e) {
    return {};
  }
}

export function getWinningVariant(): ABVariant | null {
  const stored = localStorage.getItem(WINNING_VARIANT_KEY);
  if (stored && ['A', 'C'].includes(stored)) {
    return stored as ABVariant;
  }
  return null;
}

export function setWinningVariant(variant: ABVariant | 'NONE') {
  if (variant === 'NONE') {
    localStorage.removeItem(WINNING_VARIANT_KEY);
  } else {
    localStorage.setItem(WINNING_VARIANT_KEY, variant);
  }
}

export function forceAssignedVariant(variant: ABVariant) {
  localStorage.setItem(AB_VARIANT_KEY, variant);
}

export function getAssignedVariant(): ABVariant {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const urlVar = params.get('variant')?.toUpperCase();
    if (urlVar && ['A', 'C'].includes(urlVar)) {
      return urlVar as ABVariant;
    }
  }

  const winner = getWinningVariant();
  if (winner) return winner;

  const stored = localStorage.getItem(AB_VARIANT_KEY);
  if (stored && ['A', 'C'].includes(stored)) {
    return stored as ABVariant;
  }

  // Default to Variant C (5-Action Freemium Interactive Preview)
  const assigned: ABVariant = 'C';

  localStorage.setItem(AB_VARIANT_KEY, assigned);
  return assigned;
}

export function hasSubmittedLead(): boolean {
  return localStorage.getItem(HAS_LEAD_KEY) === 'true';
}

// Clear any persistent unlocks & dev auth on page load so refreshing always requires re-authenticating
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(INTERNAL_UNLOCKED_KEY);
    localStorage.removeItem(UNLOCKED_KEY);
    localStorage.removeItem('buzz_dev_authed');
    sessionStorage.removeItem(INTERNAL_UNLOCKED_KEY);
    sessionStorage.removeItem(UNLOCKED_KEY);
    sessionStorage.removeItem('buzz_dev_authed');
  } catch (e) {}
}

export function isUserUnlocked(): boolean {
  return sessionStorage.getItem(UNLOCKED_KEY) === 'true';
}

export function isInternalUnlocked(): boolean {
  return sessionStorage.getItem(INTERNAL_UNLOCKED_KEY) === 'true';
}

export function unlockUserPermanently(isInternal = false) {
  sessionStorage.setItem(UNLOCKED_KEY, 'true');
  if (isInternal) {
    sessionStorage.setItem(INTERNAL_UNLOCKED_KEY, 'true');
  }
}

export function resetLockStateForTesting() {
  localStorage.removeItem(UNLOCKED_KEY);
  localStorage.removeItem(HAS_LEAD_KEY);
  localStorage.removeItem(INTERNAL_UNLOCKED_KEY);
  localStorage.removeItem(CLICK_COUNT_KEY);
  sessionStorage.removeItem(UNLOCKED_KEY);
  sessionStorage.removeItem(INTERNAL_UNLOCKED_KEY);
}

export const MAX_FREE_CLICKS = 5;

export function getClickCount(): number {
  return parseInt(localStorage.getItem(CLICK_COUNT_KEY) || '0', 10);
}

export function incrementClickCount(): number {
  const current = getClickCount() + 1;
  localStorage.setItem(CLICK_COUNT_KEY, String(current));
  return current;
}

export function getStoredLeads(): LeadRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function saveLeadRecord(lead: Omit<LeadRecord, 'id' | 'createdAt' | 'status'>): Promise<boolean> {
  const newLead: LeadRecord = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'NEW',
  };

  // 1. Save to LocalStorage Lead Records Backup
  const existing = getStoredLeads();
  const updated = [newLead, ...existing];
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));

  // 2. Mark that Lead Form was submitted
  localStorage.setItem(HAS_LEAD_KEY, 'true');

  // 3. Send Email Notification to tuan.vi@buzzmetrics.com
  await sendLeadEmailNotification(newLead);

  // 4. Save to Supabase Cloud DB 'leads' table
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('leads').insert({
        id: newLead.id,
        variant: newLead.variant,
        full_name: newLead.fullName,
        work_email: newLead.workEmail,
        phone: newLead.phone,
        company: newLead.company,
        category_interest: newLead.categoryInterest,
        brand_interest: newLead.brandInterest || null,
        actual_need: newLead.actualNeed || null,
        data_need: newLead.dataNeed || null,
        custom_need_note: newLead.customNeedNote || null,
        ai_conversation_summary: newLead.aiConversationSummary || null,
        lead_score: newLead.leadScore,
        status: newLead.status,
      });
    } catch (err) {
      console.warn('Supabase lead write error (fallback to local):', err);
    }
  }

  return true;
}
