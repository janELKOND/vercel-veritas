/* ============================================================
   Osobná analýza chudnutia — druhý lead magnet (A/B proti kvízu)
   ============================================================
   Prečo existuje: kvíz „Pravda o chudnutí" kupuje pozornosť veľmi lacno
   (CTR 11–17 %, lead 0,29 €), ale sľubuje TEST — a test priláka zvedavosť,
   nie kúpny zámer. 163 leadov, 0 klientov. Kalkulačka (formio) mala pritom
   72 % dokončení z načítania oproti 15 % pri kvíze: nástroj, ktorý POČÍTA,
   poráža nástroj, ktorý SKÚŠA.

   Táto stránka BEŽÍ VEDĽA KVÍZU, nenahrádza ho — inak by sa nedalo zistiť,
   či prípadná zmena čísel bola o magnete alebo o reklame.

   Zdieľa s kvízom celý backend: `quizLead` (lead + notifikácia + e-mailová
   séria), tiering podľa histórie návratov, formulár na telefón, rezerváciu termínu.
   Preto sa aj hodnoty segmentu a histórie MUSIA zhodovať s kvízom.
   ============================================================ */

const CONFIG = {
  WEBHOOK_URL: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  BOOKING_URL: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  BOOKING_ENABLED: true,
  CAL_URL: 'https://calendar.app.google/xfubmW69zjcoGnsH8',
  CONTACT_EMAIL: 'karas.jan2@gmail.com',
  PIXEL_AD: '2221207801987418',
  SOURCE: 'osobna-analyza',
  OFFER: { NAME: 'Reštart plán', LENGTH: '15 minút', SPOTS_PER_MONTH: 5 },

  // Verzia lievika. v4 = otázka na pripravenosť a routing na tri vetvy (10. 8.).
  // v5 (13. 8. 2026) = otázka ZRUŠENÁ. Po e-maile ide rovno výsledok a pod ním
  // dve cesty pre každého: najprv konzultácia, pod ňou Valyra. O ceste rozhoduje
  // klik (`selected_path`), nie vyhlásenie o sebe.
  //
  // Prečo: cez v4 prešlo 52 leadov a prišlo 0 žiadostí o konzultáciu, kým
  // predtým (7.–10. 8.) to bolo 9 zo 190. Databáza to potvrdila — všetkých 11
  // žiadostí, čo kedy prišli, má `readiness` prázdne, teda ani jedna z v4.
  // v4 nezhoršila text ponuky; ona ju prestala ukazovať 98 % ľudí. Navyše tá
  // otázka bola povinná a stála pred e-mailom, teda pred krokom so 41,8 %.
  //
  // ⚠️ Leady z rôznych verzií sa NESMÚ miešať: v3 `readiness` nemá vôbec, v4 má
  // aj hodnotu `informacie` a v5 nemá `readiness` žiadny, zato má `selected_path`.
  // Od v5 sa verzia ukladá do stĺpca `quiz_leads.quiz_version` (migrácia 008),
  // takže sa už nemusí hádať z dátumu.
  FUNNEL_VERSION: 5,

  // Valyra sa na výsledku len SPOMÍNA, nepredáva sa tu (19. 8. 2026).
  //
  // Do 19. 8. tu bola celá ponuka: URL na self-serve onboarding, tlačidlo,
  // miesto na cenu. Rozhodnutie z `lievik/docs/PONUKA.md` sekcie 1 hovorí, že
  // Valyra je nástroj v platenej spolupráci a nie lákadlo — tak tu ostala jedna
  // veta a nič, na čo sa dá kliknúť.
  //
  // `ENABLED` je vypínač tej vety. URL, CTA, cena ani poznámka tu už nie sú;
  // keby sa Valyra niekedy predávala samostatne, patrí to k rozhodnutiu
  // v repe `lievik`, nie späť sem ako mŕtvy kód (viď `CONFIG.OFFER`).
  VALYRA: { ENABLED: true },
};

// ---------- OTÁZKY ----------
// Osem ťukov, z toho tri číselné. Poradie: najprv neutrálne údaje (nízka bariéra),
// citlivá cieľová váha až keď je človek rozbehnutý, kvalifikácia na koniec.
const NUM_LIMITS = {
  age: { min: 16, max: 90, label: 'vek' },
  height: { min: 130, max: 220, label: 'výšku' },
  weight: { min: 40, max: 250, label: 'váhu' },
  goalWeight: { min: 40, max: 250, label: 'cieľovú váhu' },
};

const ACTIVITY_Q = {
  q: 'Koľko pohybu máš bežne?',
  note: 'Bez toho by odhad kalórií mohol byť mimo aj o 400 kcal.',
  options: [
    { label: 'Sedavé zamestnanie, takmer necvičím', value: 'sedava', factor: 1.2 },
    { label: 'Občas sa hýbem (1–2× týždenne)', value: 'obcas', factor: 1.375 },
    { label: 'Cvičím pravidelne (3–5× týždenne)', value: 'pravidelne', factor: 1.55 },
    { label: 'Veľmi aktívny životný štýl', value: 'velmi-aktivny', factor: 1.725 },
  ],
};

// Hodnoty MUSIA sedieť s kvízom (SEGMENT_Q v /app.js) — na nich stojí personalizácia
// e-mailov, popisky v notifikácii aj segmentová štatistika. Menia sa len texty.
const PROBLEM_Q = {
  q: 'Čo ti to dnes kazí najviac?',
  options: [
    { label: 'Neviem, čo a koľko mám jesť', value: 'co-jest' },
    { label: 'Večer sa neudržím — chute a sladké', value: 'vecerne-chute' },
    { label: 'Vždy začnem, ale po pár dňoch prestanem', value: 'nevydrzim' },
    { label: 'Nemám čas plánovať jedlo a variť', value: 'nemam-cas' },
    { label: 'Viem, čo mám robiť, ale potrebujem podporu', value: 'potrebujem-podporu' },
  ],
};

// Najcennejšia kvalifikačná otázka — nie kvôli výpočtu, kvôli biznisu.
// Kto priznal opakované návraty, ten už dokázal, že samoobsluha mu nestačí.
const HISTORY_Q = {
  q: 'Koľkokrát sa ti už zhodené kilá vrátili?',
  options: [
    { label: 'Ešte nikdy — toto by bol môj prvý poriadny pokus', value: 'prvykrat' },
    { label: 'Raz alebo dvakrát', value: 'raz-dva' },
    { label: 'Trikrát a viac — vždy sa to vrátilo', value: 'viackrat' },
    { label: 'Váha ide stále dokola, hore-dole', value: 'jojo' },
  ],
};

