import React, { useState } from 'react';
import { X, Database, Check, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, fetchCampaignsFromSupabase } from '../utils/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose, onConnected }) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('testing');
    setErrorMsg('');

    if (!url.trim() || !anonKey.trim()) {
      setStatus('error');
      setErrorMsg('Vui lòng nhập đầy đủ Supabase URL và Anon Key.');
      return;
    }

    saveSupabaseCredentials(url, anonKey);

    const testData = await fetchCampaignsFromSupabase();
    if (testData !== null) {
      setStatus('success');
      setTimeout(() => {
        onConnected();
        onClose();
      }, 1000);
    } else {
      setStatus('error');
      setErrorMsg('Kết nối Supabase thất bại. Vui lòng kiểm tra lại URL, Anon Key và chắc chắn đã tạo bảng "campaigns".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-buzz" />
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              Cấu Hình Kết Nối Supabase Cloud DB
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleTestAndSave} className="p-6 space-y-4">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Dán <strong>Project URL</strong> và <strong>anon / public API Key</strong> từ Supabase Dashboard (Project Settings ➔ API) để kết nối dữ liệu chung cho tất cả mọi người.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xxxx.supabase.co"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-buzz outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
              Supabase Anon / Public Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-buzz outline-none"
            />
          </div>

          {status === 'success' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kết nối Supabase Cloud thành công! Đang đồng bộ dữ liệu...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-200">💡 Hướng dẫn tạo bảng trên Supabase:</p>
            <p>Vào Supabase ➔ <strong>SQL Editor</strong> ➔ Chạy câu lệnh tạo bảng <code className="text-buzz font-black">campaigns</code> (Xem câu lệnh SQL trong phần hướng dẫn bên dưới).</p>
          </div>

          {/* Footer */}
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={status === 'testing'}
              className="px-5 py-2 bg-buzz text-white text-xs font-black rounded-xl hover:bg-buzz-hover transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              <span>Lưu & Kết Nối Cloud</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
