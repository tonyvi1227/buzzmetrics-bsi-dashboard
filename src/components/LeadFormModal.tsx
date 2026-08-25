import React, { useRef, useState, useEffect } from 'react';
import { X, Send, Building, User, Mail, Phone, LockKeyhole, Tag, Target, FileText, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { saveLeadRecord, isCorporateEmail } from '../utils/abTestingEngine';
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
  // Use DOM refs for instant 0ms typing with zero React re-renders on keystroke
  const fullNameRef = useRef<HTMLInputElement>(null);
  const workEmailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const categoryInterestRef = useRef<HTMLSelectElement>(null);
  const customCategoryRef = useRef<HTMLInputElement>(null);
  const brandInterestRef = useRef<HTMLInputElement>(null);
  const customNeedNoteRef = useRef<HTMLTextAreaElement>(null);

  const [actualNeed, setActualNeed] = useState('General Data Benchmark Reference');
  const [dataNeed, setDataNeed] = useState('Full 18-Month BSI Benchmark Data Access');
  const [selectedCategory, setSelectedCategory] = useState('Handhelds');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');

  // Lock background scroll and scroll to top when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailBlur = () => {
    const email = workEmailRef.current?.value || '';
    if (email && !isCorporateEmail(email)) {
      setError('Please use your official Work/Company email. Personal email domains (@gmail, @yahoo, @outlook, etc.) are not accepted.');
    } else if (error.includes('Personal email domains')) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = fullNameRef.current?.value || '';
    const workEmail = workEmailRef.current?.value || '';
    const phone = phoneRef.current?.value || '';
    const company = companyRef.current?.value || '';
    const category = selectedCategory === 'Other' ? (customCategoryRef.current?.value || 'Other') : selectedCategory;
    const brandInterest = brandInterestRef.current?.value || '';
    const customNeedNote = customNeedNoteRef.current?.value || '';

    if (!fullName.trim() || !workEmail.trim() || !phone.trim() || !company.trim()) {
      setError('Please fill in all required contact information (*).');
      return;
    }

    if (!isCorporateEmail(workEmail)) {
      setError('Please use your official Work/Company email. Personal email domains (@gmail, @yahoo, @outlook, @icloud, etc.) are not accepted.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    await saveLeadRecord({
      variant: variant,
      fullName: fullName.trim(),
      workEmail: workEmail.trim(),
      phone: phone.trim(),
      company: company.trim(),
      categoryInterest: category.trim() || 'General Category',
      brandInterest: brandInterest.trim(),
      actualNeed: actualNeed,
      dataNeed: dataNeed,
      customNeedNote: customNeedNote.trim(),
      leadScore: 'HIGH',
    });

    setIsSubmitting(false);
    setIsSubmittedSuccess(true);
  };

  const handleCloseModal = () => {
    setIsSubmittedSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 flex justify-center items-start p-2 sm:p-4 md:p-6 pt-3 sm:pt-8 md:pt-12 pb-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[92vh] sm:max-h-[88vh] md:max-h-[660px] flex flex-col overscroll-contain overflow-hidden relative">
        {/* Sticky Header Close Button */}
        <button
          onClick={handleCloseModal}
          type="button"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmittedSuccess ? (
          <div className="text-center py-8 sm:py-10 px-4 sm:px-6 space-y-4 max-w-md mx-auto my-auto animate-fadeIn">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                REGISTRATION SUBMITTED SUCCESSFULLY!
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-2 leading-relaxed">
                Thank you for your interest! The Buzzmetrics Business Development team has received your project details and will contact you via Phone/Email to verify and grant your Access Passcode shortly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmittedSuccess(false);
                onSuccess();
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm rounded-xl transition shadow cursor-pointer"
            >
              ✓ GOT IT
            </button>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="text-center p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-white dark:bg-slate-900">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center mb-1 border border-orange-200 dark:border-orange-800 shadow-sm">
                <LockKeyhole className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Register to unlock BSI Campaign Insights
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed mt-0.5 sm:mt-1">
                Submit your project details for the Buzzmetrics team to verify and grant access to full analytics.
              </p>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-5 overflow-y-auto overscroll-contain flex-1 space-y-3 sm:space-y-4">
              {/* Responsive 2-Column Layout on Tablet/PC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-5">
                
                {/* LEFT COLUMN: Contact Info & Industry */}
                <div className="space-y-3 sm:space-y-3.5">
                  {/* SECTION 1: PERSONAL & COMPANY CONTACT INFO */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 sm:space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
                      <User className="w-3 h-3" /> 1. CONTACT INFORMATION (*)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          FULL NAME (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={fullNameRef}
                            type="text"
                            required
                            placeholder="e.g. Nguyen Van A"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 sm:p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 sm:top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          PHONE / ZALO (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={phoneRef}
                            type="tel"
                            required
                            placeholder="+84 90x xxx xxx"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 sm:top-3" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          WORK EMAIL (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={workEmailRef}
                            type="email"
                            required
                            onBlur={handleEmailBlur}
                            placeholder="name@company.com"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 sm:p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 sm:top-3" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Corporate domain (no @gmail, @yahoo)</span>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          COMPANY / BRAND (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={companyRef}
                            type="text"
                            required
                            placeholder="e.g. Unilever, Vinamilk..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 sm:p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 sm:top-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: INDUSTRY & TARGET BRAND */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 sm:space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
                      <Tag className="w-3 h-3" /> 2. INDUSTRY & BRAND OF INTEREST (*)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          INDUSTRY / CATEGORY (*)
                        </label>
                        <select
                          ref={categoryInterestRef}
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 sm:p-2.5 outline-none focus:ring-2 focus:ring-buzz cursor-pointer"
                        >
                          <option value="Handhelds">Handhelds (Smartphones/Tech)</option>
                          <option value="Alcoholic drink">Alcoholic Drink (Beer, Spirits)</option>
                          <option value="Non-alcoholic drink">Non-alcoholic Drink (RTD, Tea)</option>
                          <option value="Dairy">Dairy & Milk Nutrition</option>
                          <option value="Home Care">Home Care (Detergent, Cleaners)</option>
                          <option value="Personal Care">Personal Care (Shampoo, Skin)</option>
                          <option value="Banking">Banking & Financial Services</option>
                          <option value="Real Estate">Real Estate & Property</option>
                          <option value="F&B">F&B & Restaurant Chains</option>
                          <option value="Automotive">Automotive & Motorbikes</option>
                          <option value="E-commerce">E-commerce & Retail</option>
                          <option value="Other">Other Category...</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          TARGET BRAND
                        </label>
                        <input
                          ref={brandInterestRef}
                          type="text"
                          placeholder="e.g. Heineken, Samsung, OMO..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 sm:p-2.5 outline-none focus:ring-2 focus:ring-buzz"
                        />
                      </div>
                    </div>

                    {selectedCategory === 'Other' && (
                      <input
                        ref={customCategoryRef}
                        type="text"
                        placeholder="Please specify your industry category..."
                        className="w-full bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 sm:p-2.5 outline-none focus:ring-2 focus:ring-buzz animate-fadeIn"
                      />
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Section 3 (Needs) & Additional Requirements */}
                <div className="space-y-3 sm:space-y-3.5 flex flex-col justify-between">
                  
                  {/* SECTION 3: CURRENT NEED & DATA USAGE OBJECTIVE */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 sm:space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
                      <Target className="w-3 h-3" /> 3. PROJECT NEED & DATA OBJECTIVE (*)
                    </span>

                    {/* Need hiện tại */}
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                        CURRENT NEED / PURPOSE (*)
                      </label>
                      <div className="grid grid-cols-1 gap-1 sm:gap-1.5">
                        {[
                          'General Data Benchmark Reference',
                          'Upcoming Campaign / Product Launch Planning',
                          'Competitor BSI & Sentiment Benchmarking',
                          'Post-Campaign Performance & ROI Evaluation',
                        ].map((needOption) => (
                          <label
                            key={needOption}
                            onClick={() => setActualNeed(needOption)}
                            className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl border text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                              actualNeed === needOption
                                ? 'bg-orange-50 dark:bg-orange-950/80 border-buzz text-buzz shadow-2xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="actualNeedRadio"
                              checked={actualNeed === needOption}
                              onChange={() => setActualNeed(needOption)}
                              className="accent-orange-500"
                            />
                            <span className="leading-tight">{needOption}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nhu cầu với dữ liệu */}
                    <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
                        <Database className="w-3 h-3 text-buzz" /> DATA REQUIREMENT (*)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
                        {[
                          { id: 'Full 18-Month BSI Benchmark Data Access', label: '18-Month BSI Dataset' },
                          { id: 'Category Deep-Dive & Advanced Spider Radar', label: 'Category & Radar Deep-Dive' },
                          { id: 'Top Influencer Landscape & KOL Vetting', label: 'Influencer / KOL Landscape' },
                          { id: 'Tailored Custom Social Listening Report', label: 'Custom Social Listening' },
                        ].map((item) => (
                          <label
                            key={item.id}
                            onClick={() => setDataNeed(item.id)}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[10px] sm:text-[11px] font-bold transition cursor-pointer ${
                              dataNeed === item.id
                                ? 'bg-orange-50 dark:bg-orange-950/80 border-buzz text-buzz'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="dataNeedRadio"
                              checked={dataNeed === item.id}
                              onChange={() => setDataNeed(item.id)}
                              className="accent-orange-500"
                            />
                            <span className="leading-tight">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nhu cầu khác */}
                    <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> ADDITIONAL REQUIREMENTS / NOTES
                      </label>
                      <textarea
                        ref={customNeedNoteRef}
                        rows={2}
                        placeholder="Enter specific campaign objectives, scope, or timeline..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 outline-none focus:ring-2 focus:ring-buzz"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-3.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2 sm:mt-auto"
                  >
                    {isSubmitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="uppercase tracking-wider">SUBMIT REGISTRATION FOR ACCESS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