// ---------- ZRUŠENÁ OTÁZKA NA PRIPRAVENOSŤ (v4 → v5, 13. 8. 2026) ----------
// Tu stála otázka „Čo by ti k tvojim číslam pomohlo najviac?". Už tu nie je
// vôbec a poznámka ostáva preto, že ten omyl stál 52 leadov a nulu konzultácií.
//
// Čo sa stalo: otázka sedela na E-MAILOVEJ STENE a bola POVINNÁ — `submitLead()`
// bez nej neodoslal. Stála teda medzi človekom a krokom, ktorý konvertuje na
// 41,8 %, a jej odpoveď potom rozhodovala, či ponuku vôbec uvidí. Vo v4 si 51 %
// ľudí vybralo „zatiaľ si chcem len pozrieť výsledok" a nedostalo nič.
//
// Prečo sa to nedalo opraviť lepším znením: sebahodnotenie nepredpovedá, kto
// o pomoc požiada. Deviati ľudia, ktorí si konzultáciu naozaj vypýtali
// (7.–10. 8.), nemali ani raz problém „potrebujem podporu" — pýtali sa na
// večerné chute a na to, čo variť. Preto o ceste rozhoduje KLIK (`recordPath`),
// nie vyhlásenie o sebe.
//
// ⚠️ Ak sem bude niekto chcieť vrátiť kvalifikačnú otázku: nikdy nie pred
// výsledok a nikdy nie ako podmienku odoslania e-mailu.

// Placeholder do textarey podľa toho, čo človek označil ako svoju brzdu. Nie je
// to ozdoba: prázdne pole s výzvou „napíš mi" väčšina ľudí preskočí, konkrétny
// príklad im ukáže, aká odpoveď sa čaká a že stačí jedna veta.
// POZOR: v placeholderi nesmie byť informácia, ktorá inde nie je (prístupnosť).
const MESSAGE_PLACEHOLDER = {
  'co-jest': 'Napr.: Najviac neviem, čo si mám dávať na večeru…',
  'vecerne-chute': 'Napr.: Cez deň to zvládnem, ale večer vyjedám sladké…',
  'nevydrzim': 'Napr.: Vydržím približne týždeň a potom sa vrátim k starému režimu…',
  'nemam-cas': 'Napr.: Nestíham si pripravovať obed a potom zjem čokoľvek…',
  'potrebujem-podporu': 'Napr.: Viem, čo mám robiť, ale {sama} pri tom dlho nevydržím…',
};

// KEDY TO PRASKÁ (15. 8. 2026) — ťuknutie namiesto písania.
//
// PREČO: na výsledok doscrolluje k výzve 90 % ľudí (`ConversationView` ~36 pri
// ~40 analýzach), ale písať začnú traja. Strata 92 % na jedinom kroku, najväčšia
// v celom lieviku. Nie je to problém viditeľnosti — je to prah prvého písmena.
// Vlastné dáta projektu to potvrdzujú: osem ťukov o vlastnej váhe dokončí 96 %
// ľudí, jedno prázdne textové pole nevyplní takmer nikto.
//
// Otázka je zámerne na to, čo o človeku ešte NEVIEME. Problém, históriu, vek aj
// kalórie máme z formulára; kedy mu to praská, nie. Aj samotné ťuknutie bez vety
// je teda použiteľná informácia, s ktorou sa dá začať rozhovor.
//
// `phrase` ide do správy pre Jána, `label` je text na tlačidle. Znenia vychádzajú
// z toho, čo ľudia reálne písali („Cez deň zvládnem ale večer nie", „Prídem
// unavená z práce", „Teóriu viem, dodržať neviem") — nie z domnienky.
const BREAK_POINTS = [
  { value: 'vecer', label: 'Večer doma', phrase: 'večer doma' },
  { value: 'praca', label: 'Cez deň v práci', phrase: 'cez deň v práci' },
  { value: 'vikend', label: 'Cez víkend', phrase: 'cez víkend' },
  { value: 'zaciatok', label: 'Už po pár dňoch', phrase: 'už po pár dňoch od začiatku' },
];

// Prvý krok na dnes podľa toho, čo človek označil ako svoj problém.
const FIRST_STEP = {
  'co-jest': 'K obedu aj večeri pridaj dlaň bielkovín (mäso, ryba, tvaroh, vajcia, strukoviny). Nič nerátaj — len nech tam sú.',
  'vecerne-chute': 'Zjedz poriadne raňajky s bielkovinami. Večerná chuť je najčastejšie účet za deň, v ktorom si zjedla primálo.',
  'nevydrzim': 'Vyber si jednu vec, ktorú udržíš aj v najhorší deň tohto týždňa. Jednu. Dôslednosť porazí dokonalosť.',
  'nemam-cas': 'Priprav si dnes dve porcie navyše z toho, čo aj tak varíš. Zajtrajšok tým máš vyriešený.',
  'potrebujem-podporu': 'Napíš si do kalendára jeden deň v týždni, kedy si spravíš kontrolu. Zodpovednosť drží vtedy, keď motivácia klesne.',
};

const SEGMENT_CALL_PROMISE = {
  'co-jest': 'ukážem ti, čo a koľko jesť — bez hádania pri každom jedle',
  'vecerne-chute': 'nájdeme, čím ti večerné chute začínajú už cez deň, a čo s tým',
  'nevydrzim': 'postavíme to tak, aby ťa jeden slabší deň nezhodil na začiatok',
  'nemam-cas': 'zmestíme to do tvojho dňa — bez varenia navyše a hodín v posilňovni',
  'potrebujem-podporu': 'vieš už, čo robiť — povieme si, ako to udržať, keď motivácia klesne',
};

const CALL_WINDOWS = ['Dnes večer', 'Zajtra doobeda', 'Zajtra večer', 'Kedykoľvek mi to zavolaj'];

// ---------- STAV ----------
const state = {
  gender: 'zena',      // 'zena' | 'muz' — predvolené, prepína sa pilulkami vo formulári
  age: null,
  height: null,
  weight: null,
  goalWeight: null,
  activity: null,
  problem: null,
  history: null,
  // Od v5 sa na pripravenosť nepýtame — nahradil ju `selectedPath`, čo je
  // PREJAVENÉ správanie (klik), nie vyhlásenie. Staré riadky v DB `readiness`
  // ešte majú (v4 aj hodnotu `informacie`), preto sa nesmú miešať s v5.
  selectedPath: null,  // 'written_consult' | 'valyra' — prvá cesta, ktorú človek
                       // reálne použil. Neprepisuje sa: rozhoduje prvý úmysel.
  breakPoint: null,    // hodnota z BREAK_POINTS — ťuknutie, ktoré otvorí formulár.
                       // Bez neho sa nedá odoslať; veta navyše je NEPOVINNÁ.
  leadId: null,      // uuid riadku z quizLead → kľúč na predvyplnenie Valyry
  name: '',
  email: '',
  started: false,
  gateTracked: false,
  askViewTracked: false,
  callbackSent: false,
};

// ID reklamy, z ktorej človek prišiel. Číta sa RAZ pri prvom načítaní a odkladá
// do sessionStorage — bez toho by sa stratilo, len čo si človek stránku obnoví
// alebo sa vráti späť, a lead by ostal bez atribúcie.
// Do URL reklamy treba doplniť makro `{{ad.id}}`; kým tam nie je, ostáva null
// a to je v poriadku (organická a priama návšteva ho nemá nikdy).
const CREATIVE_ID = (() => {
  const KEY = 'analyza_creative_id';
  try {
    const q = new URLSearchParams(location.search);
    const fromUrl = q.get('ad_id') || q.get('utm_content') || q.get('creative_id');
    if (fromUrl) {
      sessionStorage.setItem(KEY, fromUrl.slice(0, 60));
      return fromUrl.slice(0, 60);
    }
    return sessionStorage.getItem(KEY);
  } catch (e) {
    // Súkromný režim vie sessionStorage zakázať. Atribúcia je pekná vec,
    // ale nesmie zhodiť analýzu — preto sa chyba prehltne.
    return null;
  }
})();

