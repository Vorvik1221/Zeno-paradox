import React from 'react';
import { Divide, Languages, HelpCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onOpenParadoxInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onChangeLanguage,
  onOpenParadoxInfo,
}) => {
  const brandTitle =
    language === 'pl'
      ? 'Paradoks Zenona: Nieskończony Dotyk'
      : language === 'uk'
      ? 'Парадокс Зенона: Нескінченний Дотик'
      : 'Zeno\'s Paradox: Infinite Touch';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
            <Divide className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white">
            {brandTitle}
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <a href="#simulator" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'pl' ? 'Symulator' : language === 'uk' ? 'Симулятор' : 'Simulator'}
          </a>
          <a href="#milestones" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'pl' ? 'Skale' : language === 'uk' ? 'Масштаби' : 'Scales'}
          </a>
          <a href="#science" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {language === 'pl' ? 'Fizyka kwantowa' : language === 'uk' ? 'Квантова фізика' : 'Quantum Physics'}
          </a>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onChangeLanguage('pl')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                language === 'pl' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              PL
            </button>
            <button
              onClick={() => onChangeLanguage('uk')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                language === 'uk' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              UA
            </button>
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                language === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenParadoxInfo}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-400/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>
              {language === 'pl'
                ? 'Istota paradoksu'
                : language === 'uk'
                ? 'Суть парадоксу'
                : 'The Paradox'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
