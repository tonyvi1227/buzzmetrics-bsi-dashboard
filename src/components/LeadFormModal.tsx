import React, { useState } from 'react';
import { X, Send, Building, User, Mail, Phone, LockKeyhole, Tag, Target, FileText } from 'lucide-react';
import { saveLeadRecord } from '../utils/abTestingEngine';
import { ABVariant } from '../types/leadGen';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  variant?: ABVariant;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  variant = 'A',
}) => {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  
  // Type-in fields instead of fixed dropdowns
  const [categoryInterest, setCategoryInterest] = useState('');
  const [brandInterest, setBrandInterest] = useState('');
  
  // Actual Intent / Need fields
  const [actualNeed, setActualNeed] = useState('Tham khảo Data Benchmark chung');
  const [customNeedNote, setCustomNeedNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !phone.trim() || !company.trim()) {
      setError('Vui lòng điền thông tin cá nhân liên hệ để mở khóa.');
      return;
    }

    if (!workEmail.includes('@')) {
      setError('Vui lòng nhập đúng định dạng Email công ty/doanh nghiệp.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const isWorkEmail = !workEmail.endsWith('@gmail.com') && !workEmail.endsWith('@yahoo.com') && !workEmail.endsWith('@hotmail.com');
    const leadScore = isWorkEmail ? 'HIGH' : 'MEDIUM';

    await saveLeadRecord({
      variant: variant,
      fullName: fullName.trim(),
      workEmail: workEmail.trim(),
      phone: phone.trim(),
      company: company.trim(),
      categoryInterest: categoryInterest.trim() || 'General Category',
      brandInterest: brandInterest.trim(),
      actualNeed: actualNeed,
      customNeedNote: customNeedNote.trim(),
      leadScore: leadScore,
    });

    setIsSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 md:p-7 relative my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center mb-2 border border-orange-200 dark:border-orange-800 shadow-md">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            MỞ KHÓA BÁO CÁO BSI CAMPAIGN
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1 leading-relaxed">
            Đăng ký thông tin để truy cập các biểu đồ chuyên sâu phân tích từng chiến dịch lọt Top BSI Campaign hàng tháng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SECTION 1: PERSONAL CONTACT INFO */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
              <User className="w-3 h-3" /> 1. THÔNG TIN LIÊN HỆ CÁ NHÂN (*)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  HỌ VÀ TÊN (*)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  SĐT / ZALO (*)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="090x xxx xxx"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  EMAIL CÔNG TY (*)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  CÔNG TY / THƯƠNG HIỆU (*)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ví dụ: Vinamilk, Samsung..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CATEGORY & BRAND TYPE-IN */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
              <Tag className="w-3 h-3" /> 2. NGÀNH HÀNG & THƯƠNG HIỆU QUAN TÂM
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  NGÀNH HÀNG (NHẬP CHỮ)
                </label>
                <input
                  type="text"
                  value={categoryInterest}
                  onChange={(e) => setCategoryInterest(e.target.value)}
                  placeholder="Ví dụ: Handhelds, Bia, Sữa..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  THƯƠNG HIỆU QUAN TÂM (NHẬP CHỮ)
                </label>
                <input
                  type="text"
                  value={brandInterest}
                  onChange={(e) => setBrandInterest(e.target.value)}
                  placeholder="Ví dụ: Heineken, Samsung, Tiger..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ACTUAL INTENT & NEED */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
              <Target className="w-3 h-3" /> 3. NHU CẦU THỰC TẾ CỦA BẠN
            </span>

            <div className="space-y-1.5">
              {[
                'Tham khảo Data Benchmark chung',
                'Chuẩn bị chạy Campaign / Product Launch mới',
                'So sánh BSI & Sentiment đối thủ cùng ngành',
                'Cần Báo cáo / Report Đánh giá sau chiến dịch',
              ].map((needOption) => (
                <label
                  key={needOption}
                  onClick={() => setActualNeed(needOption)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    actualNeed === needOption
                      ? 'bg-orange-50 dark:bg-orange-950/80 border-buzz text-buzz shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="actualNeedRadio"
                    checked={actualNeed === needOption}
                    onChange={() => setActualNeed(needOption)}
                    className="accent-orange-500"
                  />
                  <span>{needOption}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1">
                <FileText className="w-3 h-3" /> GHI CHÚ NHU CẦU CỤ THỂ KHÁC (NẾU CÓ)
              </label>
              <textarea
                rows={2}
                value={customNeedNote}
                onChange={(e) => setCustomNeedNote(e.target.value)}
                placeholder="Nhập yêu cầu riêng hoặc ngân sách/kế hoạch chiến dịch sắp tới..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 outline-none focus:ring-2 focus:ring-buzz"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-buzz hover:bg-orange-600 text-white font-black text-xs md:text-sm rounded-xl transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Đang gửi thông tin mở khóa...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>MỞ KHÓA BÁO CÁO DASHBOARD NOW</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