const app = document.getElementById('app');
const progressTrack = document.getElementById('progressTrack');
progressTrack.hidden = true; // jedna obrazovka na vstup — ukazovateľ postupu tu nemá čo ukazovať

// `valyraUrl()` tu bola do 19. 8. 2026 — skladala odkaz na self-serve onboarding
// s UTM a kľúčom na predvyplnenie (`?a=<leadId>`, funkcia `analysisPrefill`).
// Odišla spolu s tlačidlom: na výsledku sa Valyra už nepredáva. Predvyplnenie
// v Supabase ostáva funkčné, len ho odtiaľto nikto nevolá — keby sa odkaz mal
// vrátiť, celý postup je v gite a v `docs/STAV.md` (fáza 2a, 10. 8.).

// Zapíše, ktorú cestu človek REÁLNE použil. Volá sa pri prvom prejave úmyslu —
// prvé písmeno v poli alebo rozbalenie telefónu — nie pri zobrazení ponuky.
// (Do 19. 8. sem patril aj klik na Valyru; tá cesta už neexistuje.)
// Klik ešte nie je dokončená konverzia (tú drží `consult_requested_at`),
// ale je to najskorší okamih, kedy vieme, čo si človek vybral.
//
// Prvý úmysel vyhráva a NEPREPISUJE sa: kto začne písať a potom si otvorí aj
// Valyru, je stále človek, ktorý najprv chcel odpoveď.
//
// ⚠️ Názvoslovie: `written_consult` znamená CESTU KU KONZULTÁCII vrátane
// telefónu — ten je vnorený v tom istom bloku. Hodnoty sú zámerne len dve,
// rovnako ako CHECK constraint v migrácii `008_quiz_leads_funnel_v5.sql`.
//
// Posiela sa mimo hlavného toku (`keepalive`) a každá chyba sa prehltne:
// meranie nesmie zhodiť ani spomaliť to, čo človek práve robí.
function recordPath(path) {
  if (state.selectedPath) return;
  state.selectedPath = path;
  trackAd('PathSelected', { path, source: CONFIG.SOURCE });
  if (!state.leadId) return; // bez uuid nie je čo v databáze aktualizovať
  try {
    fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        typ: 'cesta',
        leadId: state.leadId,
        selectedPath: path,
        creativeId: CREATIVE_ID,
        quizVersion: CONFIG.FUNNEL_VERSION,
      }),
    }).catch(() => {});
  } catch (e) { /* ticho — atribúcia nie je dôvod na chybu pre človeka */ }
}

// Skloňovanie v textoch mimo showResult (tam má vlastné `g`). Zástupné značky
// v tvare {sama} sa nahradia podľa pohlavia — texty tak ostávajú čitateľné.
const GENDER_FORMS = {
  sama: ['sama', 'sám'],
  vydrzala: ['vydržala', 'vydržal'],
  zadala: ['zadala', 'zadal'],
  napisala: ['napísala', 'napísal'],
};
function gg(text) {
  return String(text).replace(/\{(\w+)\}/g, (m, key) => {
    const pair = GENDER_FORMS[key];
    return pair ? pair[state.gender === 'muz' ? 1 : 0] : m;
  });
}

// ---------- MERANIE ----------
// Konverzie musia ísť adresne na pixel ad účtu — druhý pixel (Valyra) ad účet
// nevidí, takže by sa signál stratil. Rovnaké pravidlo ako na kvíze.
function trackAd(event, params = {}) {
  if (typeof fbq !== 'function') return;
  const std = ['Lead', 'CompleteRegistration', 'ViewContent', 'Contact'];
  const method = std.includes(event) ? 'trackSingle' : 'trackSingleCustom';
  fbq(method, CONFIG.PIXEL_AD, event, params);
}

// ---------- VÝPOČET ----------
// Mifflin-St Jeor — dnes najpoužívanejší odhad bazálneho výdaja.
// Slovenské skloňovanie po číslovke: 1 týždeň · 2–4 týždne · 5+ týždňov.
// Pri rozsahu rozhoduje horné číslo („4–5 mesiacov").
function plural(n, one, few, many) {
  if (n === 1) return one;
  return n >= 2 && n <= 4 ? few : many;
}

function bmr({ gender, weight, height, age }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'muz' ? base + 5 : base - 161;
}

function activityFactor(value) {
  return (ACTIVITY_Q.options.find(o => o.value === value) || ACTIVITY_Q.options[0]).factor;
}

// Deficit 500 kcal = bežné a udržateľné tempo (~0,5 kg/týždeň). Dve poistky:
// absolútne dno 1 200 / 1 500 kcal a strop deficitu na 28 % výdaja, aby drobným
// ľuďom s nízkym výdajom nevyšlo niečo, čo sa nedá dlhodobo jesť.
// (Dno na úrovni bazálneho výdaja by pri sedavom režime blokovalo AKÝKOĽVEK
// rozumný deficit — TDEE je vtedy len 1,2× BMR.)
function calcPlan(s) {
  const b = bmr(s);
  const tdee = Math.round(b * activityFactor(s.activity));
  const floor = s.gender === 'muz' ? 1500 : 1200;
  const target = Math.round(Math.max(tdee - 500, floor, tdee * 0.72) / 10) * 10;
  const deficit = Math.max(tdee - target, 0);

  const toLose = Math.max(s.weight - s.goalWeight, 0);
  // 1 kg tuku ≈ 7 700 kcal. Zaokrúhľujeme na desatinu, viac presnosti by klamalo.
  const perWeek = Math.round((deficit * 7 / 7700) * 10) / 10;
  const weeks = perWeek > 0 ? toLose / perWeek : 0;
  // Rozsah, nie jedno číslo: niekto schudne rýchlejšie, niekto ochorie, niekto sa zastaví.
  const weeksFrom = Math.max(Math.round(weeks), 1);
  const weeksTo = Math.max(Math.round(weeks * 1.25), weeksFrom + 1);
  const monthsFrom = Math.max(Math.round(weeksFrom / 4.3), 1);
  const monthsTo = Math.max(Math.round(weeksTo / 4.3), monthsFrom + 1);

  // Bielkoviny počítame z CIEĽOVEJ váhy — pri vyššej nadváhe by výpočet
  // z aktuálnej váhy dal nereálne veľa a človek by to vzdal na prvom jedle.
  const protein = Math.round((1.8 * Math.max(s.goalWeight, 45)) / 5) * 5;

  const bmiGoal = s.goalWeight / Math.pow(s.height / 100, 2);

  // Pri veľmi nízkom výdaji (drobná, staršia, sedavá) zostane po dne 1 200 kcal
  // deficit taký malý, že by výsledok tvrdil „schudneš 0 kg za týždeň, cieľ za
  // 2 týždne". Radšej to priznáme: jedlom sa to samo nedá, treba pridať pohyb.
  const tooLow = perWeek < 0.2;

  return { bmr: Math.round(b), tdee, target, deficit, toLose, perWeek, weeksFrom, weeksTo, monthsFrom, monthsTo, protein, bmiGoal, tooLow };
}

