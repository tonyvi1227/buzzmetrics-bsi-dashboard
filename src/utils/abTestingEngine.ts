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

// Passcode Configuration:
// 1. Dev Password (Unlocks Dashboard AND reveals ⚡ Dev A/B Toolbar)
export const DEV_PASSWORDS = ['D3VONLY'];

// 2. Internal Team Password (Unlocks Dashboard, NO Dev Toolbar)
export const INTERNAL_PASSWORDS = ['BUZZINTERN@L', 'CIMKT', 'BUZZINTERNAL'];

// 3. Client Passcodes (Unlocks Dashboard View & Filtering Only)
export const CLIENT_PASSCODES = [
  'BUZZBDK',
  'BUZZBDT',
  'BUZZBDN',
  'BUZZBDQ',
  'BUZZVIP',
  'BSI2026',
  'BUZZFULL',
];

export function verifyDevPassword(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim().toUpperCase();
  return DEV_PASSWORDS.includes(cleaned);
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
  isDev: boolean;
  isInternal: boolean;
  isClient: boolean;
}

export function verifyAnyPasscode(code: string): PasscodeVerificationResult {
  if (!code) return { valid: false, isDev: false, isInternal: false, isClient: false };
  const cleaned = code.trim().toUpperCase();

  if (DEV_PASSWORDS.includes(cleaned)) {
    return { valid: true, isDev: true, isInternal: true, isClient: false };
  }
  if (INTERNAL_PASSWORDS.includes(cleaned)) {
    return { valid: true, isDev: false, isInternal: true, isClient: false };
  }
  if (CLIENT_PASSCODES.includes(cleaned)) {
    return { valid: true, isDev: false, isInternal: false, isClient: true };
  }

  return { valid: false, isDev: false, isInternal: false, isClient: false };
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

  // 50% Variant A (Form Gate) / 50% Variant C (3-Click Freemium)
  const rand = Math.random();
  const assigned: ABVariant = rand < 0.5 ? 'A' : 'C';

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
