import React from 'react';
import { MILESTONES, ScaleMilestone, formatDistance, SupportedLanguage } from '../types';

interface MilestoneNavigatorProps {
  currentDistance: number;
  onSelectMilestone: (distance: number) => void;
  language: SupportedLanguage;
}

export const MilestoneNavigator: React.FC<MilestoneNavigatorProps> = ({
  currentDistance,
  onSelectMilestone,
  language,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
          {language === 'pl'
            ? 'Skala wielkości (poziomy obserwacji)'
            : language === 'uk'
            ? 'Шкала масштабів (рівні спостереження)'
            : 'Scale Milestones (Observation Levels)'}
        </h3>
        <span className="text-xs text-slate-500 font-mono">
          {language === 'pl' ? '9 kluczowych etapów' : language === 'uk' ? '9 ключових рубежів' : '9 key milestones'}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {MILESTONES.map((m) => {
          // Check if currently near this milestone
          const isActive = Math.abs(Math.log10(currentDistance) - Math.log10(m.distanceMeters)) < 0.45;
          const formatted = formatDistance(m.distanceMeters);

          const displayName = language === 'pl' ? m.namePl : language === 'uk' ? m.nameUk : m.nameEn;

          return (
            <button
              key={m.id}
              onClick={() => onSelectMilestone(m.distanceMeters)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-750 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-amber-400/90 leading-tight">
                {m.japaneseTag.split(' ')[0]}
              </span>
              <span className="text-[11px] font-semibold text-slate-200 mt-0.5 line-clamp-1">
                {displayName.split(' ')[0]}
              </span>
              <span className={`text-[10px] font-mono mt-1 ${isActive ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                {formatted.full}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
