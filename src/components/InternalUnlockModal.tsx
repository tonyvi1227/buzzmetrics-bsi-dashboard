import React, { useState } from 'react';
import { X, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { verifyInternalPassword, unlockUserPermanently } from '../utils/abTestingEngine';

interface InternalUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InternalUnlockModal: React.FC<InternalUnlockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyInternalPassword(password)) {
      setError('');
      setIsSuccess(true);
      unlockUserPermanently(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPassword('');
        onSuccess();
        onClose();
      }, 600);
    } else {
      setError('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-buzz-light dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center mb-3 border border-buzz-border dark:border-orange-800">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            MỞ KHÓA DÀNH CHO NHÂN SỰ NỘI BỘ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Nhập mật khẩu nội bộ Buzzmetrics để mở khóa 100% bản Full không rào cản.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center text-emerald-700 dark:text-emerald-300 space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 animate-bounce" />
            <p className="text-sm font-black">XÁC THỰC NỘI BỘ THÀNH CÔNG!</p>
            <p className="text-xs font-semibold">Đã lưu thiết bị của bạn. Dashboard đã mở khóa toàn bộ 100%.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                MẬT KHẨU NỘI BỘ / ADMIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu nội bộ..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-sm p-3 outline-none focus:ring-2 focus:ring-buzz"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
              {error && <p className="text-xs text-rose-500 font-bold mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-buzz hover:bg-orange-600 text-white font-black text-sm rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Xác Thực & Mở Khóa Dashboard</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
