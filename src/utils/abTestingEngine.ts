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

// Passwords for Internal & Admin Unlock
export const INTERNAL_PASSWORDS = ['CIMKT', 'BUZZINTERNAL'];

export function verifyInternalPassword(password: string): boolean {
  if (!password) return false;
  const cleaned = password.trim().toUpperCase();
  return INTERNAL_PASSWORDS.includes(cleaned);
}

export function getWinningVariant(): ABVariant | null {
  const stored = localStorage.getItem(WINNING_VARIANT_KEY);
  if (stored && ['A', 'B', 'C'].includes(stored)) {
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
  const winner = getWinningVariant();
  if (winner) return winner;

  const stored = localStorage.getItem(AB_VARIANT_KEY);
  if (stored && ['A', 'B', 'C'].includes(stored)) {
    return stored as ABVariant;
  }

  // Random 33.3% assignment
  const rand = Math.random();
  let assigned: ABVariant = 'A';
  if (rand < 0.333) assigned = 'A';
  else if (rand < 0.666) assigned = 'B';
  else assigned = 'C';

  localStorage.setItem(AB_VARIANT_KEY, assigned);
  return assigned;
}

export function hasSubmittedLead(): boolean {
  return localStorage.getItem(HAS_LEAD_KEY) === 'true' || localStorage.getItem(UNLOCKED_KEY) === 'true';
}

export function isUserUnlocked(): boolean {
  // Session unlock
  return sessionStorage.getItem(UNLOCKED_KEY) === 'true';
}

export function isInternalUnlocked(): boolean {
  return localStorage.getItem(INTERNAL_UNLOCKED_KEY) === 'true';
}

export function unlockUserPermanently(isInternal = false) {
  sessionStorage.setItem(UNLOCKED_KEY, 'true');
  localStorage.setItem(HAS_LEAD_KEY, 'true');
  if (isInternal) {
    localStorage.setItem(INTERNAL_UNLOCKED_KEY, 'true');
  }
}

export function resetLockStateForTesting() {
  localStorage.removeItem(UNLOCKED_KEY);
  localStorage.removeItem(HAS_LEAD_KEY);
  localStorage.removeItem(INTERNAL_UNLOCKED_KEY);
  localStorage.removeItem(CLICK_COUNT_KEY);
  sessionStorage.removeItem(UNLOCKED_KEY);
}

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

  // 1. Save to LocalStorage Backup
  const existing = getStoredLeads();
  const updated = [newLead, ...existing];
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));

  // 2. Unlock User Session
  unlockUserPermanently(false);

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
