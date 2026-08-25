import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Users,
  Download,
  KeyRound,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  UploadCloud,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  X,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
  Send,
  Mail,
} from 'lucide-react';
import { LeadRecord, ABVariant } from '../types/leadGen';
import {
  getStoredLeads,
  getWinningVariant,
  setWinningVariant,
  getAssignedVariant,
  getPasscodeUsageStats,
  CLIENT_PASSCODES,
  forceAssignedVariant,
  resetLockStateForTesting,
  unlockUserPermanently,
} from '../utils/abTestingEngine';
import { getSupabaseClient } from '../utils/supabaseClient';
import { exportTemplateCSV } from '../utils/exportUtils';
import { sendLeadEmailNotification } from '../utils/emailService';

interface AdminPanelProps {
  currentVariant: ABVariant;
  isUnlocked: boolean;
  onUpdateState: (newVariant: ABVariant, newUnlocked: boolean) => void;
  onOpenImport?: () => void;
  onClose?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentVariant,
  isUnlocked,
  onUpdateState,
  onOpenImport,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'toolbar' | 'analytics' | 'leads' | 'passcodes'>('toolbar');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [winningVariant, setWinningState] = useState<ABVariant | 'NONE'>(getWinningVariant() || 'NONE');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [passcodeStats, setPasscodeStats] = useState<Record<string, { count: number; lastUsed: string; type: string }>>({});
  
