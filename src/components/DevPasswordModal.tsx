import React, { useState } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';

interface DevPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DevPasswordModal: React.FC<DevPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === 'devonly') {
      localStorage.setItem('buzz_dev_authed', 'true');
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <KeyRound className="w-5 h-5 text-buzz" />
            <h3 className="text-sm font-black uppercase tracking-wider">DEV ACCESS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              autoFocus
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-buzz"
            />
            {error && <p className="text-[11px] font-bold text-rose-500 mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-buzz hover:bg-buzz-dark text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
          >
            XÁC NHẬN
          </button>
        </form>
      </div>
    </div>
  );
};
