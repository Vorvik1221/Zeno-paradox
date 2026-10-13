import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Divide, ChevronRight, Zap } from 'lucide-react';
import { formatDistance, INITIAL_DISTANCE, MIN_DISTANCE, MAX_DISTANCE, SupportedLanguage } from '../types';

interface ControlsPanelProps {
  currentDistance: number;
  onDistanceChange: (newDistance: number) => void;
  onHalveDistance: () => void;
  onDoubleDistance: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playSpeed: number;
  onChangeSpeed: (speed: number) => void;
  language: SupportedLanguage;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  currentDistance,
  onDistanceChange,
  onHalveDistance,
  onDoubleDistance,
  isPlaying,
  onTogglePlay,
  onReset,
  playSpeed,
  onChangeSpeed,
  language,
}) => {
  const logMax = Math.log10(MAX_DISTANCE);
  const logMin = Math.log10(MIN_DISTANCE);
  const currentLog = Math.log10(Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, currentDistance)));
  const progressRatio = Math.max(0, Math.min(1, (logMax - currentLog) / (logMax - logMin)));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value); // 0 to 1
    const newLog = logMax - val * (logMax - logMin);
    const newDist = Math.pow(10, newLog);
    onDistanceChange(newDist);
  };

  const currentN = Math.max(0, Math.round(Math.log2(INITIAL_DISTANCE / Math.max(MIN_DISTANCE, currentDistance))));
  const formatted = formatDistance(currentDistance);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Top metrics bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-mono text-slate-400 block mb-1">
            {language === 'pl'
              ? 'Aktualna odległość'
              : language === 'uk'
              ? 'Поточна відстань'
              : 'Current Distance'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {formatted.full}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (1 / 2<sup>{currentN}</sup>)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs uppercase font-mono text-slate-400 block mb-1">
              {language === 'pl'
                ? 'Krok dychotomii'
                : language === 'uk'
                ? 'Ітерація дихотомії'
                : 'Dichotomy Step'}
            </span>
            <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {language === 'pl' ? 'Krok' : language === 'uk' ? 'Крок' : 'Step'} {currentN}{' '}
              <span className="text-xs font-normal text-slate-500">/ 27</span>
            </span>
          </div>

          <button
            onClick={onReset}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 cursor-pointer"
            title={language === 'pl' ? 'Zresetuj do 1.5 cm' : language === 'uk' ? 'Скинути до 1.5 см' : 'Reset to 1.5 cm'}
            aria-label="Reset distance"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Step Forward / Halve (÷2) - THE MAIN BUTTON */}
        <button
          onClick={onHalveDistance}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Divide className="w-5 h-5 text-slate-950" />
          <span className="text-sm">
            {language === 'pl'
              ? 'Podziel na pół (÷2)'
              : language === 'uk'
              ? 'Поділити навпіл (÷2)'
              : 'Halve Distance (÷2)'}
          </span>
        </button>

        {/* Step Backward / Double (×2) */}
        <button
          onClick={onDoubleDistance}
          disabled={currentDistance >= INITIAL_DISTANCE * 0.99}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700/60 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="text-base font-mono">×2</span>
          <span className="text-sm">
            {language === 'pl'
              ? 'Podwój (×2)'
              : language === 'uk'
              ? 'Подвоїти (×2)'
              : 'Double Distance (×2)'}
          </span>
        </button>

        {/* Auto-Play Walkthrough */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold border transition-all active:scale-[0.98] cursor-pointer ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
          <span className="text-sm">
            {isPlaying
              ? (language === 'pl' ? 'Pauza' : language === 'uk' ? 'Пауза' : 'Pause')
              : (language === 'pl' ? 'Autoodtwarzanie' : language === 'uk' ? 'Авто-поділ' : 'Auto Play')}
          </span>
        </button>
      </div>

      {/* Continuous Zoom Slider & Speed Controls */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span>1.50 cm ({language === 'pl' ? 'Makro' : language === 'uk' ? 'Макро' : 'Macro'})</span>
          <span className="text-amber-400">
            {language === 'pl' ? 'Płynny zoom' : language === 'uk' ? 'Неперервний зум' : 'Continuous Zoom'}
          </span>
          <span>0.10 nm ({language === 'pl' ? 'Kwantowa bariera' : language === 'uk' ? 'Квантовий бар\'єр' : 'Quantum Barrier'})</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.002"
            value={progressRatio}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>

        {/* Bottom utility row: speed options and jump to quantum touch */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {language === 'pl' ? 'Prędkość:' : language === 'uk' ? 'Швидкість:' : 'Speed:'}
            </span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/60 text-xs font-mono">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onChangeSpeed(spd)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    playSpeed === spd
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onDistanceChange(0.0000000001)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 text-xs font-medium transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {language === 'pl'
                ? 'Skok do bariery kwantowej (0.1 nm)'
                : language === 'uk'
                ? 'Стрибок до квантового бар\'єру (0.1 нм)'
                : 'Jump to Quantum Barrier (0.1 nm)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
