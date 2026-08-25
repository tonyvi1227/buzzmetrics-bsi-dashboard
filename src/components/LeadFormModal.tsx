import React, { useRef, useState, useEffect } from 'react';
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

  const [actualNeed, setActualNeed] = useState('General Data Benchmark Reference');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');

  // Lock background scroll when modal is open to ensure only internal box scrolls
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

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
      setError('Please fill in all required contact information.');
      return;
    }

    if (!workEmail.includes('@')) {
      setError('Please enter a valid work email address.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex justify-center items-start p-3 sm:p-6 pt-6 sm:pt-12 md:pt-16 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl lg:max-w-4xl max-h-[85vh] md:max-h-[640px] flex flex-col overscroll-contain overflow-hidden relative">
        {/* Sticky Header Close Button */}
        <button
          onClick={handleCloseModal}
          type="button"
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmittedSuccess ? (
          <div className="text-center py-8 px-6 space-y-4 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                REGISTRATION SUBMITTED SUCCESSFULLY!
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-2 leading-relaxed">
                The Buzzmetrics team has received your request and will contact you via Phone/Email to verify and provide your Access Passcode shortly.
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
            <div className="text-center p-5 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-white dark:bg-slate-900">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/80 text-buzz mx-auto flex items-center justify-center mb-1.5 border border-orange-200 dark:border-orange-800 shadow-sm">
                <LockKeyhole className="w-4 h-4" />
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Register to unlock BSI Campaign Insights
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed mt-1">
                Submit your project details for the Buzzmetrics team to verify and grant access to full analytics.
              </p>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto overscroll-contain flex-1 space-y-4">
              {/* Responsive 2-Column Layout on PC / Desktop screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* LEFT COLUMN: Section 1 & Section 2 */}
                <div className="space-y-4">
                  {/* SECTION 1: PERSONAL CONTACT INFO */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
                      <User className="w-3 h-3" /> 1. CONTACT INFORMATION (*)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          FULL NAME (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={fullNameRef}
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          PHONE / MOBILE (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={phoneRef}
                            type="tel"
                            required
                            placeholder="+84 90x xxx xxx"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          WORK EMAIL (*)
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
                          COMPANY / BRAND (*)
                        </label>
                        <div className="relative">
                          <input
                            ref={companyRef}
                            type="text"
                            required
                            placeholder="e.g. Vinamilk, Samsung..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 pl-8 outline-none focus:ring-2 focus:ring-buzz"
                          />
                          <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: CATEGORY & BRAND */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
                      <Tag className="w-3 h-3" /> 2. CATEGORY & BRAND OF INTEREST (*)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          CATEGORY
                        </label>
                        <input
                          ref={categoryInterestRef}
                          type="text"
                          placeholder="e.g. Handhelds, Beer, Dairy..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                          TARGET BRAND
                        </label>
                        <input
                          ref={brandInterestRef}
                          type="text"
                          placeholder="e.g. Heineken, Samsung, Tiger..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-buzz"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Section 3 & Submit Button */}
                <div className="space-y-4 flex flex-col justify-between">
                  {/* SECTION 3: ACTUAL INTENT & NEED */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-buzz flex items-center gap-1">
                      <Target className="w-3 h-3" /> 3. PROJECT OBJECTIVE (*)
                    </span>

                    <div className="space-y-1.5">
                      {[
                        'General Data Benchmark Reference',
                        'Upcoming Campaign / Product Launch Planning',
                        'Competitor BSI & Sentiment Benchmarking',
                        'Post-Campaign Performance & ROI Evaluation Report',
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
                        <FileText className="w-3 h-3" /> ADDITIONAL REQUIREMENT
                      </label>
                      <textarea
                        ref={customNeedNoteRef}
                        rows={2}
                        placeholder="Enter specific campaign objectives, scope, or timeline..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl text-xs p-2 outline-none focus:ring-2 focus:ring-buzz"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-rose-500 font-bold">{error}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-buzz hover:bg-orange-600 text-white font-black text-xs md:text-sm rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-2 mt-auto"
                  >
                    {isSubmitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SUBMIT REGISTRATION FOR ACCESS</span>
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
