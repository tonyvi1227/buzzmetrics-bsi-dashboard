import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string | React.ReactNode;
  title?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, title }) => {
  return (
    <div className="relative inline-flex items-center group/tooltip">
      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-buzz dark:hover:text-buzz cursor-help transition-colors flex-shrink-0" />
      
      {/* Tooltip Popover Box */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/tooltip:block w-64 p-3 bg-slate-900/95 text-slate-100 text-[11px] rounded-xl shadow-xl z-50 pointer-events-none border border-slate-700/80 leading-relaxed animate-fadeIn">
        {title && (
          <div className="font-black text-xs text-buzz mb-1 uppercase tracking-wide border-b border-slate-800 pb-1">
            {title}
          </div>
        )}
        <div className="font-semibold text-slate-200">{content}</div>
        
        {/* Bottom Arrow Pointer */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95" />
      </div>
    </div>
  );
};
