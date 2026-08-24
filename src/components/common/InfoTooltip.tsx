import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'bottom' | 'top';
  align?: 'left' | 'center' | 'right';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  title,
  position = 'bottom',
  align = 'center',
}) => {
  const isBottom = position === 'bottom';

  // Alignment classes for horizontal placement
  const alignClasses =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  const arrowAlignClasses =
    align === 'left'
      ? 'left-3'
      : align === 'right'
      ? 'right-3'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div className="relative inline-flex items-center group/tooltip">
      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-buzz dark:hover:text-buzz cursor-help transition-colors flex-shrink-0" />
      
      {/* Tooltip Popover Box */}
      <div
        className={`absolute ${
          isBottom ? 'top-full mt-2' : 'bottom-full mb-2'
        } ${alignClasses} hidden group-hover/tooltip:block w-64 p-3 bg-slate-900/95 backdrop-blur-md text-slate-100 text-[11px] rounded-xl shadow-2xl z-[70] pointer-events-none border border-slate-700/80 leading-relaxed animate-fadeIn`}
      >
        {title && (
          <div className="font-black text-xs text-buzz mb-1 uppercase tracking-wide border-b border-slate-800 pb-1">
            {title}
          </div>
        )}
        <div className="font-medium text-slate-200">{content}</div>
        
        {/* Arrow Pointer */}
        {isBottom ? (
          <div
            className={`absolute bottom-full ${arrowAlignClasses} -mb-1 border-4 border-transparent border-b-slate-900/95`}
          />
        ) : (
          <div
            className={`absolute top-full ${arrowAlignClasses} -mt-1 border-4 border-transparent border-t-slate-900/95`}
          />
        )}
      </div>
    </div>
  );
};
