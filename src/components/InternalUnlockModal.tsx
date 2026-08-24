import React, { useState } from 'react';
import { X, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { verifyInternalPassword, verifyClientPasscode, unlockUserPermanently } from '../utils/abTestingEngine';

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
    const isInternal = verifyInternalPassword(password);
    const isClientPass = verifyClientPasscode(password);

    if (isInternal || isClientPass) {
      setError('');
      setIsSuccess(true);
      unlockUserPermanently(isInternal);
      setTimeout(() => {
        setIsSuccess(false);
        setPassword('');
        onSuccess();
        onClose();
      }, 500);
    } else {
      setError('Mã xác thực không chính xác. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center mb-3 border border-orange-200 dark:border-orange-800">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            NHẬP MÃ CẤP QUYỀN TRUY CẬP
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
            Nhập Mã Xử Lý / Passcode được Buzzmetrics cung cấp để mở khóa 100% Báo cáo BSI Full.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center text-emerald-700 dark:text-emerald-300 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
            <p className="text-sm font-black">XÁC THỰC MÃ THÀNH CÔNG!</p>
            <p className="text-xs font-semibold">Dashboard đã được mở khóa toàn bộ 100%.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                MÃ XỬ LÝ / PASSCODE DÀNH CHO KHÁCH HÀNG / NỘI BỘ
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mã passcode..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-sm p-3 outline-none focus:ring-2 focus:ring-buzz"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
              {error && <p className="text-xs text-rose-500 font-bold mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-buzz hover:bg-orange-600 text-white font-black text-sm rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Xác Thực Mã & Mở Khóa Dashboard</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
