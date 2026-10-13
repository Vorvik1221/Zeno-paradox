export interface ScaleMilestone {
  id: string;
  step: number; // typical halving step index (0 to ~27)
  distanceMeters: number; // distance in meters
  nameUk: string;
  namePl: string;
  nameEn: string;
  japaneseTag: string; // authentic Japanese tag from the original video
  scaleBarMeters: number;
  scaleBarLabel: string;
  descriptionUk: string;
  descriptionPl: string;
  descriptionEn: string;
  scientificDetailsUk: string;
  scientificDetailsPl: string;
  structuresUk: string[];
  structuresPl: string[];
  physicsPrincipleUk: string;
  physicsPrinciplePl: string;
  themeColor: string;
}

export type SupportedLanguage = 'pl' | 'uk' | 'en';

export interface SimulationState {
  currentDistanceMeters: number; // continuous distance in meters
  stepIndex: number; // fractional or integer step
  isPlaying: boolean;
  playSpeed: number; // 0.5x, 1x, 2x
  soundEnabled: boolean;
  language: SupportedLanguage;
  activeTab: 'sim' | 'paradox' | 'quantum' | 'table';
}

export function formatDistance(meters: number): { value: string; unit: string; full: string } {
  if (meters >= 0.01) {
    const cm = meters * 100;
    const val = cm >= 10 ? cm.toFixed(1) : cm.toFixed(2);
    return { value: val, unit: 'cm', full: `${val} cm` };
  } else if (meters >= 0.001) {
    const mm = meters * 1000;
    const val = mm >= 10 ? mm.toFixed(1) : mm.toFixed(2);
    return { value: val, unit: 'mm', full: `${val} mm` };
  } else if (meters >= 1e-6) {
    const um = meters * 1e6;
    const val = um >= 100 ? Math.round(um).toString() : um >= 10 ? um.toFixed(1) : um.toFixed(2);
    return { value: val, unit: 'µm', full: `${val} µm` };
  } else if (meters >= 1e-9) {
    const nm = meters * 1e9;
    const val = nm >= 100 ? Math.round(nm).toString() : nm >= 10 ? nm.toFixed(1) : nm.toFixed(3);
    return { value: val, unit: 'nm', full: `${val} nm` };
  } else if (meters >= 1e-10) {
    const angstrom = meters * 1e10;
    const val = angstrom.toFixed(2);
    return { value: val, unit: 'Å', full: `${val} Å` };
  } else {
    const pm = meters * 1e12;
    const val = pm.toFixed(1);
    return { value: val, unit: 'pm', full: `${val} pm` };
  }
}

