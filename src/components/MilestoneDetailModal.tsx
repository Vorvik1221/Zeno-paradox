import React from 'react';
import { X, Sparkles, Atom, ShieldAlert, Layers } from 'lucide-react';
import { ScaleMilestone, formatDistance, SupportedLanguage } from '../types';

interface MilestoneDetailModalProps {
  milestone: ScaleMilestone | null;
  onClose: () => void;
  language: SupportedLanguage;
}

export const MilestoneDetailModal: React.FC<MilestoneDetailModalProps> = ({
  milestone,
  onClose,
  language,
}) => {
  if (!milestone) return null;

  const formatted = formatDistance(milestone.distanceMeters);

  const title = language === 'pl' ? milestone.namePl : language === 'uk' ? milestone.nameUk : milestone.nameEn;
  const description = language === 'pl' ? milestone.descriptionPl : language === 'uk' ? milestone.descriptionUk : milestone.descriptionEn;
  const scientificDetails = language === 'pl' ? milestone.scientificDetailsPl : language === 'uk' ? milestone.scientificDetailsUk : milestone.descriptionEn;
  const structures = language === 'pl' ? milestone.structuresPl : milestone.structuresUk;
  const physicsPrinciple = language === 'pl' ? milestone.physicsPrinciplePl : milestone.physicsPrincipleUk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow accent */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: milestone.themeColor }}
        />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                {milestone.japaneseTag}
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {formatted.full}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Main narrative */}
          <div>
            <h4 className="text-xs uppercase font-mono text-slate-400 mb-1">
              {language === 'pl'
                ? 'Opis obserwacji'
                : language === 'uk'
                ? 'Опис спостереження'
                : 'Observation Description'}
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Deep scientific detail */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs uppercase font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {language === 'pl'
                  ? 'Analiza naukowa'
                  : language === 'uk'
                  ? 'Науковий аналіз'
                  : 'Scientific Insight'}
              </span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {scientificDetails}
            </p>
          </div>

          {/* Structures */}
          <div>
            <h4 className="text-xs uppercase font-mono text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'pl'
                  ? 'Struktury anatomiczne i fizyczne'
                  : language === 'uk'
                  ? 'Анатомічні та фізичні структури'
                  : 'Observable Structures'}
              </span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {structures.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Physics principle */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
            <h4 className="text-xs uppercase font-mono text-indigo-300 mb-1 flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {language === 'pl'
                  ? 'Fundamentalne prawo fizyki'
                  : language === 'uk'
                  ? 'Фундаментальний фізичний закон'
                  : 'Underlying Physics'}
              </span>
            </h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              {physicsPrinciple}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            {language === 'pl' ? 'Rozumiem' : language === 'uk' ? 'Зрозуміло' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
