import React, { useState } from 'react';
import { BookOpen, Zap, Table, CheckCircle2, ArrowRight } from 'lucide-react';
import { INITIAL_DISTANCE, formatDistance, SupportedLanguage } from '../types';

interface ScientificGuideProps {
  currentDistance: number;
  onJumpToDistance: (distance: number) => void;
  language: SupportedLanguage;
}

export const ScientificGuide: React.FC<ScientificGuideProps> = ({
  currentDistance,
  onJumpToDistance,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'paradox' | 'quantum' | 'table'>('paradox');

  // Generate the 28 halving steps from 1.5 cm down to 0.1 nm
  const halvingSteps = [];
  let d = INITIAL_DISTANCE;
  for (let i = 0; i <= 27; i++) {
    const formatted = formatDistance(d);
    let note = '';
    if (language === 'pl') {
      if (i === 0) note = 'Odległość początkowa palców (1.5 cm)';
      else if (i === 1) note = 'Pierwszy podział (7.5 mm)';
      else if (i === 2) note = 'Powłoka skórna (3.75 mm)';
      else if (i === 4) note = 'Grzbiety linii papilarnych (~0.45 mm) i pory';
      else if (i === 6) note = 'Grubość ludzkiego włosa (~70 µm)';
      else if (i === 9) note = 'Komórki zrogowaciałe naskórka (korneocyty ~35 µm)';
      else if (i === 11) note = 'Bakterie skórne (Staphylococcus ~1 µm)';
      else if (i === 15) note = 'Długość fali światła widzialnego (~450 nm) / Keratyna';
      else if (i === 17) note = 'Wirus grypy (~100 nm)';
      else if (i === 20) note = 'Grubość dwuwarstwy lipidowej błony (~5-10 nm)';
      else if (i === 22) note = 'Średnica helisy DNA (~2 nm)';
      else if (i === 24) note = 'Rozmiar cząsteczki wody (~0.28 nm)';
      else if (i === 25) note = 'Pojedynczy atom złota Au (~0.332 nm)';
      else if (i === 27) note = 'Bariera kwantowa odpychania elektronów (~0.1 nm / 1 Å)';
    } else if (language === 'uk') {
      if (i === 0) note = 'Початкова відстань пальців (1.5 см)';
      else if (i === 1) note = 'Перший поділ (7.5 мм)';
      else if (i === 2) note = 'Шкірний покрив (3.75 мм)';
      else if (i === 4) note = 'Папілярні гребені відбитків (~0.45 мм) і пори';
      else if (i === 6) note = 'Товщина людської волосини (~70 мкм)';
      else if (i === 9) note = 'Рогові клітини (корнеоцити ~35 мкм)';
      else if (i === 11) note = 'Шкірні бактерії (Staphylococcus ~1 мкм)';
      else if (i === 15) note = 'Довжина хвилі видимого світла (~450 нм) / Кератин';
      else if (i === 17) note = 'Вірус грипу (~100 нм)';
      else if (i === 20) note = 'Товщина ліпідного бішару мембрани (~5-10 нм)';
      else if (i === 22) note = 'Діаметр спіралі ДНК (~2 нм)';
      else if (i === 24) note = 'Розмір молекули води (~0.28 нм)';
      else if (i === 25) note = 'Атом золота Au (~0.332 нм)';
      else if (i === 27) note = 'Квантовий бар\'єр відштовхування електронів (~0.1 нм / 1 Å)';
    } else {
      if (i === 0) note = 'Initial distance between fingertips (1.5 cm)';
      else if (i === 1) note = 'First halving step (7.5 mm)';
      else if (i === 2) note = 'Skin surface topography (3.75 mm)';
      else if (i === 4) note = 'Fingerprint papillary ridges (~0.45 mm) & sweat pores';
      else if (i === 6) note = 'Thickness of human hair (~70 µm)';
      else if (i === 9) note = 'Corneocyte dead skin cells (~35 µm)';
      else if (i === 11) note = 'Skin commensal bacteria (Staphylococcus ~1 µm)';
      else if (i === 15) note = 'Wavelength of visible light (~450 nm) / Keratin';
      else if (i === 17) note = 'Influenza virus particle (~100 nm)';
      else if (i === 20) note = 'Lipid bilayer thickness (~5-10 nm)';
      else if (i === 22) note = 'DNA double helix diameter (~2 nm)';
      else if (i === 24) note = 'Water molecule diameter (~0.28 nm)';
      else if (i === 25) note = 'Gold Au atom diameter (~0.332 nm)';
      else if (i === 27) note = 'Quantum electron repulsion barrier (~0.1 nm / 1 Å)';
    }

    halvingSteps.push({
      step: i,
      distance: d,
      formatted: formatted.full,
      fraction: `1 / ${Math.pow(2, i).toLocaleString()}`,
      note,
    });
    d /= 2;
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('paradox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'paradox'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {language === 'pl'
              ? 'Paradoks Zenona (Dychotomia)'
              : language === 'uk'
              ? 'Парадокс Зенона (Дихотомія)'
              : 'Zeno\'s Paradox (Dichotomy)'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quantum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'quantum'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>
            {language === 'pl'
              ? 'Dlaczego nigdy się nie dotykamy?'
              : language === 'uk'
              ? 'Чому ми ніколи не торкаємося?'
              : 'Why We Never Actually Touch'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'table'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>
            {language === 'pl'
              ? 'Tabela 27 kroków podziału'
              : language === 'uk'
              ? 'Таблиця 27 кроків поділу'
              : '27 Halving Steps Table'}
          </span>
        </button>
      </div>

      {/* Tab Content: Paradox */}
      {activeTab === 'paradox' && (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold text-white mb-2">
                {language === 'pl'
                  ? 'Paradoks sprzed 2400 lat'
                  : language === 'uk'
                  ? 'Парадокс, якому 2400 років'
                  : 'A 2,400-Year-Old Enigma'}
              </h3>
              <p className="mb-3 text-xs md:text-sm text-slate-300">
                {language === 'pl' ? (
                  <>Starożytny grecki filozof <strong>Zenon z Elei (ok. 490–430 p.n.e.)</strong> sformułował słynne aporie, z których najbardziej elementarna to <em>Dychotomia</em> (podział na pół):</>
                ) : (
                  <>Давньогрецький філософ <strong>Зенон Елейський (бл. 490–430 до н.е.)</strong> сформулював низку апорій, найвідоміша з яких — <em>Дихотомія</em> (поділ навпіл):</>
                )}
              </p>
              <blockquote className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs italic font-serif my-3">
                {language === 'pl'
                  ? '«Zanim poruszające się ciało pokona jakikolwiek dystans, musi najpierw przebyć połowę tej drogi. Ale wcześniej — połowę tamtej połowy, i tak w nieskończoność. Zatem ruch nigdy nie może się nawet rozpocząć, a dotyk — nigdy nie nastąpić.»'
                  : '«Перш ніж рухоме тіло подолає будь-яку відстань, воно повинно спершу пройти половину цієї відстані. Але перед цим — половину тієї половини, і так до нескінченності. Отже, рух ніколи не може навіть розпочатися, а дотик — ніколи не настане.»'}
              </blockquote>
              <p className="text-xs text-slate-400">
                {language === 'pl' ? (
                  <>Jeśli przestrzeń jest ciągła i można ją dzielić przez 2 nieskończenie wiele razy, to między dwoma palcami zawsze pozostaje niezerowy odstęp:</>
                ) : (
                  <>Якщо простір неперервний і його можна ділити на 2 нескінченну кількість разів, то між двома пальцями завжди залишатиметься залишок відстані:</>
                )}
                <br />
                <code className="text-amber-400 font-mono text-[11px] block mt-1.5 p-1 bg-slate-950/80 rounded">
                  d(n) = d₀ · (1/2)ⁿ, gdzie przy n → ∞, d(n) &gt; 0
                </code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-amber-400 mb-2">
                  {language === 'pl'
                    ? 'Rozwiązanie matematyczne'
                    : language === 'uk'
                    ? 'Математичне розв\'язання'
                    : 'Mathematical Resolution'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {language === 'pl' ? (
                    <>W analizie matematycznej (rozwiniętej przez Newtona i Leibniza 2000 lat po Zenonie) nieskończony szereg geometryczny ma skończoną sumę:</>
                  ) : (
                    <>У математичному аналізі (розробленому Ньютоном і Лейбніцем через 2000 років після Зенона) нескінченний ряд половин має скінченну суму:</>
                  )}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-cyan-300 text-sm mb-3">
                  1/2 + 1/4 + 1/8 + 1/16 + ... = ∑ (1/2)ⁿ = 1
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'pl' ? (
                    <>Matematycznie suma nieskończonej liczby coraz mniejszych odcinków czasu i przestrzeni jest wielkością skończoną. Ruch dobiega końca w skończonym czasie!</>
                  ) : (
                    <>Математично сума нескінченної кількості все менших проміжків часу та простору є цілком скінченною величиною. Рух завершується за фіксований час!</>
                  )}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                {language === 'pl'
                  ? '💡 Ale co dzieje się w rzeczywistym świecie fizycznym, gdy dwa palce zbliżają się do siebie? Przejdź do zakładki „Dlaczego nigdy się nie dotykamy”.'
                  : '💡 Але що відбувається у реальному фізичному світі, коли два пальці зближуються? Перейдіть до вкладки «Чому ми ніколи не торкаємося».'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Quantum Touch */}
      {activeTab === 'quantum' && (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {language === 'pl' ? 'Odpychanie kulombowskie' : 'Кулонівське відштовхування'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'pl' ? (
                  <>Każdy atom komórek skóry otoczony jest ujemnie naładowanymi elektronami. Jednoimienne ładunki odpychają się zgodnie z prawem Coulomba:
                  <br />
                  <span className="font-mono text-cyan-300 text-[11px] block mt-1">F = k · (q₁·q₂) / r²</span>
                  Wraz ze zbliżaniem siła ta rośnie odwrotnie proporcjonalnie do kwadratu odległości.</>
                ) : (
                  <>Кожен атом у клітинах вашої шкіри оточений негативно зарядженими електронами. Однойменні заряди відштовхуються за законом Кулона:
                  <br />
                  <span className="font-mono text-cyan-300 text-[11px] block mt-1">F = k · (q₁·q₂) / r²</span>
                  З наближенням сила зростає обернено пропорційно квадрату відстані.</>
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold font-mono text-sm mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {language === 'pl' ? 'Zakaz Pauliego' : 'Принцип заборони Паулі'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'pl' ? (
                  <>Elektrony to fermiony. Dwa elektrony nie mogą jednocześnie zajmować identycznego stanu kwantowego. Gdy chmury elektronowe zaczynają się nakładać (przy odległości &lt; 0.2 nm), powstaje gigantyczne kwantowe ciśnienie degeneracji.</>
                ) : (
                  <>Електрони — це ферміони. Два електрони не можуть одночасно займати однаковий квантовий стан. Коли електронні хмари починають перекриватися (при відстані менше ~0.2 нм), виникає гігантський квантовий тиск відштовхування.</>
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono text-sm mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {language === 'pl' ? 'Czym jest dotyk?' : 'Що ж таке «дотик»?'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'pl' ? (
                  <>Dotyk to odczuwanie siły elektromagnetycznej! Gdy dotykasz stołu lub ściskasz palce, w rzeczywistości unosisz się na niewidzialnej poduszce elektromagnetycznej w odległości około 1 angstremu (0.1 nm). Receptory skóry reagują na to ciśnienie.</>
                ) : (
                  <>Дотик — це відчуття електромагнітної сили! Коли ви торкаєтесь до столу чи стискаєте пальці, ви насправді парите на невидимій електромагнітній подушці на відстані близько 1 ангстрема (0.1 нм). Нервові рецептори реагують на цей тиск.</>
                )}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
            {language === 'pl' ? (
              <><strong>Granica niepodzielności przestrzeni (Długość Plancka):</strong> Zenon uważał, że przestrzeń można dzielić w nieskończoność. Jednak we współczesnej fizyce kwantowej istnieje fundamentalna najmniejsza długość fizyczna — <strong>długość Plancka ℓₚ ≈ 1.616 × 10⁻³⁵ m</strong>. Poniżej tej skali klasyczne pojęcie gładkiej geometrii załamuje się, ustępując miejsca kwantowej pianie czasoprzestrzennej.</>
            ) : (
              <><strong>Межа неподільності простору (Довжина Планка):</strong> Зенон вважав, що простір можна ділити нескінченно. Проте у квантовій фізиці існує фундаментальна найменша можлива довжина — <strong>довжина Планка ℓₚ ≈ 1.616 × 10⁻³⁵ м</strong>. На цій шкалі класичні поняття геометрії перестають існувати, поступаючись квантовій просторово-часовій піні.</>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: 27 Steps Table */}
      {activeTab === 'table' && (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
            <span>
              {language === 'pl'
                ? 'Kliknij wiersz, aby przejść do skali w symulatorze:'
                : language === 'uk'
                ? 'Клацніть на рядок, щоб перейти до масштабу в симуляторі:'
                : 'Click a row to jump directly to this scale in the simulator:'}
            </span>
            <span>n = 0 ... 27</span>
          </div>

          <div className="overflow-x-auto max-h-[360px] rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">{language === 'pl' ? 'Krok' : language === 'uk' ? 'Крок' : 'Step'}</th>
                  <th className="py-2.5 px-3">{language === 'pl' ? 'Odległość' : language === 'uk' ? 'Відстань' : 'Distance'}</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">{language === 'pl' ? 'Ułamek 1/2ⁿ' : language === 'uk' ? 'Частка 1/2ⁿ' : 'Fraction 1/2ⁿ'}</th>
                  <th className="py-2.5 px-3">{language === 'pl' ? 'Obiekt porównawczy' : language === 'uk' ? 'Фізичний об\'єкт' : 'Comparison Object'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'pl' ? 'Akcja' : language === 'uk' ? 'Дія' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {halvingSteps.map((s) => {
                  const isCurrent = Math.abs(Math.log10(currentDistance) - Math.log10(s.distance)) < 0.15;
                  return (
                    <tr
                      key={s.step}
                      onClick={() => onJumpToDistance(s.distance)}
                      className={`hover:bg-slate-800/80 transition-colors cursor-pointer ${
                        isCurrent ? 'bg-cyan-950/40 text-cyan-200 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 text-amber-400 font-bold">
                        #{s.step}
                      </td>
                      <td className="py-2 px-3 text-cyan-300 font-semibold tabular-nums">
                        {s.formatted}
                      </td>
                      <td className="py-2 px-3 text-slate-400 hidden sm:table-cell">
                        {s.fraction}
                      </td>
                      <td className="py-2 px-3 text-slate-200 font-sans text-[11px]">
                        {s.note}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onJumpToDistance(s.distance);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-[10px] transition-colors cursor-pointer"
                        >
                          {language === 'pl' ? 'Przejdź' : language === 'uk' ? 'Перейти' : 'Jump'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
