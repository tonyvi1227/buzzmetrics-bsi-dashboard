import React, { useState } from 'react';
import { X, Bot, Send, CheckCircle2, User, Phone, Mail, Building, Tag, Target, FileText } from 'lucide-react';
import { saveLeadRecord } from '../utils/abTestingEngine';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Step 1: Category & Brand Type-in
  const [categoryInterest, setCategoryInterest] = useState('');
  const [brandInterest, setBrandInterest] = useState('');
  
  // Step 2: Actual Need
  const [actualNeed, setActualNeed] = useState('');
  const [customNeedNote, setCustomNeedNote] = useState('');

  // Step 3: Contact Info
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryInterest.trim()) {
      setError('Vui lòng nhập tên ngành hàng bạn quan tâm.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2NeedSelect = (needOption: string) => {
    setActualNeed(needOption);
    setStep(3);
  };

  const handleFinalLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !phone.trim() || !company.trim()) {
      setError('Vui lòng điền thông tin cá nhân liên hệ.');
      return;
    }

    setIsSubmitting(true);

    const isWorkEmail = !workEmail.endsWith('@gmail.com') && !workEmail.endsWith('@yahoo.com') && !workEmail.endsWith('@hotmail.com');
    const leadScore = isWorkEmail ? 'HIGH' : 'MEDIUM';

    const aiSummary = `Ngành hàng: ${categoryInterest}. Thương hiệu: ${brandInterest || 'N/A'}. Nhu cầu: ${actualNeed}. ${customNeedNote ? `Ghi chú: ${customNeedNote}` : ''}`;

    await saveLeadRecord({
      variant: 'B',
      fullName: fullName.trim(),
      workEmail: workEmail.trim(),
      phone: phone.trim(),
      company: company.trim(),
      categoryInterest: categoryInterest.trim(),
      brandInterest: brandInterest.trim(),
      actualNeed: actualNeed,
      customNeedNote: customNeedNote.trim(),
      aiConversationSummary: aiSummary,
      leadScore: leadScore,
    });

    setIsSubmitting(false);
    setStep(4);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 relative flex flex-col max-h-[90vh] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-buzz-light dark:bg-orange-950 text-buzz border border-buzz-border dark:border-orange-800">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                BUZZMETRICS AI CONSULTANT
                <span className="text-[10px] font-black bg-buzz text-white px-2 py-0.5 rounded-full">ONLINE</span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Xác minh nhu cầu 30 giây để AI mở khóa 100% Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* AI Message 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-buzz text-white flex items-center justify-center font-black text-xs flex-shrink-0">
              AI
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
              <p>Xin chào! Tôi là AI Insight Assistant của Buzzmetrics.</p>
              <p>Hãy nhập tên **Ngành hàng** và **Thương hiệu** bạn đang phụ trách hoặc quan tâm:</p>
            </div>
          </div>

          {/* STEP 1 TYPE-IN FORM */}
          {step === 1 && (
            <div className="pl-11 animate-fadeIn">
              <form onSubmit={handleStep1Submit} className="space-y-3 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    NGÀNH HÀNG (NHẬP CHỮ) (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryInterest}
                    onChange={(e) => setCategoryInterest(e.target.value)}
                    placeholder="Ví dụ: Handhelds, Bia, Sữa bột, E-commerce..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    THƯƠNG HIỆU QUAN TÂM (TÙY CHỌN)
                  </label>
                  <input
                    type="text"
                    value={brandInterest}
                    onChange={(e) => setBrandInterest(e.target.value)}
                    placeholder="Ví dụ: Samsung, Heineken, Vinamilk..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>TIẾP TỤC BƯỚC 2 ➔</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 2 USER RESPONSE & AI FOLLOW UP */}
          {step >= 2 && (
            <>
              <div className="flex justify-end">
                <div className="bg-buzz text-white p-3 rounded-2xl rounded-tr-none text-xs font-bold max-w-[80%] shadow-sm">
                  Ngành: {categoryInterest} {brandInterest ? `(Brand: ${brandInterest})` : ''}
                </div>
              </div>

              <div className="flex items-start gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-buzz text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  AI
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                  <p>Tuyệt vời! Đối với **{categoryInterest}**.</p>
                  <p>Mục tiêu & Nhu cầu thực tế sắp tới của bạn là gì?</p>
                </div>
              </div>
            </>
          )}

          {/* STEP 2 OPTIONS */}
          {step === 2 && (
            <div className="space-y-2 pl-11 animate-fadeIn">
              {[
                'Tham khảo Data Benchmark chung',
                'Chuẩn bị chạy Campaign / Product Launch mới',
                'So sánh BSI & Sentiment đối thủ cùng ngành',
                'Cần Báo cáo / Report Đánh giá sau chiến dịch',
              ].map((needOption) => (
                <button
                  key={needOption}
                  onClick={() => handleStep2NeedSelect(needOption)}
                  className="w-full p-3 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/60 border border-slate-200 dark:border-slate-700 hover:border-buzz text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs text-left transition cursor-pointer shadow-sm"
                >
                  {needOption}
                </button>
              ))}
            </div>
          )}

          {/* STEP 3 USER RESPONSE & AI CONTACT FORM */}
          {step >= 3 && (
            <>
              <div className="flex justify-end">
                <div className="bg-buzz text-white p-3 rounded-2xl rounded-tr-none text-xs font-bold max-w-[80%] shadow-sm">
                  Nhu cầu: {actualNeed}
                </div>
              </div>

              <div className="flex items-start gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-buzz text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  AI
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                  <p>Cảm ơn bạn! Điền thông tin cá nhân liên hệ bên dưới để AI kích hoạt mở khóa 100% Dashboard ngay lập tức:</p>
                </div>
              </div>
            </>
          )}

          {/* STEP 3 FINAL CONTACT FORM */}
          {step === 3 && (
            <div className="pl-11 animate-fadeIn">
              <form onSubmit={handleFinalLeadSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">Họ và tên (*)</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">SĐT / Zalo (*)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="090x xxx xxx"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">Email Công Ty (*)</label>
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase">Tên Công Ty (*)</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Vinamilk, Samsung..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase">Ghi chú nhu cầu thêm (tùy chọn)</label>
                  <input
                    type="text"
                    value={customNeedNote}
                    onChange={(e) => setCustomNeedNote(e.target.value)}
                    placeholder="Ghi chú kế hoạch/ngân sách chiến dịch..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>

                {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>KÍCH HOẠT AI MỞ KHÓA DASHBOARD NOW</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 4 SUCCESS MESSAGE */}
          {step === 4 && (
            <div className="pl-11 animate-fadeIn">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center text-emerald-700 dark:text-emerald-300 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 animate-bounce" />
                <p className="text-xs font-black">XÁC MINH AI THÀNH CÔNG!</p>
                <p className="text-[11px] font-semibold">Dashboard đang tự động mở khóa 100% cho bạn...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
