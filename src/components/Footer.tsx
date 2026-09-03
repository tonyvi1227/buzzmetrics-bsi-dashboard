import React from 'react';
import { Calendar, Phone, Mail } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface FooterProps {
  onOpenDevPassword?: () => void;
  isDevAuthed?: boolean;
  totalRecordsCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  totalRecordsCount = 318,
}) => {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 pt-6 pb-8 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 space-y-4">
      {/* Contact Details (Clean, single-row minimal styling without redundant headers) */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap font-medium">
          {/* Phone 1 */}
          <a
            href="tel:+84919040201"
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-buzz transition font-mono"
          >
            <Phone className="w-3.5 h-3.5 text-buzz" />
            <span>{t.footer.hotline}</span>
          </a>

          {/* Phone 2 */}
          <a
            href="tel:+84909267338"
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-buzz transition font-mono"
          >
            <Phone className="w-3.5 h-3.5 text-buzz" />
            <span>{t.footer.direct}</span>
          </a>

          {/* Email */}
          <a
            href="mailto:quynh.do@buzzmetrics.com"
            className="flex items-center gap-1.5 text-buzz hover:underline font-bold"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>quynh.do@buzzmetrics.com</span>
          </a>
        </div>
      </div>

      {/* Bottom Metadata Row: Copyright & Scope */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        {/* Left Copyright */}
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Buzzmetrics BSI Dashboard v4.41</span>
        </div>

        {/* Right Dataset Scope */}
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
          <Calendar className="w-3.5 h-3.5 text-buzz" />
          <span>{t.footer.datasetScope(totalRecordsCount)}</span>
        </div>
      </div>
    </footer>
  );
};
