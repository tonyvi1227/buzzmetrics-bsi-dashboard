import React, { useState } from 'react';
import { X, Lock, KeyRound, Check, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, changePassword, adminPassword } = useAdmin();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPin, setNewPin] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAdmin(pinInput);
    if (success) {
      setPinInput('');
      onSuccess();
    } else {
      setError('Mật khẩu Admin không chính xác. Mật khẩu mặc định: CIMKT');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) return;
    changePassword(newPin);
    setIsChangingPass(false);
    setNewPin('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-buzz" />
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {isChangingPass ? 'Đổi Mật Khẩu Admin' : 'Xác Thực Mật Khẩu Admin'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!isChangingPass ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Vui lòng nhập mật khẩu Admin để truy cập quyền Quản lý Data & Import dữ liệu.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                Mật khẩu Admin
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Nhập mật khẩu (Mặc định: CIMKT)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-buzz outline-none"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Mật khẩu mặc định: <code className="text-buzz font-black bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800">CIMKT</code></span>
              <button
                type="button"
                onClick={() => setIsChangingPass(true)}
                className="font-black text-buzz hover:underline"
              >
                Đổi mật khẩu?
              </button>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-buzz text-white text-xs font-black rounded-xl hover:bg-buzz-hover transition shadow-sm"
              >
                Xác Nhận Admin
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Nhập mật khẩu Admin mới để thay thế cho mật khẩu mặc định (CIMKT).
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                Mật khẩu mới
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-buzz outline-none"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsChangingPass(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={!newPin.trim()}
                className="px-5 py-2 bg-buzz text-white text-xs font-black rounded-xl hover:bg-buzz-hover transition shadow-sm disabled:opacity-50"
              >
                Lưu Mật Khẩu Mới
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