// ---------- OBRAZOVKA — VŠETKY ÚDAJE NARAZ ----------
// Pôvodne osem obrazoviek po jednej otázke. Zmenené na Jánovo želanie na jeden
// formulár — rýchlejšie vyplnenie pre niekoho, kto už vie, čo chce zadať, aj keď
// to znamená viac na jednej obrazovke naraz. Validácia beží pri odoslaní.
function selectHtml(id, label, options, note = '') {
  return `
      <div class="field">
        <label for="${id}">${label}</label>
        ${note ? `<p class="field-note">${note}</p>` : ''}
        <select id="${id}">
          <option value="" disabled selected>Vyber…</option>
          ${options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
        </select>
      </div>`;
}

function renderForm() {
  app.innerHTML = `
    <section class="question-screen first">
      <div class="q-hook">
        <div class="eyebrow">Osobná analýza chudnutia · 2 minúty</div>
        <h1>Zisti, koľko máš jesť, aby si <span class="flip">schudla bez hladovania</span></h1>
        <p class="lead">Vyplň o sebe pár údajov — spočítam ti tvoje kalórie, bielkoviny aj to, ako dlho by ti cesta k cieľu reálne trvala.</p>
      </div>

      <div class="field">
        <label>Píšem ti ako…</label>
        <div class="gender-row" id="genderRow">
          <button type="button" class="gender-pill active" data-g="zena">Žena</button>
          <button type="button" class="gender-pill" data-g="muz">Muž</button>
        </div>
      </div>

      <div class="num-grid">
        <div class="field">
          <label for="numAge">Vek</label>
          <input type="number" inputmode="numeric" id="numAge" placeholder="napr. 42">
        </div>
        <div class="field">
          <label for="numHeight">Výška (cm)</label>
          <input type="number" inputmode="numeric" id="numHeight" placeholder="napr. 167">
        </div>
        <div class="field">
          <label for="numWeight">Váha dnes (kg)</label>
          <input type="number" inputmode="numeric" id="numWeight" placeholder="napr. 84">
        </div>
        <div class="field">
          <label for="numGoal">Cieľová váha (kg)</label>
          <input type="number" inputmode="numeric" id="numGoal" placeholder="napr. 73">
        </div>
      </div>

      ${selectHtml('selActivity', ACTIVITY_Q.q, ACTIVITY_Q.options, ACTIVITY_Q.note)}
      ${selectHtml('selProblem', PROBLEM_Q.q, PROBLEM_Q.options)}
      ${selectHtml('selHistory', HISTORY_Q.q, HISTORY_Q.options)}

      <div class="error-msg" id="errMsg"></div>
      <button class="btn" id="submitFormBtn">Spočítaj mi to</button>

      <p class="intro-note">Na konci ťa poprosím o e-mail — pošlem ti na neho tvoju analýzu, aby si ju mala po ruke. Svoje čísla uvidíš aj tu na stránke.</p>
      <p class="footnote">Počíta Ján — tréner a výživový poradca, ktorý sám schudol 45 kg a drží si to už 8 rokov.</p>
    </section>
  `;

  document.querySelectorAll('.gender-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.gender = btn.dataset.g;
      document.querySelectorAll('.gender-pill').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  document.getElementById('submitFormBtn').addEventListener('click', submitForm);
}

function submitForm() {
  if (!state.started) {
    state.started = true;
    trackAd('AnalysisStart');
  }

  const err = document.getElementById('errMsg');
  const showErr = (msg) => { err.textContent = msg; err.classList.add('show'); err.scrollIntoView({ behavior: 'smooth', block: 'center' }); };

  const readNum = (id, key) => {
    const raw = document.getElementById(id).value;
    return parseFloat(String(raw).replace(',', '.'));
  };
  const age = readNum('numAge', 'age');
  const height = readNum('numHeight', 'height');
  const weight = readNum('numWeight', 'weight');
  const goalWeight = readNum('numGoal', 'goalWeight');

  for (const [key, val] of [['age', age], ['height', height], ['weight', weight], ['goalWeight', goalWeight]]) {
    const lim = NUM_LIMITS[key];
    if (!Number.isFinite(val) || val < lim.min || val > lim.max) {
      return showErr(`Skontroluj, prosím, ${lim.label} (${lim.min}–${lim.max}).`);
    }
  }
  // Cieľová váha vyššia než súčasná = človek si to pomýlil alebo nechce chudnúť;
  // tak či tak nemá zmysel počítať deficit a tváriť sa, že je všetko v poriadku.
  if (goalWeight >= weight) {
    return showErr('Cieľová váha má byť nižšia než súčasná — inak nie je čo počítať.');
  }

  const activity = document.getElementById('selActivity').value;
  const problem = document.getElementById('selProblem').value;
  const history = document.getElementById('selHistory').value;
  if (!activity || !problem || !history) {
    return showErr('Ešte ti chýba vyplniť jednu z otázok nižšie.');
  }

  err.classList.remove('show');
  Object.assign(state, {
    age: Math.round(age), height: Math.round(height), weight: Math.round(weight), goalWeight: Math.round(goalWeight),
    activity, problem, history,
  });
  showGate();
  window.scrollTo(0, 0);
}

// ---------- E-MAILOVÁ STENA ----------
// Ukážka hodnoty PRED stenou: udržovacie kalórie dostane zadarmo. Za e-mail je
// zvyšok (cieľové kalórie, bielkoviny, tempo, čas do cieľa, prvé kroky).
// Rovnaké pravidlo ako na kvíze — pýtať adresu za mačku vo vreci stálo 58 % ľudí.
function showGate() {
  const plan = calcPlan(state);
  if (!state.gateTracked) {
    state.gateTracked = true;
    trackAd('AnalysisComplete', { problem: state.problem, history: state.history });
  }

  app.innerHTML = `
    <section class="gate">
      <div class="step-label">Hotovo ✓ Spočítané</div>
      <div class="teaser-card">
        <div class="teaser-eyebrow">Tvoj odhadovaný denný výdaj</div>
        <div class="teaser-num">${plan.tdee} <small>kcal</small></div>
        <p>Toľko spáliš pri svojej výške, váhe, veku a pohybe. Koľko z toho máš jesť, aby si ${state.gender === 'muz' ? 'schudol' : 'schudla'} — a ako dlho by to trvalo — ti ukážem hneď.</p>
      </div>
      <h2>Kam ti mám poslať celú analýzu?</h2>
      <p class="sub">Po zadaní adresy uvidíš svoje čísla hneď tu. Na e-mail ti ich pošlem, aby si ich nemusela hľadať.</p>
      <div class="field">
        <label for="name">Krstné meno</label>
        <input type="text" id="name" autocomplete="given-name" placeholder="${state.gender === 'muz' ? 'Napr. Peter' : 'Napr. Zuzana'}">
      </div>
      <div class="field">
        <label for="email">E-mail</label>
        <input type="email" id="email" autocomplete="email" placeholder="tvoj@email.sk">
      </div>
      <label class="consent">
        <input type="checkbox" id="gdpr">
        <span>Súhlasím so spracovaním údajov na zaslanie analýzy a tipov k zdravému chudnutiu a s občasnými informáciami o službách a spolupráci. Odhlásiť sa dá kedykoľvek jedným klikom.</span>
      </label>
      <div class="error-msg" id="errMsg" role="alert" aria-live="polite"></div>
      <button class="btn" id="submitBtn">Ukáž mi moju analýzu</button>
    </section>
  `;
  document.getElementById('submitBtn').addEventListener('click', submitLead);
}

async function submitLead() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const gdpr = document.getElementById('gdpr').checked;
  const err = document.getElementById('errMsg');
  const btn = document.getElementById('submitBtn');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!name || !emailOk || !gdpr) {
    err.textContent = !name ? 'Doplň, prosím, meno.'
      : !emailOk ? 'Skontroluj, prosím, e-mail — nevyzerá kompletný.'
      : 'Bez súhlasu ti analýzu nemôžem poslať.';
    err.classList.add('show');
    document.getElementById(!name ? 'name' : !emailOk ? 'email' : 'gdpr').focus();
    return;
  }
  err.classList.remove('show');
  btn.disabled = true;
  btn.textContent = 'Počítam…';

  state.name = name;
  state.email = email;
  const plan = calcPlan(state);

  const payload = {
    name,
    email,
    gender: state.gender,
    // Zložený segment: problém|história. Tretí diel (pripravenosť) mala len v4;
    // od v5 sa nepýtame, takže je zase dvojdielny ako vo v3. Práve preto sa
    // v4 riadky nesmú porovnávať s v5 naslepo — `quizVersion` je na to.
    segment: [state.problem, state.history].filter(Boolean).join('|'),
    baseSegment: state.problem,
    history: state.history,
    // Analýza nemá skóre. Výsledok posielame cez `bandName`, ktorý backend ukladá
    // aj vypisuje v notifikácii — Ján tak v maili rovno vidí, s akými číslami
    // človek odišiel, bez zmeny schémy DB kvôli testu.
    band: 'analyza',
    bandName: `${plan.target} kcal · ${plan.protein} g bielkovín · do cieľa −${plan.toLose} kg`,
    analysis: {
      age: state.age, height: state.height, weight: state.weight, goalWeight: state.goalWeight,
      activity: state.activity, tdee: plan.tdee, target: plan.target, protein: plan.protein,
    },
    ts: new Date().toISOString(),
    source: CONFIG.SOURCE,
    creativeId: CREATIVE_ID,
    quizVersion: CONFIG.FUNNEL_VERSION,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Lead API: ${res.status}`);
    // uuid riadku → kľúč, ktorým si Valyra vyzdvihne čísla na predvyplnenie.
    // Do odkazu ide zámerne uuid, nie e-mail ani váha: je náhodné a samo o sebe
    // nepovie, komu patrí. Keď ho backend nevráti, odkaz funguje ďalej — len
    // sa nepredvyplní, čo je horší zážitok, nie chyba.
    state.leadId = await res.json().then((d) => d && d.leadId).catch(() => null);
    // CompleteRegistration = ten istý konverzný event ako kvíz, aby sa dali
    // porovnávať ceny za lead medzi oboma magnetmi v jednom účte.
    if (typeof fbq === 'function') fbq('track', 'CompleteRegistration');
    showResult(plan);
  } catch (e) {
    err.innerHTML = `Odoslanie sa nepodarilo. Skús to ešte raz — alebo mi napíš na <a href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a> a pošlem ti analýzu ručne.`;
    err.classList.add('show');
    btn.disabled = false;
    btn.textContent = 'Skúsiť znova';
  }
}

// ---------- VÝSLEDOK ----------
function showResult(plan) {
  const g = (z, m) => (state.gender === 'muz' ? m : z);
  const repeatedRelapse = state.history === 'viackrat' || state.history === 'jojo';
  const wantsGuidance = state.problem === 'potrebujem-podporu';
  const hot = repeatedRelapse || wantsGuidance;
  const tier = hot ? 'hot' : 'warm';

  const firstStep = FIRST_STEP[state.problem] || FIRST_STEP['co-jest'];
  const callPromise = SEGMENT_CALL_PROMISE[state.problem] || SEGMENT_CALL_PROMISE['co-jest'];

  // Zámerne rozsah, nie jedno číslo. „Potrebuješ 18 týždňov" znie presne, ale
  // realita presná nebude — a nepresný sľub sa vráti ako námietka.
  const timeLine = plan.perWeek > 0
    ? `Ak sa plánu budeš dlhodobo držať, cieľ môžeš dosiahnuť <strong>približne za ${plan.weeksFrom}–${plan.weeksTo} ${plural(plan.weeksTo, 'týždeň', 'týždne', 'týždňov')}</strong> (asi ${plan.monthsFrom}–${plan.monthsTo} ${plural(plan.monthsTo, 'mesiac', 'mesiace', 'mesiacov')}).`
    : 'Tvoj cieľ je od súčasnej váhy veľmi blízko — tu už nejde o chudnutie, ale o udržanie.';

  const bmiWarn = plan.bmiGoal < 18.5
    ? `<p class="warn-note">Tvoja cieľová váha je pod hranicou zdravého rozpätia. Číslo nižšie ti spočítam, ale úprimne: takto nízko by som ${g('ťa neposielal', 'ťa neposielal')} bez dohľadu lekára.</p>`
    : '';

  const relapseLine = repeatedRelapse
    ? `<p class="relapse-line">A ešte jedna vec, ktorú si ${g('označila', 'označil')}: kilá sa ti už vrátili. To nie je o vôli — je to o tom, že plán na papieri a plán, ktorý prežije zlý týždeň, sú dve rôzne veci.</p>`
    : '';

  // ---------- ZÁVER VÝSLEDKU: ŽIADNE VETVENIE ----------
  // Od v5 tu nie je routing vôbec. Každý dostane to isté a v tom istom poradí:
  // najprv cesta ku konzultácii, potom Valyra. `tier` na UI nemá vplyv a nikdy
  // mať nesmie — slúži len notifikácii Jánovi.
  //
  // ⚠️ Ak sem niekto pridá vetvenie, oba bloky v ňom MUSIA ostať. Vo v4 sa
  // stalo presne to, že vetva ponuku vypla — 98 % ľudí ju nikdy neuvidelo.
  // Poradie je celý zmysel tejto zmeny: NAJPRV ťuknutie, pole a tlačidlo až po ňom.
  // Prázdne pole s kurzorom bolo doteraz prvé, čo tu človek uvidel — a 92 % ľudí,
  // ktorí sem doscrollovali, doň nenapísalo ani písmeno. Jedno rozhodnutie naraz.
  const writePane = (placeholder) => `
      <div class="callback" id="callbackForm">
        <div class="break-row" id="breakRow" role="group" aria-label="Kedy ti to najčastejšie praskne">
          ${BREAK_POINTS.map((b) => `<button type="button" class="break-chip" aria-pressed="false" data-break="${b.value}">${b.label}</button>`).join('')}
        </div>
        <div id="askPane" hidden>
          <p class="ask-echo" id="askEcho"></p>
          <div class="error-msg" id="cbErr" role="alert" aria-live="polite"></div>
          <button type="button" class="btn" id="cbSubmit">Chcem Jánovu osobnú odpoveď</button>
          <p class="callback-note callback-promise">Bez telefonátu, zadarmo. Odpoviem na e-mail, ktorý si ${g('zadala', 'zadal')} vyššie.</p>
          <label class="ask-optional" for="message">Chceš k tomu doplniť vetu? <span>(nepovinné)</span></label>
          <textarea id="message" rows="3" placeholder="${placeholder}"></textarea>
        </div>
      </div>`;

  // Telefón je vždy až druhá možnosť a rozbalí sa len po vedomom kliknutí.
  // Slovo „rezervácia" tu zámerne nie je — človek nechá číslo, termín si nevyberá.
  const callPane = `
      <button type="button" class="btn secondary" id="callToggle">Radšej si to prejdeme spolu? Chcem 15-minútový hovor</button>
      <div class="callback" id="callFormPane" hidden>
        <label class="callback-note callback-promise" for="phone">Číslo použijem len na tento jeden hovor. Nikde ho nezverejňujem a neposielam naň reklamu.</label>
        <input type="tel" id="phone" inputmode="tel" autocomplete="tel" placeholder="+421 900 123 456">
        <div class="when-label" id="whenLabel">Kedy sa ti to hodí? <span>(nepovinné)</span></div>
        <div class="when-row" id="whenRow" role="group" aria-labelledby="whenLabel">
          ${CALL_WINDOWS.map(w => `<button type="button" class="when-chip" data-when="${w}">${w}</button>`).join('')}
        </div>
        <div class="error-msg" id="callErr" role="alert" aria-live="polite"></div>
        <button type="button" class="btn" id="callSubmit">Chcem, aby mi Ján zavolal</button>
        <p class="callback-alt">Radšej si vyberieš termín ${g('sama', 'sám')}? <a href="${CONFIG.CAL_URL}" target="_blank" rel="noopener" id="calLink">Otvor kalendár</a>.</p>
      </div>`;

  const placeholder = gg(MESSAGE_PLACEHOLDER[state.problem] || MESSAGE_PLACEHOLDER['co-jest']);

  // ---------- DVE CESTY, KONZULTÁCIA PRVÁ ----------
  // Od v5 (13. 8. 2026) sa už nikoho nepýtame, čo chce. Otázka na pripravenosť
  // sedela na e-mailovej stene a bola POVINNÁ — stála teda medzi človekom a tým
  // najhodnotnejším krokom lievika (41,8 % z návštev). Teraz rozhoduje KLIK:
  // prejavené správanie je lepší údaj než vyhlásenie o sebe a nič nestojí.
  //
  // Poradie nie je vec vkusu. Konzultácia je hore, lebo je to jediná cesta
  // s dokázaným výsledkom: 10 žiadostí, z toho 8 písomných. Valyra self-serve
  // má 24 registrácií a nula platiacich. Preto je druhá — ale plnohodnotná,
  // s vlastným tlačidlom. Rovnocennou sa stane, keď z nej príde prvý platiaci.
  //
  // ⚠️ Textarea musí ostať VŽDY viditeľná, nikdy za tlačidlom. Vo v4 bola vo
  // vetve `plan` schovaná za „Mám ešte otázku pre Jána" a za dva dni ju
  // neotvoril nikto.
  const askBlock = `
      <div class="offer" id="askCard">
        <div class="offer-eyebrow">Tvoj ďalší krok</div>
        <h3 class="offer-title">Kedy ti to najčastejšie praskne?</h3>
        <p class="offer-lead">Ťukni na to, čo ti sedí najviac. Pozriem sa na tvoje čísla aj na to, čo si ${g('označila', 'označil')}, a osobne ti odpíšem, čo by som na tvojom mieste upravil ako prvé.</p>
      </div>
      ${writePane(placeholder)}
      ${callPane}`;

  // VALYRA NIE JE DRUHÁ PONUKA (19. 8. 2026).
  //
  // Rozhodnutie je staré (24. 7.) a v `lievik/docs/PONUKA.md` sekcii 1 stojí
  // doslova: „Valyra je nástroj v platenej spolupráci, nie lákadlo." Stránka mu
  // pritom do dnes odporovala — mala tu blok „Druhá možnosť · Alebo chceš začať
  // sama, hneď teraz?" s vlastným tlačidlom na self-serve registráciu. To je
  // presne to lákadlo, ktoré rozhodnutie zakazuje.
  //
  // Dáta to potvrdzujú z druhej strany: to tlačidlo bralo VIAC klikov než
  // konzultácia (9 vs 8 vo v5) a za celý čas kampane z neho neprišlo ani jedno
  // euro — 24 registrácií z leadov, 0 platieb. Súťažilo s jedinou cestou, ktorá
  // kedy vyrobila rozhovor, a vyhrávalo.
  //
  // Ostáva jedna veta bez tlačidla a bez odkazu. Valyra sa tým stáva dôvodom
  // pre spoluprácu namiesto alternatívy k nej.
  //
  // ⚠️ ČO SEM NESMIE: cena programu (150 €), jeho dĺžka ani obsah. „Čo presne je
  // v cene" je v PONUKA.md stále otvorené a ponuka sa hovorí v odpovedi človeku,
  // nie na stránke. Peniaze patria do repa `lievik`, toto je verejné.
  const valyraLine = `
      <p class="soft-link">Valyra je moja appka na jedálničky a denné kroky. Nastavujem ju na čísla ľuďom, ktorých vediem.</p>`;

  const ctaBlock = askBlock + (CONFIG.VALYRA.ENABLED ? valyraLine : '');

  app.innerHTML = `
    <section class="result">
      <div class="plan-head">
        <div class="step-label">Tvoja osobná analýza</div>
        <h2>${state.name}, tu sú tvoje čísla</h2>
      </div>

      <div class="plan-card">
        <div class="plan-row"><span>Odhad udržovacích kalórií</span><strong>${plan.tdee} kcal</strong></div>
        <div class="plan-row highlight"><span>Pre chudnutie začni na</span><strong>${plan.target} kcal</strong></div>
        <div class="plan-row"><span>Bielkoviny</span><strong>${plan.protein} g denne</strong></div>
        <div class="plan-row"><span>Do cieľa ti zostáva</span><strong>${plan.toLose} kg</strong></div>
      </div>

      <div class="pace-card">
        ${plan.tooLow
          ? `<p><strong>Tu ti musím povedať pravdu:</strong> tvoj odhadovaný výdaj je nízky, takže samotným jedlom sa rozumný deficit spraviť nedá — pod ${plan.target} kcal ťa posielať nebudem, to už je hladovanie.</p>
             <p>Riešenie nie je jesť menej, ale <strong>zdvihnúť výdaj</strong>: každodenná chôdza a silový tréning. Presne toto je prípad, kde má zmysel prejsť si to spolu — na papieri sa to nedá vyriešiť.</p>`
          : `<p>Pri tomto tempe chudneš <strong>približne ${String(plan.perWeek).replace('.', ',')} kg za týždeň</strong>.</p>
             <p>${timeLine}</p>
             ${plan.weeksTo > 30 ? '<p>Áno, je to dlhá cesta. O to viac rozhoduje, či ju máš s kým prejsť — samota je najčastejší dôvod, prečo sa to nedotiahne.</p>' : ''}`}
      </div>
      ${bmiWarn}

      <div class="personal-insight"><strong>Prvý krok — sprav ho ešte dnes</strong>${firstStep}</div>
      <div class="steps-card">
        <div class="steps-title">A tieto tri veci drž celý prvý týždeň</div>
        <div>✅ Raňajky s bielkovinami</div>
        <div>✅ Vypi 2 litre vody denne</div>
        <div>✅ Prejdi sa 30 minút</div>
      </div>

      <p class="email-note">📬 Analýzu ti posielam aj na e-mail. Ak nepríde do pár minút, pozri si priečinok Hromadné/Spam.</p>

      <div class="coach-card">
        <div class="proof-pair">
          <figure>
            <img src="/img/jan-pred-133.jpg" width="500" height="760" alt="Ján pred chudnutím" loading="lazy" decoding="async">
            <figcaption><span>Pred</span><strong>133 kg</strong></figcaption>
          </figure>
          <figure class="after">
            <img src="/img/jan-dnes-88.jpg" width="500" height="760" alt="Ján dnes" loading="lazy" decoding="async">
            <figcaption><span>Dnes</span><strong>88 kg</strong></figcaption>
          </figure>
        </div>
        <p class="proof-note">Toto som ja — vľavo pred ôsmimi rokmi, vpravo dnes. Nie je to fotka klienta: je to cesta, ktorou som prešiel sám a ktorú dnes stavím ľuďom, ktorých vediem.</p>
        <p><strong>Toto je matematicky správny plán.</strong> Najťažšie nie je vypočítať kalórie. Najťažšie je dodržať ich v pondelok po práci, v piatok večer alebo cez víkend. Presne s tým pomáham klientom.</p>
        ${relapseLine}
      </div>

      ${ctaBlock}

      <p class="disclaimer">Výpočet je odhad podľa rovnice Mifflin–St Jeor. Nenahrádza lekára — ak si tehotná, dojčíš alebo sa liečiš, over si to najprv u neho.</p>
    </section>
  `;

  const meta = { segment: state.problem, history: state.history, tier, source: CONFIG.SOURCE };
  trackAd('ConsultView', meta);

  // MERANIE VALYRY ZRUŠENÉ 19. 8. 2026 spolu s tlačidlom.
  //
  // Zmizli `ValyraOfferView` a `ValyraCheckoutStart` a `selected_path` už nikdy
  // nebude 'valyra'. Stĺpec aj hodnotu v CHECK constrainte nechávame — staré
  // riadky ju majú a prepisovať históriu by znamenalo stratiť možnosť porovnať,
  // čo sa stalo, keď tá druhá cesta ešte existovala (9 klikov, 0 platieb).
  //
  // ⚠️ PRI VYHODNOCOVANÍ: `selected_path = 'valyra'` existuje len pre leady
  // do 19. 8. Po tomto dátume je jediná zaznamenaná cesta 'written_consult',
  // takže podiely ciest sa medzi obdobiami NEDAJÚ porovnávať.

  // Písomná cesta je od v5 viditeľná v oboch vetvách, takže tu už nie je čo
  // rozbaľovať. `ConversationView` sa preto páli v oboch — je to „videl pole",
  // nie „vybral si podporu". Pri porovnávaní s v4 to treba vedieť: vo v4 sa
  // pálilo len vo vetve `podpora`, teda 2 % ľudí.
  //
  // `MessageStart` sa už neviaže na otvorenie panelu (žiadny nie je), ale na
  // prvé písmeno v poli. To je lepší signál — meria úmysel, nie klik zo zvedavosti.
  const askCard = document.getElementById('askCard');
  if (askCard && 'IntersectionObserver' in window) {
    const ioAsk = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting) && !state.askViewTracked) {
        state.askViewTracked = true;
        trackAd('ConversationView', meta);
        ioAsk.disconnect();
      }
    }, { threshold: 0.5 });
    ioAsk.observe(askCard);
  } else if (askCard) {
    state.askViewTracked = true;
    trackAd('ConversationView', meta);
  }

  // Ťuknutie na „kedy to praská" je nový prvý krok a otvára zvyšok formulára.
  // Páli vlastnú udalosť `BreakPointSelected`. `MessageStart` ZÁMERNE zostáva
  // viazaný na písanie — keby som mu zmenil význam na „ťukol", číslo „koľkí
  // začali písať" by pred zmenou a po nej meralo dve rôzne veci a porovnanie
  // verzií by sa ticho rozbilo.
  const chips = Array.from(document.querySelectorAll('.break-chip'));
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      state.breakPoint = chip.dataset.break;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      // Ozvena ťuknutia. Ukázať DOSLOVA to, čo sa odošle, je zároveň potvrdenie,
      // že ťuknutie sa počíta, aj informácia, že odoslanie ešte len príde.
      // Prepisuje sa pri KAŽDOM ťuknutí, nielen pri prvom — inak by po zmene
      // voľby ukazovala starú vetu.
      const bp = BREAK_POINTS.find((b) => b.value === state.breakPoint);
      const echo = document.getElementById('askEcho');
      if (echo && bp) echo.innerHTML = 'Odošle sa: <strong>Praská mi to ' + bp.phrase + '.</strong>';

      const pane = document.getElementById('askPane');
      if (pane && pane.hidden) {
        pane.hidden = false;
        recordPath('written_consult');
        trackAd('BreakPointSelected', { ...meta, breakPoint: state.breakPoint });
        // Bez fokusu do textarey zámerne: na mobile by vyskočila klávesnica a
        // prekryla by tlačidlo aj slovo „nepovinné". Kto chce písať, klikne sám.
        //
        // ⚠️ Scrolluje sa na TLAČIDLO, nie na začiatok panelu. S block:'nearest'
        // ostávalo tlačidlo pod okrajom obrazovky a 12 z 25 ľudí ťuklo a neodoslalo
        // (zistené 18. 8. 2026). Cieľom pohľadu musí byť ďalší krok, nie pole.
        const cielScroll = document.getElementById('cbSubmit');
        if (cielScroll) {
          cielScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Poistka: plynulý scroll v časti prehliadačov ticho nespraví NIČ
          // (overené 18. 8. 2026 — scrollY ostal na nule, skok bez animácie
          // fungoval). Keď sa tlačidlo do 400 ms nedostane do zorného poľa,
          // doskrolluj natvrdo. Vidieť ďalší krok je dôležitejšie než plynulosť.
          setTimeout(() => {
            const r = cielScroll.getBoundingClientRect();
            if (r.top < 0 || r.bottom > window.innerHeight) {
              cielScroll.scrollIntoView({ block: 'center' });
            }
          }, 400);
        }
      }
    });
  });

  const messageBox = document.getElementById('message');
  if (messageBox) {
    messageBox.addEventListener('input', () => {
      recordPath('written_consult');
      trackAd('MessageStart', meta);
    }, { once: true });
  }

  let chosenWindow = '';
  const cbSubmit = document.getElementById('cbSubmit');
  if (cbSubmit) {
    cbSubmit.addEventListener('click', () => submitCallback(meta, () => '', () => 'write'));
  }

  // Telefón sa rozbalí len na vedomé kliknutie a NEfokusuje sa — numerická
  // klávesnica by prekryla to, čo je tu primárne, teda písomnú cestu.
  const callToggle = document.getElementById('callToggle');
  if (callToggle) {
    callToggle.addEventListener('click', () => {
      const pane = document.getElementById('callFormPane');
      pane.hidden = false;
      callToggle.hidden = true;
      // Telefón je súčasť cesty ku konzultácii, nie tretia cesta.
      recordPath('written_consult');
      trackAd('CallOpen', meta);
      pane.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, { once: true });

    document.querySelectorAll('.when-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chosenWindow = chip.dataset.when;
        document.querySelectorAll('.when-chip').forEach((c) => c.classList.toggle('active', c === chip));
      });
    });
    document.getElementById('callSubmit')
      .addEventListener('click', () => submitCallback(meta, () => chosenWindow, () => 'call'));
    document.getElementById('calLink')
      .addEventListener('click', () => trackAd('CalendarClick', meta), { once: true });
  }
}

async function submitCallback(meta, getWindow, getMode) {
  if (state.callbackSent) return;
  const writing = getMode() === 'write';
  // Každá cesta má vlastné pole na chybu aj vlastné tlačidlo — po novom môžu byť
  // na obrazovke obe naraz (vetva `podpora`), takže sa nesmú prepisovať navzájom.
  const err = document.getElementById(writing ? 'cbErr' : 'callErr');
  const btn = document.getElementById(writing ? 'cbSubmit' : 'callSubmit');
  const input = document.getElementById(writing ? 'message' : 'phone');
  const phone = writing ? '' : document.getElementById('phone').value.trim();
  // Veta je NEPOVINNÁ — stačí ťuknutie. Správa sa skladá tak, aby Ján z notifikácie
  // videl to podstatné aj vtedy, keď človek nedopísal nič. Backend navyše vyžaduje
  // neprázdnu správu (CHECK v `quiz_calls`: riadok musí mať telefón alebo správu),
  // takže prázdny text sa sem nesmie dostať.
  const extra = writing ? document.getElementById('message').value.trim() : '';
  const bp = BREAK_POINTS.find((b) => b.value === state.breakPoint);
  const message = writing
    ? [bp ? `Praská mi to ${bp.phrase}.` : '', extra].filter(Boolean).join('\n\n')
    : '';

  if (!writing && phone.replace(/\D/g, '').length < 9) {
    err.textContent = 'Skontroluj, prosím, číslo — nevyzerá kompletné.';
    err.classList.add('show');
    input.focus();
    return;
  }
  // Poistka: tlačidlo je skryté, kým sa neťukne, takže sem sa dá dostať len
  // okrajovo. Chyba preto smeruje na ťuknutie, nie do textového poľa.
  if (writing && message.length < 2) {
    err.textContent = 'Ťukni, prosím, na to, kedy ti to najčastejšie praskne.';
    err.classList.add('show');
    document.getElementById('breakRow')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('.break-chip')?.focus();
    return;
  }
  err.classList.remove('show');
  btn.disabled = true;
  btn.textContent = 'Posielam…';

  const plan = calcPlan(state);
  const payload = {
    typ: 'konzultacia',
    name: state.name,
    email: state.email,
    phone,
    message,
    // Termín patrí len k hovoru — pri správe by bol v tabuľke mätúci údaj.
    preferredTime: writing ? '' : (getWindow() || ''),
    segment: state.problem,
    history: state.history,
    selectedPath: state.selectedPath,
    tier: meta.tier,
    source: CONFIG.SOURCE,
    creativeId: CREATIVE_ID,
    band: `${plan.target} kcal / ${plan.protein} g B`,
    ts: new Date().toISOString(),
    quizVersion: CONFIG.FUNNEL_VERSION,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(CONFIG.BOOKING_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Booking API: ${res.status}`);
    // Samotné 200 nestačí: funkcia, ktorá o rezervácii nevie, by request prijala
    // a telefón ticho zahodila — sľúbili by sme hovor, na ktorý nie je kam volať.
    const out = await res.json().catch(() => null);
    // Obe cesty sú platný kontakt — `message` musí prejsť rovnako ako `call`,
    // inak by človek dostal chybu na zápis, ktorý v skutočnosti prebehol.
    if (!out || (out.kind !== 'call' && out.kind !== 'message')) {
      throw new Error('zápis kontaktu nepotvrdený');
    }

    state.callbackSent = true;
    // Písomná správa NIE JE rezervovaný hovor — preto samostatné eventy popri
    // spoločnom `Lead`. Inak by sa v Ads Manageri tvárili ako to isté.
    trackAd('Lead', {
      ...meta, way: writing ? 'message' : 'call',
      selectedPath: state.selectedPath, funnelVersion: CONFIG.FUNNEL_VERSION,
      value: 25.00, currency: 'EUR',
    });
    trackAd(writing ? 'MessageSent' : 'CallRequested', { ...meta, selectedPath: state.selectedPath });
    document.getElementById(writing ? 'callbackForm' : 'callFormPane').innerHTML = `
      <div class="callback-done">
        <h4>✓ Mám to, ${state.name}</h4>
        ${writing
          // Kto len ťukol a nič nedopísal, ten NIČ NENAPÍSAL — potvrdenie mu to
          // nesmie tvrdiť. Rozlíšenie stojí jednu podmienku a je to presne ten
          // typ drobnosti, na ktorej sa dôvera buď drží, alebo stráca.
          ? `<p>Pozriem sa na tvoje čísla aj na to, ${extra ? `čo si ${gg('{napisala}')}` : `kedy ti to praská`}, a odpoviem ti osobne najneskôr zajtra na <strong>${state.email}</strong>. Nemusíš nikam volať ani si vyberať termín.</p>`
          : `<p>Ozvem sa ti na <strong>${phone}</strong>${payload.preferredTime ? ` — <strong>${payload.preferredTime.toLowerCase()}</strong>` : ' čo najskôr'}. Ak by ti to nevyhovovalo, napíš mi na <a href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a>.</p>`}
      </div>`;
  } catch (e) {
    err.innerHTML = `Odoslanie sa nepodarilo. Skús to ešte raz, alebo si <a href="${CONFIG.CAL_URL}" target="_blank" rel="noopener">vyber termín v kalendári</a>.`;
    err.classList.add('show');
    btn.disabled = false;
    btn.textContent = 'Skúsiť znova';
  }
}

// ---------- ŠTART ----------
renderForm();
