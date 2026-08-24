import React, { useRef, useState } from 'react';
import { X, Send, Building, User, Mail, Phone, LockKeyhole, Tag, Target, FileText, CheckCircle2 } from 'lucide-react';
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
  // Use DOM refs for instant 0ms typing with ZERO React re-renders on keystroke
  const fullNameRef = useRef<HTMLInputElement>(null);
  const workEmailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const categoryInterestRef = useRef<HTMLInputElement>(null);
  const brandInterestRef = useRef<HTMLInputElement>(null);
  const customNeedNoteRef = useRef<HTMLTextAreaElement>(null);

  const [actualNeed, setActualNeed] = useState('Tham khảo Data Benchmark chung');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = fullNameRef.current?.value || '';
    const workEmail = workEmailRef.current?.value || '';
    const phone = phoneRef.current?.value || '';
    const company = companyRef.current?.value || '';
    const categoryInterest = categoryInterestRef.current?.value || '';
    const brandInterest = brandInterestRef.current?.value || '';
    const customNeedNote = customNeedNoteRef.current?.value || '';

    if (!fullName.trim() || !workEmail.trim() || !phone.trim() || !company.trim()) {
      setError('Vui lòng điền thông tin cá nhân liên hệ để đăng ký.');
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
    setIsSubmittedSuccess(true);
  };

  const handleCloseModal = () => {
    setIsSubmittedSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 flex items-center justify-center p-4 md:p-6"
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 md:p-7 relative my-auto">
        <button
          onClick={handleCloseModal}
          type="button"
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmittedSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                ĐÃ GỬI THÔNG TIN DỰ ÁN THÀNH CÔNG!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-2 leading-relaxed max-w-sm mx-auto">
                Cảm ơn bạn đã đăng ký. Đội ngũ chuyên gia Buzzmetrics đã nhận được thông tin và sẽ liên hệ xác minh thông tin dự án qua SĐT/Email của bạn trong 15-30 phút để cấp quyền mở khóa BSI Campaign Full Version.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmittedSuccess(false);
                onSuccess();
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm rounded-xl transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              ✓ ĐÃ NẮM RÕ THÔNG TIN
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center mb-2 border border-orange-200 dark:border-orange-800 shadow-md">
                <LockKeyhole className="w-5 h-5" />
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                ĐĂNG KÝ MỞ KHÓA BÁO CÁO BSI CAMPAIGN
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1 leading-relaxed">
                Đăng ký thông tin để đội ngũ Buzzmetrics xác minh dự án & hỗ trợ mở khóa toàn bộ biểu đồ phân tích chuyên sâu.
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
                        ref={fullNameRef}
                        type="text"
                        required
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
                        ref={phoneRef}
                        type="tel"
                        required
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
                        ref={workEmailRef}
                        type="email"
                        required
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
                        ref={companyRef}
                        type="text"
                        required
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
                      ref={categoryInterestRef}
                      type="text"
                      placeholder="Ví dụ: Handhelds, Bia, Sữa..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                      THƯƠNG HIỆU QUAN TÂM (NHẬP CHỮ)
                    </label>
                    <input
                      ref={brandInterestRef}
                      type="text"
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
                    ref={customNeedNoteRef}
                    rows={2}
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
                  <span>Đang gửi thông tin đăng ký...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>GỬI ĐĂNG KÝ XÁC MINH MỞ KHÓA</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