  // Test Email Status State
  const [testEmailStatus, setTestEmailStatus] = useState<string>('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState<boolean>(false);

  useEffect(() => {
    loadLeadsData();
    loadPasscodeData();
  }, []);

  const loadPasscodeData = () => {
    const stats = getPasscodeUsageStats();
    setPasscodeStats(stats);
  };

  const loadLeadsData = async () => {
    const localLeads = getStoredLeads();
    setLeads(localLeads);

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
            actualNeed: d.actual_need,
            dataNeed: d.data_need,
            customNeedNote: d.custom_need_note,
            aiConversationSummary: d.ai_conversation_summary,
            leadScore: d.lead_score || 'HIGH',
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

  const handleSelectVariant = (v: ABVariant) => {
    forceAssignedVariant(v);
    resetLockStateForTesting();
    onUpdateState(v, false);
  };

  const handleToggleLock = () => {
    if (isUnlocked) {
      resetLockStateForTesting();
      onUpdateState(currentVariant, false);
    } else {
      unlockUserPermanently(true);
      onUpdateState(currentVariant, true);
    }
  };

  const handleSetWinner = (variant: ABVariant | 'NONE') => {
    setWinningState(variant);
    setWinningVariant(variant);
    const assigned = getAssignedVariant();
    onUpdateState(assigned, isUnlocked);
  };

  const handleTestSendEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailStatus('Sending test notification to tuan.vi@buzzmetrics.com...');
    
    const sampleLead: LeadRecord = {
      id: `test_${Date.now()}`,
      variant: currentVariant,
      fullName: 'Nguyễn Văn Test (Buzzmetrics Demo)',
      workEmail: 'demo.lead@unilever.com',
      phone: '0909 123 456',
      company: 'Unilever Vietnam',
      categoryInterest: 'Home Care & Personal Care',
      actualNeed: 'Upcoming Campaign / Product Launch Planning',
      dataNeed: 'Full 18-Month BSI Benchmark Data Access',
      customNeedNote: 'Khách hàng quan tâm phân tích đối thủ cạnh tranh trong Q3/2026.',
      leadScore: 'HIGH',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    await sendLeadEmailNotification(sampleLead);
    setIsSendingTestEmail(false);
    setTestEmailStatus('✓ Test email dispatched to tuan.vi@buzzmetrics.com! (Check inbox / FormSubmit activation email)');
    setTimeout(() => setTestEmailStatus(''), 8000);
  };

  const variantCounts = {
    A: leads.filter((l) => l.variant === 'A').length,
    B: leads.filter((l) => l.variant === 'B').length,
    C: leads.filter((l) => l.variant === 'C').length,
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID',
      'Variant',
      'Full Name',
      'Work Email',
      'Phone',
      'Company',
      'Industry Category',
      'Project Need',
      'Data Requirement',
      'Custom Note',
      'Lead Score',
      'Status',
      'Created At',
    ];
    const rows = leads.map((l) => [
      l.id,
      l.variant,
      `"${l.fullName}"`,
      `"${l.workEmail}"`,
      `"${l.phone}"`,
      `"${l.company}"`,
      `"${l.categoryInterest}"`,
      `"${l.actualNeed || ''}"`,
      `"${l.dataNeed || ''}"`,
      `"${(l.customNeedNote || '').replace(/"/g, '""')}"`,
      l.leadScore,
      l.status,
      l.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Buzzmetrics_BSI_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 1. Minimized Floating Widget (White Background, Blue Border, Orange Highlights)
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border-2 border-blue-600 p-2 flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-buzz hover:bg-orange-600 text-white font-black text-xs transition cursor-pointer shadow-sm"
            title="Expand Admin Panel"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-black text-blue-700 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 font-mono">
            Var {currentVariant} • {isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
          </span>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Expanded Main Admin Panel (White Background, Blue Border, Orange Highlights)
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[96vw] max-w-4xl max-h-[88vh] overflow-y-auto bg-white text-slate-900 p-4 md:p-5 rounded-3xl border-2 border-blue-600 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200 overscroll-contain">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md flex-shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                ADMIN PANEL
              </h3>
              <span className="text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-300 px-2 py-0.5 rounded-md uppercase">
                DEV & BD ACCESS
              </span>
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                Current: <strong className="text-buzz font-black">Variant {currentVariant}</strong>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Live testing control, lead capture management & client passcode tracking.
            </p>
          </div>
        </div>

        {/* Subtabs & Minimize */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setActiveSubTab('toolbar')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                activeSubTab === 'toolbar' ? 'bg-buzz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛠️ Controls
            </button>
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                activeSubTab === 'analytics' ? 'bg-buzz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 A/B Stats
            </button>
            <button
              onClick={() => setActiveSubTab('leads')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                activeSubTab === 'leads' ? 'bg-buzz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 Leads ({leads.length})
            </button>
            <button
              onClick={() => {
                setActiveSubTab('passcodes');
                loadPasscodeData();
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-black ${
                activeSubTab === 'passcodes' ? 'bg-buzz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔑 Codes
            </button>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer border border-slate-200"
            title="Minimize Panel"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition cursor-pointer border border-slate-200"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: LIVE QUICK CONTROLS */}
      {activeSubTab === 'toolbar' && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Force Variant */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-slate-700">Force Variant:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleSelectVariant('A')}
                  className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                    currentVariant === 'A' ? 'bg-buzz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Variant A (Form Gate)
                </button>
                <button
                  onClick={() => handleSelectVariant('C')}
                  className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                    currentVariant === 'C' ? 'bg-buzz text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Variant C (Freemium 5-Action)
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {onOpenImport && (
                <button
                  onClick={onOpenImport}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-black transition flex items-center gap-1 cursor-pointer border border-blue-200 shadow-2xs"
                  title="Upload/Import New Monthly Data"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Data</span>
                </button>
              )}

              <button
                onClick={() => exportTemplateCSV()}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
                title="Download standard template CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-buzz" />
                <span>Template CSV</span>
              </button>

              <button
                onClick={handleToggleLock}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  isUnlocked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-orange-50 text-buzz border-orange-300 hover:bg-orange-100'
                }`}
              >
                {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-buzz" />}
                <span>{isUnlocked ? '✓ UNLOCKED (Full Access)' : '🔒 Locked Preview Mode'}</span>
              </button>
            </div>
          </div>

          {/* Test Email Dispatch Section */}
          <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-buzz" />
                Email Lead Notification System
              </span>
              <p className="text-[11px] text-slate-600 font-medium">
                Tự động gửi email thông báo lead đầy đủ thông tin về <strong className="text-buzz font-bold">tuan.vi@buzzmetrics.com</strong> khi có khách đăng ký.
              </p>
            </div>

            <button
              onClick={handleTestSendEmail}
              disabled={isSendingTestEmail}
              className="px-3.5 py-2 bg-buzz hover:bg-orange-600 text-white font-black rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap self-end sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingTestEmail ? 'Sending...' : 'Test Send Email Lead'}</span>
            </button>
          </div>

          {testEmailStatus && (
            <div className={`p-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              testEmailStatus.includes('✓')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-blue-50 text-blue-800 border-blue-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{testEmailStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: A/B TEST ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="pt-2 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Variant A */}
            <div
              className={`p-3.5 rounded-2xl border transition ${
                winningVariant === 'A'
                  ? 'bg-orange-50 border-buzz shadow-sm ring-1 ring-buzz'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] font-black text-buzz uppercase tracking-wider">VARIANT A</span>
                <span className="text-base font-black text-slate-900">{variantCounts.A} Leads</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1">Direct Form Gate</h4>
              <p className="text-[10px] text-slate-500 font-medium mb-3">
                Locked section ➔ Shows Work Email Corporate Form with project needs.
              </p>
              <button
                onClick={() => handleSetWinner(winningVariant === 'A' ? 'NONE' : 'A')}
                className={`w-full py-1.5 rounded-lg text-xs font-black transition cursor-pointer border ${
                  winningVariant === 'A'
                    ? 'bg-buzz text-white border-orange-600 shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {winningVariant === 'A' ? '✓ Selected Winner' : '🏆 Set as Winner (100%)'}
              </button>
            </div>

            {/* Variant B */}
            <div
              className={`p-3.5 rounded-2xl border transition ${
                winningVariant === 'B'
                  ? 'bg-orange-50 border-buzz shadow-sm ring-1 ring-buzz'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] font-black text-buzz uppercase tracking-wider">VARIANT B ⭐</span>
                <span className="text-base font-black text-slate-900">{variantCounts.B} Leads</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1">AI Qualification Chatbot</h4>
              <p className="text-[10px] text-slate-500 font-medium mb-3">
                Interactive AI Consultant with 3 intent questions ➔ Computes Score & unlocks.
              </p>
              <button
                onClick={() => handleSetWinner(winningVariant === 'B' ? 'NONE' : 'B')}
                className={`w-full py-1.5 rounded-lg text-xs font-black transition cursor-pointer border ${
                  winningVariant === 'B'
                    ? 'bg-buzz text-white border-orange-600 shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {winningVariant === 'B' ? '✓ Selected Winner' : '🏆 Set as Winner (100%)'}
              </button>
            </div>

            {/* Variant C */}
            <div
              className={`p-3.5 rounded-2xl border transition ${
                winningVariant === 'C'
                  ? 'bg-orange-50 border-buzz shadow-sm ring-1 ring-buzz'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] font-black text-buzz uppercase tracking-wider">VARIANT C</span>
                <span className="text-base font-black text-slate-900">{variantCounts.C} Leads</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1">Freemium 5-Action</h4>
              <p className="text-[10px] text-slate-500 font-medium mb-3">
                Allows 5 free interactive clicks ➔ 6th action requires registration.
              </p>
              <button
                onClick={() => handleSetWinner(winningVariant === 'C' ? 'NONE' : 'C')}
                className={`w-full py-1.5 rounded-lg text-xs font-black transition cursor-pointer border ${
                  winningVariant === 'C'
                    ? 'bg-buzz text-white border-orange-600 shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {winningVariant === 'C' ? '✓ Selected Winner' : '🏆 Set as Winner (100%)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LEADS LIST */}
      {activeSubTab === 'leads' && (
        <div className="pt-2 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-600 uppercase">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-900 rounded-lg p-1 outline-none"
              >
                <option value="ALL">All Leads ({leads.length})</option>
                <option value="NEW">New Leads (NEW)</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadLeadsData}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportLeadsToCSV}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV ({leads.length})</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-500">
                <tr>
                  <th className="py-2.5 pl-3">Contact</th>
                  <th className="py-2.5">Company / Phone</th>
                  <th className="py-2.5">Work Email</th>
                  <th className="py-2.5">Industry & Need</th>
                  <th className="py-2.5 text-center">Score</th>
                  <th className="py-2.5 text-right pr-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-bold">
                      No leads recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 pl-3 font-black text-slate-900">{lead.fullName}</td>
                      <td className="py-2">
                        <span className="text-slate-900 block font-bold">{lead.company}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{lead.phone}</span>
                      </td>
                      <td className="py-2 text-buzz font-extrabold">{lead.workEmail}</td>
                      <td className="py-2">
                        <span className="text-slate-800 block font-bold">{lead.categoryInterest}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                          {lead.actualNeed || lead.dataNeed || 'General'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-300">
                          {lead.leadScore}
                        </span>
                      </td>
                      <td className="py-2 text-right pr-3 text-[10px] text-slate-500 font-mono">
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

      {/* SUBTAB 4: CLIENT PASSCODES TRACKING */}
      {activeSubTab === 'passcodes' && (
        <div className="pt-2 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-buzz" />
              <span className="font-bold text-slate-700">
                Track how many times each client passcode has been redeemed to unlock the dashboard.
              </span>
            </div>
            <button
              onClick={loadPasscodeData}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CLIENT_PASSCODES.map((code) => {
              const stat = passcodeStats[code] || { count: 0, lastUsed: 'Never' };
              return (
                <div
                  key={code}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-orange-100 text-buzz border border-orange-200">
                      {code}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">Client</span>
                  </div>
                  <div>
                    <span className="text-xl font-black text-slate-900 block">
                      {stat.count} <span className="text-[10px] font-normal text-slate-500">uses</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold block truncate">
                      Last: {stat.lastUsed === 'Never' ? 'Never' : new Date(stat.lastUsed).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