export const MILESTONES: ScaleMilestone[] = [
  {
    id: 'macro',
    step: 0,
    distanceMeters: 0.015, // 1.50 cm
    nameUk: 'Макромасштаб (Рука)',
    namePl: 'Skala makro (Dłoń)',
    nameEn: 'Macro Hand Scale',
    japaneseTag: '手 HAND',
    scaleBarMeters: 0.02,
    scaleBarLabel: '2.00 cm',
    descriptionUk: 'Вказівний та великий пальці наближаються один до одного. Початкова відстань 1.50 см.',
    descriptionPl: 'Palec wskazujący i kciuk zbliżają się do siebie. Odległość początkowa wynosi 1.50 cm.',
    descriptionEn: 'Index finger and thumb approach each other. Initial distance is 1.50 cm.',
    scientificDetailsUk: 'У повсякденному житті здається, що пальці легко стикаються. Але за законом Зенона, щоб подолати цю відстань, спершу треба подолати її половину (7.5 мм).',
    scientificDetailsPl: 'W życiu codziennym wydaje się, że palce po prostu się dotykają. Jednak według paradoksu Zenona, aby pokonać ten dystans, należy najpierw przebyć jego połowę (7.5 mm).',
    structuresUk: ['Вказівний палець', 'Великий палець', 'Нігтьові пластини', 'Шкірний покрив'],
    structuresPl: ['Palec wskazujący', 'Kciuk', 'Płytki paznokciowe', 'Powłoka skórna'],
    physicsPrincipleUk: 'Класична механіка: видимий макроскопічний рух твердих тіл.',
    physicsPrinciplePl: 'Mechanika klasyczna: widoczny makroskopowy ruch ciał stałych.',
    themeColor: '#38bdf8',
  },
  {
    id: 'skin_surface',
    step: 2,
    distanceMeters: 0.00375, // 3.75 mm
    nameUk: 'Поверхня епідермісу',
    namePl: 'Powierzchnia naskórka',
    nameEn: 'Skin Surface Topography',
    japaneseTag: '皮膚 SKIN',
    scaleBarMeters: 0.005,
    scaleBarLabel: '5.00 mm',
    descriptionUk: 'Вигинання шкіри на пучках пальців. Стають помітними перші контури папілярних ліній.',
    descriptionPl: 'Krzywizna skóry opuszków palców. Widoczne stają się pierwsze kontury linii papilarnych.',
    descriptionEn: 'Curvature of fingertip skin. Early contours of papillary ridges become visible.',
    scientificDetailsUk: 'Шкіра пучок пальців унікальна: вона має підвищену концентрацію тактильних рецепторів та еластичний шар для надійного зчеплення з предметами.',
    scientificDetailsPl: 'Skóra opuszków palców jest wyjątkowa: posiada podwyższone zagęszczenie receptorów dotykowych oraz elastyczną warstwę ułatwiającą chwytanie przedmiotów.',
    structuresUk: ['Дермальні складки', 'Еластичний роговий шар', 'Тактильні борозенки'],
    structuresPl: ['Fałdy skórne', 'Elastyczna warstwa rogowa', 'Bruzdy dotykowe'],
    physicsPrincipleUk: 'Біомеханіка тертя та еластичної деформації тканин.',
    physicsPrinciplePl: 'Biomechanika tarcia i elastycznego odkształcenia tkanek.',
    themeColor: '#60a5fa',
  },
  {
    id: 'fingerprint',
    step: 4,
    distanceMeters: 0.000938, // 938 µm
    nameUk: 'Папілярні лінії (Відбитки)',
    namePl: 'Linie papilarne (Odciski)',
    nameEn: 'Fingerprint Ridges',
    japaneseTag: '指紋 FINGERPRINT',
    scaleBarMeters: 0.0005,
    scaleBarLabel: '500 µm',
    descriptionUk: 'Відстань між гребенями відбитків становить близько 0.45 мм. На вершинах гребенів розташовані порові отвори потових залоз.',
    descriptionPl: 'Odstęp między grzbietami linii papilarnych wynosi około 0.45 mm. Na szczytach grzbietów znajdują się ujścia gruczołów potowych.',
    descriptionEn: 'Spacing between fingerprint ridges is approx 0.45 mm. Sweat pores line the crests, spiraling up through epidermis.',
    scientificDetailsUk: '指紋の山（隆起）の間隔は約0.45mm。山の上には汗の出口（汗孔）が並び、汗の通り道はらせん状に皮膚をのぼる。 Потові протоки утворюють спіральні канальці, крізь які виділяється мікроскопічна волога.',
    scientificDetailsPl: '指紋の山（隆起）の間隔は約0.45mm。 Odstęp między grzbietami to ok. 0.45 mm. Przewody potowe tworzą spiralne kanaliki biegnące przez naskórek, przez które wydzielana jest wilgoć.',
    structuresUk: ['Папілярні гребені (~0.45 мм)', 'Потові пори (汗孔)', 'Спіральні протоки', 'Дермальні сосочки'],
    structuresPl: ['Grzbiety papilarne (~0.45 mm)', 'Pory potowe (ujścia)', 'Spiralne kanaliki', 'Brodawki skórne'],
    physicsPrincipleUk: 'Капілярні сили та дерматогліфічне збільшення сили тертя.',
    physicsPrinciplePl: 'Siły kapilarne i dermatoglificzne zwiększanie współczynnika tarcia.',
    themeColor: '#34d399',
  },
  {
    id: 'cells',
    step: 10,
    distanceMeters: 0.0000147, // 14.7 µm
    nameUk: 'Рогові клітини та мікробіом',
    namePl: 'Komórki zrogowaciałe i mikrobiom',
    nameEn: 'Corneocyte Cells & Microbiome',
    japaneseTag: '細胞 CELLS',
    scaleBarMeters: 0.00001,
    scaleBarLabel: '10 µm',
    descriptionUk: 'Зовнішній шар шкіри складається зі сплощених зроговілих клітин (корнеоцитів ~35 мкм). На поверхні живуть корисні бактерії.',
    descriptionPl: 'Zewnętrzna warstwa naskórka składa się ze spłaszczonych martwych komórek (korneocytów ~35 µm). Na powierzchni żyją bakterie mikrobiomu.',
    descriptionEn: 'Outermost skin consists of flattened dead cells (corneocytes ~35 µm). Commensal bacteria populate the surface.',
    scientificDetailsUk: '皮膚のいちばん外側は、平たくなった死んだ細胞（角質細胞・約35µm）の積み重ね。その上には細菌も住んでいる。 Корнеоцити щільно складені як цеглини, а між ними розміщуються колонії Staphylococcus epidermidis.',
    scientificDetailsPl: '皮膚のいちばん外側は、平たくなった死んだ細胞。 Korneocyty są ułożone jak cegły w murze (~35 µm szerokości). Pomiędzy nimi bytują sferyczne kolonie bakterii Staphylococcus epidermidis.',
    structuresUk: ['Корнеоцити (~35 мкм)', 'Шкірні бактерії (Staphylococcus ~1 мкм)', 'Міжклітинний цемент', 'Десмосоми'],
    structuresPl: ['Korneocyty (~35 µm)', 'Bakterie skórne (Staphylococcus ~1 µm)', 'Spoiwo międzykomórkowe', 'Desmosomy'],
    physicsPrincipleUk: 'Ван-дер-Ваальсові взаємодії між клітинними мембранами.',
    physicsPrinciplePl: 'Oddziaływania van der Waalsa pomiędzy błonami komórkowymi.',
    themeColor: '#a78bfa',
  },
  {
    id: 'keratin',
    step: 15,
    distanceMeters: 0.000000458, // 458 nm
    nameUk: 'Кератинові філаменти',
    namePl: 'Włókna keratynowe',
    nameEn: 'Keratin Filaments',
    japaneseTag: 'ケラチン KERATIN',
    scaleBarMeters: 0.0000002,
    scaleBarLabel: '200 nm',
    descriptionUk: 'Всередині плоских клітин щільно вкладені пучки кератинових волокон товщиною ~10 нм. Проміжки заповнені ліпідним шаром.',
    descriptionPl: 'Wewnątrz spłaszczonych komórek gęsto upakowane są wiązki włókien keratynowych o grubości ~10 nm. Przestrzenie wypełnia warstwa lipidowa.',
    descriptionEn: 'Inside the flattened cells, tightly packed with ~10nm thick keratin filaments. Gaps sealed with lipid layers.',
    scientificDetailsUk: '平たい細胞の中は、太さ約10nmのケラチン繊維でぎっしり。すき間は脂質の層でふさがれている。 Кератин — це міцний фібрилярний білок, що забезпечує механічну витривалість шкіри.',
    scientificDetailsPl: '平たい細胞の中は、太さ約10nmのケラチン繊維でぎっしり。 Keratyna to wytrzymałe białko fibrylarne. Wiązki mikrofilamentów zapewniają skórze odporność mechaniczną na rozciąganie i nacisk.',
    structuresUk: ['Кератинові пучки (Ø 10 нм)', 'Проміжні філаменти', 'Волоконна білкова матриця', 'Ліпідні прошарки'],
    structuresPl: ['Wiązki keratynowe (Ø 10 nm)', 'Filamenty pośrednie', 'Włóknista macierz białkowa', 'Warstwy lipidowe'],
    physicsPrincipleUk: 'Полімерна еластичність та супрамолекулярна самоорганізація.',
    physicsPrinciplePl: 'Elastyczność polimerowa i samoorganizacja supramolekularna.',
    themeColor: '#fb7185',
  },
  {
    id: 'lipids',
    step: 20,
    distanceMeters: 0.0000000143, // 14.3 nm
    nameUk: 'Ліпідний бішар і молекули повітря',
    namePl: 'Dwuwarstwa lipidowa i cząsteczki powietrza',
    nameEn: 'Lipid Bilayer & Air Molecules',
    japaneseTag: '脂質 LIPIDS',
    scaleBarMeters: 0.00000001,
    scaleBarLabel: '10 nm',
    descriptionUk: 'Міжклітинні ліпідні бішари (цераміди, холестерин). У звужуваному зазорі хаотично рухаються молекули газів повітря (N₂, O₂).',
    descriptionPl: 'Międzykomórkowe dwuwarstwy lipidowe (ceramidy, cholesterol). W zwężającej się szczelinie zderzają się cząsteczki gazów (N₂, O₂).',
    descriptionEn: 'Intercellular lipid bilayers (ceramides, cholesterol). Gas molecules of air (N2, O2) collide in the narrowing gap.',
    scientificDetailsUk: 'Гідрофобні вуглеводневі ланцюги формують бар\'єр товщиною близько 4-5 нм. Між поверхнями пальців пролітають молекули азоту та кисню зі швидкістю ~500 м/с.',
    scientificDetailsPl: 'Hydrofobowe łańcuchy węglowodorowe tworzą barierę o grubości ok. 4-5 nm. W szczelinie między palcami z prędkością ~500 m/s przelatują cząsteczki azotu i tlenu.',
    structuresUk: ['Ліпідні полярні голівки', 'Вуглеводневі хвостики', 'Молекули азоту (N₂)', 'Молекули кисню (O₂)'],
    structuresPl: ['Polarne głowy lipidowe', 'Łańcuchy węglowodorowe', 'Cząsteczki azotu (N₂)', 'Cząsteczki tlenu (O₂)'],
    physicsPrincipleUk: 'Броунівський рух газів та гідрофобний ефект мембран.',
    physicsPrinciplePl: 'Ruchy Browna cząsteczek gazu i efekt hydrofobowy membran.',
    themeColor: '#f59e0b',
  },
  {
    id: 'molecules',
    step: 23,
    distanceMeters: 0.00000000179, // 1.79 nm
    nameUk: 'Молекулярний рівень',
    namePl: 'Skala molekularna',
    nameEn: 'Molecular Scale',
    japaneseTag: '分子 MOLECULES',
    scaleBarMeters: 0.000000001,
    scaleBarLabel: '1.00 nm',
    descriptionUk: 'Вуглеводневі ланцюги вуглецю та водню, розташовані зигзагом. Окремі молекулярні орбіталі.',
    descriptionPl: 'Łańcuchy węglowodorowe węgla i wodoru ułożone zygzakowato. Pojedyncze orbitale molekularne.',
    descriptionEn: 'Hydrocarbon chains of carbon and hydrogen zigzagging. Individual molecular orbitals.',
    scientificDetailsUk: 'いちばん表面は皮脂などの脂質分子、炭素と水素がジグザグにつながった鎖。すきまを空気の分子(N2, O2)が飛んでいく。 На цій відстані помітні хімічні зв\'язки C-C та C-H довжиною ~0.15 нм.',
    scientificDetailsPl: 'いちばん表面は皮脂などの脂質分子。 Powierzchnia składa się z lipidów łojowych: łańcuchów węgla i wodoru. Widoczne stają się wiązania kowalencyjne C-C i C-H o długości ~0.15 nm.',
    structuresUk: ['Зигзаг C-C зв\'язків', 'Атоми водню', 'Ван-дер-Ваальсів радіус', 'Молекулярні орбіталі'],
    structuresPl: ['Zygzak wiązań C-C', 'Atomy wodoru', 'Promień van der Waalsa', 'Orbitale molekularne'],
    physicsPrincipleUk: 'Дисперсійні сили Лондона та міжатомні потенціали Леннард-Джонса.',
    physicsPrinciplePl: 'Siły dyspersyjne Londona i potencjał międzyatomowy Lennarda-Jonesa.',
    themeColor: '#eab308',
  },
  {
    id: 'atom',
    step: 25,
    distanceMeters: 0.000000000332, // 0.332 nm (3.32 Å)
    nameUk: 'Атом (Au / C / O) та хмари електронів',
    namePl: 'Pojedynczy atom (Au / C / O) i chmura elektronowa',
    nameEn: 'Single Atom & Electron Cloud',
    japaneseTag: '原子 ATOM',
    scaleBarMeters: 0.0000000003,
    scaleBarLabel: '0.30 nm',
    descriptionUk: 'Одиничний атом діаметром близько 0.332 нм (як атом золота Au чи біогенні атоми). Сяюче ядро та розмита ймовірнісна хмара електронів.',
    descriptionPl: 'Pojedynczy atom o średnicy ok. 0.332 nm (jak atom złota Au lub atom biogenny). Świecące jądro i probabilistyczna chmura elektronowa.',
    descriptionEn: 'Single atom approx 0.332 nm in diameter (like Au gold atom). Glowing nucleus and probabilistic electron cloud.',
    scientificDetailsUk: 'Au 金の原子 0.332 nm. На цьому рівні класичне поняття "твердої кульки" зникає. Атом — це на 99.999999999% порожній простір з ймовірнісною густиною електронів.',
    scientificDetailsPl: 'Au 金の原子 0.332 nm. Na tym poziomie znika koncepcja „twardej kulki”. Atom to w 99.999999999% pusta przestrzeń z kwantową gęstością prawdopodobieństwa obecności elektronu.',
    structuresUk: ['Атомне ядро', 'Електронна хмара (орбіталі)', 'Хвильова функція Ψ', 'Квантові енергетичні рівні'],
    structuresPl: ['Jądro atomowe', 'Chmura elektronowa (orbitale)', 'Funkcja falowa Ψ', 'Kwantowe poziomy energetyczne'],
    physicsPrincipleUk: 'Квантова механіка: рівняння Шредінгера та принцип невизначеності Гейзенберга.',
    physicsPrinciplePl: 'Mechanika kwantowa: równanie Schrödingera i zasada nieoznaczoności Heisenberga.',
    themeColor: '#facc15',
  },
  {
    id: 'quantum_repulsion',
    step: 27,
    distanceMeters: 0.0000000001, // 0.100 nm (1.00 Å)
    nameUk: 'Квантове відштовхування (Парадокс дотику)',
    namePl: 'Kwantowe odpychanie (Paradoks dotyku)',
    nameEn: 'Quantum Repulsion (The Touch Paradox)',
    japaneseTag: '量子触覚 QUANTUM TOUCH',
    scaleBarMeters: 0.0000000001,
    scaleBarLabel: '0.10 nm (1 Å)',
    descriptionUk: 'Кулонівське електростатичне відштовхування однакових негативних зарядів електронів та принцип заборони Паулі унеможливлюють фізичне злиття.',
    descriptionPl: 'Elektrostatyczne odpychanie kulombowskie jednoimiennych ładunków elektronów oraz zakaz Pauliego uniemożliwiają fizyczne scalenie.',
    descriptionEn: 'Coulomb electrostatic repulsion and Pauli Exclusion Principle prevent electrons from occupying identical states.',
    scientificDetailsUk: 'Ми НІКОЛИ фізично не торкаємося! Відчуття "дотику", яке фіксують ваші нерви, — це тиск електромагнітного поля, коли електронні хмари пальців відштовхуються одна від одної з колосальною силою.',
    scientificDetailsPl: 'NIGDY fizycznie się nie dotykamy! Uczucie „dotyku” rejestrowane przez receptory nerwowe to ciśnienie pola elektromagnetycznego, gdy chmury elektronowe palców odpychają się z potężną siłą.',
    structuresUk: ['Лінії кулонівського поля', 'Електронний бар\'єр', 'Тиск виродженого газу', 'Довжина Планка (1.6×10⁻³⁵ м)'],
    structuresPl: ['Linie pola kulombowskiego', 'Bariera elektronowa', 'Ciśnienie gazu zdegenerowanego', 'Długość Plancka (1.6×10⁻³⁵ m)'],
    physicsPrincipleUk: 'Принцип заборони Паулі та електродинамічне відштовхування: реальне пояснення фізичного дотику.',
    physicsPrinciplePl: 'Zakaz Pauliego i odpychanie elektrodynamiczne: rzeczywista fizyczna natura dotyku.',
    themeColor: '#ef4444',
  },
];

export const INITIAL_DISTANCE = 0.015; // 1.50 cm
export const MIN_DISTANCE = 0.00000000008; // 0.08 nm (0.8 Å)
export const MAX_DISTANCE = 0.02; // 2.00 cm
