import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CanvasSimulator } from './components/CanvasSimulator';
import { ControlsPanel } from './components/ControlsPanel';
import { MilestoneNavigator } from './components/MilestoneNavigator';
import { ScientificGuide } from './components/ScientificGuide';
import { MilestoneDetailModal } from './components/MilestoneDetailModal';
import { INITIAL_DISTANCE, MIN_DISTANCE, MAX_DISTANCE, MILESTONES, ScaleMilestone, SupportedLanguage } from './types';
import { soundSynth } from './utils/audio';

export default function App() {
  const [currentDistance, setCurrentDistance] = useState<number>(INITIAL_DISTANCE);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  // Default to Polish as requested by the user
  const [language, setLanguage] = useState<SupportedLanguage>('pl');
  const [selectedMilestone, setSelectedMilestone] = useState<ScaleMilestone | null>(null);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentDistRef = useRef(currentDistance);
  currentDistRef.current = currentDistance;

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundSynth.setEnabled(next);
  };

  // Smoothly animate distance to target
  const animateToDistance = useCallback((targetDistance: number, durationMs = 320) => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }

    const startDist = currentDistRef.current;
    const startTime = performance.now();

    // Compute zoom fraction for sound
    const logMax = Math.log10(MAX_DISTANCE);
    const logMin = Math.log10(MIN_DISTANCE);
    const targetLog = Math.log10(Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, targetDistance)));
    const norm = Math.max(0, Math.min(1, (logMax - targetLog) / (logMax - logMin)));

    if (targetDistance < startDist) {
      soundSynth.playStepSound(norm);
    } else {
      soundSynth.playStepBackSound(norm);
    }

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth cubic easing
      const ease = 1 - Math.pow(1 - progress, 3);

      // Interpolate in logarithmic space for perceptually linear zoom
      const logStart = Math.log10(startDist);
      const logTarget = Math.log10(targetDistance);
      const currentLog = logStart + (logTarget - logStart) * ease;
      const newD = Math.pow(10, currentLog);

      setCurrentDistance(newD);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setCurrentDistance(targetDistance);
        if (targetDistance <= MIN_DISTANCE * 1.5) {
          soundSynth.playQuantumBarrierSound();
        }
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, []);

  // Halve distance (÷2)
  const handleHalveDistance = useCallback(() => {
    const next = Math.max(MIN_DISTANCE, currentDistRef.current / 2);
    animateToDistance(next, 300);
  }, [animateToDistance]);

  // Double distance (×2)
  const handleDoubleDistance = useCallback(() => {
    const next = Math.min(INITIAL_DISTANCE, currentDistRef.current * 2);
    animateToDistance(next, 300);
  }, [animateToDistance]);

  // Reset
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    animateToDistance(INITIAL_DISTANCE, 400);
  }, [animateToDistance]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(450, 1100 / playSpeed);
    const interval = setInterval(() => {
      if (currentDistRef.current <= MIN_DISTANCE * 1.2) {
        setIsPlaying(false);
        soundSynth.playQuantumBarrierSound();
        return;
      }
      handleHalveDistance();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, handleHalveDistance]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        language={language}
        onChangeLanguage={(l) => setLanguage(l)}
        onOpenParadoxInfo={() => setSelectedMilestone(MILESTONES[0])}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Editorial Subtitle / Context Kicker */}
        <div className="text-center max-w-3xl mx-auto pt-2 pb-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>
              {language === 'pl'
                ? 'Paradoks Zenona z Elei'
                : language === 'uk'
                ? 'Парадокс Зенона Елейського'
                : 'Zeno of Elea Paradox'}
            </span>
            <span>·</span>
            <span>
              {language === 'pl' ? '2400 lat zagadki' : language === 'uk' ? '2,400 років загадки' : '2,400-year enigma'}
            </span>
            <span>·</span>
            <span>
              {language === 'pl'
                ? 'Dychotomia nieskończonego dotyku'
                : language === 'uk'
                ? 'Дихотомія нескінченного дотику'
                : 'Dichotomy of Infinite Touch'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {language === 'pl'
              ? 'Czy dwa palce mogą się kiedykolwiek naprawdę dotknąć?'
              : language === 'uk'
              ? 'Чи можуть два пальці коли-небудь справді торкнутися?'
              : 'Can Two Fingers Ever Truly Touch?'}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {language === 'pl'
              ? 'Interaktywna symulacja z wideo: dziel odległość na pół krok po kroku (÷2) i zanurzaj się od 1.5 cm przez linie papilarne, komórki, keratynę i cząsteczki aż do kwantowego odpychania elektronów.'
              : language === 'uk'
              ? 'Інтерактивна симуляція з відео: діліть відстань навпіл крок за кроком (÷2) та занурюйтесь від 1.5 см крізь папілярні лінії, клітини, кератин і молекули до квантового відштовхування електронів.'
              : 'Interactive simulation as seen in the viral video: halve the distance step-by-step (÷2) from 1.5 cm through fingerprints, cells, keratin, and molecules down to quantum electron repulsion.'}
          </p>
        </div>

        {/* SECTION 1: Interactive Canvas Sandbox & Controls */}
        <section id="simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visualizer Stage */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <CanvasSimulator
              currentDistance={currentDistance}
              onDistanceChange={setCurrentDistance}
              isPlaying={isPlaying}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              language={language}
              onOpenDetails={(m) => setSelectedMilestone(m)}
            />
          </div>

          {/* Right Deck: Primary Controls & Live Halving Engine */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <ControlsPanel
              currentDistance={currentDistance}
              onDistanceChange={setCurrentDistance}
              onHalveDistance={handleHalveDistance}
              onDoubleDistance={handleDoubleDistance}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              playSpeed={playSpeed}
              onChangeSpeed={setPlaySpeed}
              language={language}
            />

            {/* Micro Quick Facts Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold font-mono text-[11px]">
                <span>{language === 'pl' ? 'PARADOKS I FIZYKA' : 'ПАРАДОКС ТА ФІЗИКА'}</span>
                <span className="text-cyan-400">1.5 cm → 0.1 nm</span>
              </div>
              <p className="leading-relaxed">
                {language === 'pl' ? (
                  <>Każde kliknięcie w <strong className="text-cyan-300">«Podziel na pół (÷2)»</strong> zmniejsza odległość 2-krotnie, przybliżając kamerę do mikrostruktur skóry. Spróbuj dotrzeć do kroku #27!</>
                ) : (
                  <>Кожен клік на <strong className="text-cyan-300">«Поділити навпіл (÷2)»</strong> зменшує відстань у 2 рази, наближаючи камеру до мікроструктур шкіри. Спробуйте дійти до кроку #27!</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: 9 Scale Milestones Quick Jump Bar */}
        <section id="milestones">
          <MilestoneNavigator
            currentDistance={currentDistance}
            onSelectMilestone={(dist) => animateToDistance(dist, 400)}
            language={language}
          />
        </section>

        {/* SECTION 3: Deep Scientific & Philosophical Guide */}
        <section id="science">
          <ScientificGuide
            currentDistance={currentDistance}
            onJumpToDistance={(dist) => animateToDistance(dist, 400)}
            language={language}
          />
        </section>
      </main>

      {/* Subtle, clean footer */}
      <footer className="border-t border-slate-800/80 py-6 mt-12 bg-slate-950 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            {language === 'pl'
              ? 'Paradoks Zenona z Elei · Kwantowa fizyka dotyku'
              : 'Парадокс Зенона Елейського · Квантова фізика дотику'}
          </span>
          <span className="text-slate-600">
            d(n) = 1.5 cm · (1/2)ⁿ · {language === 'pl' ? 'Granica Coulomba i Pauliego' : 'Межа Кулона та Паулі'} ~0.1 nm
          </span>
        </div>
      </footer>

      {/* Detailed Milestone Modal */}
      <MilestoneDetailModal
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        language={language}
      />
    </div>
  );
}
