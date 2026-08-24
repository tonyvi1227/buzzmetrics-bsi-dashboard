import React, { useState, useEffect } from 'react';
import { Trophy, Users, Download, Mail, Phone, Building, Calendar, Sparkles, Filter, CheckCircle2, RefreshCw } from 'lucide-react';
import { LeadRecord, ABVariant } from '../types/leadGen';
import { getStoredLeads, getWinningVariant, setWinningVariant, getAssignedVariant } from '../utils/abTestingEngine';
import { getSupabaseClient } from '../utils/supabaseClient';

export const AdminABTestPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'leads'>('analytics');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [winningVariant, setWinningState] = useState<ABVariant | 'NONE'>(getWinningVariant() || 'NONE');
  const [currentAssignedVariant, setCurrentAssignedVariant] = useState<ABVariant>(getAssignedVariant());
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadLeadsData();
  }, []);

  const loadLeadsData = async () => {
    // Load local backup leads first
    const localLeads = getStoredLeads();
    setLeads(localLeads);

    // Try fetching from Supabase DB
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const mappedLeads: LeadRecord[] = data.map((d: any) => ({
            id: d.id,
            sessionId: d.session_id,
            variant: d.variant as ABVariant,
            fullName: d.full_name,
            workEmail: d.work_email,
            phone: d.phone,
            company: d.company,
            categoryInterest: d.category_interest,
            aiConversationSummary: d.ai_conversation_summary,
            leadScore: d.lead_score || 'MEDIUM',
            status: d.status || 'NEW',
            createdAt: d.created_at,
          }));
          setLeads(mappedLeads);
        }
      } catch (e) {
        console.warn('Supabase leads fetch error:', e);
      }
    }
  };

  const handleSetWinner = (variant: ABVariant | 'NONE') => {
    setWinningState(variant);
    setWinningVariant(variant);
    setCurrentAssignedVariant(getAssignedVariant());
  };

  // Compute conversion metrics per variant
  const variantCounts = {
    A: leads.filter(l => l.variant === 'A').length,
    B: leads.filter(l => l.variant === 'B').length,
    C: leads.filter(l => l.variant === 'C').length,
  };

  const filteredLeads = leads.filter(l => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Variant', 'Full Name', 'Work Email', 'Phone', 'Company', 'Category Interest', 'Lead Score', 'AI Summary', 'Status', 'Created At'];
    const rows = leads.map(l => [
      l.id,
      l.variant,
      `"${l.fullName}"`,
      `"${l.workEmail}"`,
      `"${l.phone}"`,
      `"${l.company}"`,
      `"${l.categoryInterest}"`,
      l.leadScore,
      `"${(l.aiConversationSummary || '').replace(/"/g, '""')}"`,
      l.status,
      l.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Buzzmetrics_BSI_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card p-5 md:p-6 rounded-2xl mb-6 border border-buzz-border dark:border-orange-900 bg-orange-50/40 dark:bg-orange-950/20 shadow-md">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-orange-200 dark:border-orange-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-buzz text-white shadow-md shadow-orange-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              ADMIN CONTROL PANEL: A/B TESTING & LEAD MANAGEMENT
              <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">LIVE</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Manage A/B/C conversion experiments & view leads routed to tuan.vi@buzzmetrics.com.
            </p>
          </div>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end sm:self-auto">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'analytics'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>A/B Analytics</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'leads'
                ? 'bg-buzz text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leads Database ({leads.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: A/B TEST ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="pt-4 space-y-5 animate-fadeIn">
          {/* Active Status Banner */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div>
              <span>Your current random variant: </span>
              <strong className="text-buzz font-black text-sm">Variant {currentAssignedVariant}</strong>
            </div>
            <div>
              <span>Permanent winning variant: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                {winningVariant === 'NONE' ? 'Not chosen (Random split distribution)' : `Variant ${winningVariant} (100%)`}
              </strong>
            </div>
          </div>

          {/* 3 Variants Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Variant A */}
            <div className={`p-4 rounded-2xl border transition ${
              winningVariant === 'A'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-black text-buzz uppercase tracking-wider block">VARIANT A</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Instant Modal Gate</h4>
                </div>
                <span className="text-xl font-black text-buzz">{variantCounts.A} Leads</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                Locked section ➔ Shows 4-field Lead Form (Name, Work Email, Phone, Company).
              </p>
              <button
                onClick={() => handleSetWinner(winningVariant === 'A' ? 'NONE' : 'A')}
                className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                  winningVariant === 'A'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {winningVariant === 'A' ? '✓ Selected Winner' : '🏆 Set as Winner (100%)'}
              </button>
            </div>

            {/* Variant B */}
            <div className={`p-4 rounded-2xl border transition ${
              winningVariant === 'B'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-black text-buzz uppercase tracking-wider block">VARIANT B ⭐</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">AI Qualification Chatbot</h4>
                </div>
                <span className="text-xl font-black text-buzz">{variantCounts.B} Leads</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                Interactive AI Assistant with 3 intent questions ➔ Computes Lead Score & unlocks.
              </p>
              <button
                onClick={() => handleSetWinner(winningVariant === 'B' ? 'NONE' : 'B')}
                className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                  winningVariant === 'B'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {winningVariant === 'B' ? '✓ Selected Winner' : '🏆 Set as Winner (100%)'}
              </button>
            </div>

            {/* Variant C */}
            <div className={`p-4 rounded-2xl border transition ${
              winningVariant === 'C'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-black text-buzz uppercase tracking-wider block">VARIANT C</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Progressive Freemium (3 Clicks)</h4>
                </div>
                <span className="text-xl font-black text-buzz">{variantCounts.C} Leads</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                Allows 3 free interactive clicks ➔ 4th click requires registration.
              </p>
              <button
                onClick={() => handleSetWinner(winningVariant === 'C' ? 'NONE' : 'C')}
                className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                  winningVariant === 'C'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {winningVariant === 'C' ? '✓ Selected Winner' : '🏆 Set as Winner (100%)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LEADS LIST TABLE */}
      {activeSubTab === 'leads' && (
        <div className="pt-4 space-y-4 animate-fadeIn">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-lg p-1.5 outline-none"
              >
                <option value="ALL">All ({leads.length})</option>
                <option value="NEW">New Leads (NEW)</option>
                <option value="CONTACTED">Contacted (CONTACTED)</option>
                <option value="QUALIFIED">Qualified (QUALIFIED)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadLeadsData}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              <button
                onClick={exportLeadsToCSV}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Leads CSV ({leads.length})</span>
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="py-2.5 pl-3">Contact</th>
                  <th className="py-2.5">Company / Phone</th>
                  <th className="py-2.5">Work Email</th>
                  <th className="py-2.5">Category Interest</th>
                  <th className="py-2.5 text-center">Variant</th>
                  <th className="py-2.5 text-center">Score</th>
                  <th className="py-2.5 text-right pr-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-bold">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                      No leads recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2.5 pl-3 font-black text-slate-900 dark:text-white">{lead.fullName}</td>
                      <td className="py-2.5">
                        <span className="text-slate-900 dark:text-white block font-extrabold">{lead.company}</span>
                        <span className="text-[11px] text-slate-400 font-semibold">{lead.phone}</span>
                      </td>
                      <td className="py-2.5 text-buzz font-extrabold">{lead.workEmail}</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">{lead.categoryInterest}</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          Var {lead.variant}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          lead.leadScore === 'HIGH'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                        }`}>
                          {lead.leadScore}
                        </span>
                      </td>
                      <td className="py-2.5 text-right pr-3 text-[11px] text-slate-400 font-semibold">
                        {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
