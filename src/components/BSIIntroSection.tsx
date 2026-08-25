import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Users, FileText, Smile, Target, Share2, Award, ExternalLink } from 'lucide-react';

export const BSIIntroSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const metrics = [
    {
      num: '01',
      name: 'BUZZ VOLUME',
      desc: 'Total discussion volume, measuring the overall noise level and social buzz scale of the campaign across platforms.',
      icon: MessageSquare,
    },
    {
      num: '02',
      name: 'QUALIFIED USERS',
      desc: 'Total volume of authentic, high-quality users actively engaging in discussions, filtering out spam and bots.',
      icon: Users,
    },
    {
      num: '03',
      name: 'CONTENT FROM QUALIFIED USERS',
      desc: 'Discussion volume generated specifically by qualified users focused on brand messages and product features (CFQU).',
      icon: FileText,
    },
    {
      num: '04',
      name: 'SENTIMENT SCORE FROM QUALIFIED USERS',
      desc: 'Net emotional perception index calculated strictly across qualified users, reflecting genuine brand affinity.',
      icon: Smile,
    },
    {
      num: '05',
      name: 'RELEVANCE SCORE FROM QUALIFIED USERS',
      desc: 'Proportion of discussions genuinely relevant to the campaign core message and key brand attributes.',
      icon: Target,
    },
    {
      num: '06',
      name: 'EARNED MEDIA FROM QUALIFIED USERS',
      desc: 'Spontaneous, organic discussions created by qualified users without brand-paid distribution push.',
      icon: Share2,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 transition">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-buzz border border-orange-200 dark:border-orange-900 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              ABOUT BSI TOP10
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/80 text-buzz border border-orange-200 dark:border-orange-900">
              6 Measurement Pillars
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            The BSI — <strong>Buzzmetrics Social Index</strong> is an indicator that helps assess the effectiveness of social media campaigns/events/influencers in a comprehensive way. With <strong>BSI Top10 Ranking</strong>, Buzzmetrics will tell you which campaigns/events/influencers are making a real impact and making a positive impact for the online community.{' '}
            <a
              href="https://www.buzzmetrics.com/bai-viet-bsi/buzzmetrics-social-index-bsi-la-gi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-buzz hover:underline font-bold inline-flex items-center gap-1 transition ml-1"
            >
              <span>Learn more about BSI Top10</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="px-3 py-1.5 rounded-xl text-xs font-black bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/60 dark:hover:bg-orange-900/80 text-buzz border border-orange-200 dark:border-orange-900 transition flex items-center gap-1.5 cursor-pointer shadow-sm self-end md:self-center flex-shrink-0"
        >
          <span>{isExpanded ? 'Hide 6 Pillars' : 'Explore 6 Pillars'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable 6 Pillars Grid */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-200">
          {metrics.map(m => {
            const Icon = m.icon;
            return (
              <div
                key={m.num}
                className="p-3.5 rounded-xl bg-orange-50/40 dark:bg-slate-800/60 border border-orange-100 dark:border-slate-800 flex items-start gap-3 hover:border-buzz/50 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-buzz text-white flex items-center justify-center font-black text-xs shadow-sm flex-shrink-0">
                  {m.num}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-buzz" />
                    <h4 className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
