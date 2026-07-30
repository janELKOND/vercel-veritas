/* ============================================================
   Pravda o chudnutí — kvízová appka (lead magnet pre Valyra)
   ============================================================ */

// ---------- KONFIGURÁCIA ----------
const CONFIG = {
  WEBHOOK_URL: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  CONTACT_EMAIL: 'karas.jan2@gmail.com',
  // Rezervácia 15-min hovoru s Jánom (Cal.com) — primárny cieľ výsledku.
  CAL_URL: 'https://cal.com/jan-karas-kdm2il/15min',
  // Valyra = nástroj počas platenej spolupráce; z výsledku už len sekundárny odkaz.
  VALYRA_URL: 'https://valyra.sk/Onboarding',
  // Pixel ad účtu. Signály o záujme o hovor musia ísť explicitne naň (trackSingle),
  // inak ich kampaň nevidí — druhý pixel je Valyra a ad účet k nemu nemá prístup.
  PIXEL_AD: '2221207801987418',
  // Ponuka hovoru. Hovor má meno a hmatateľný výstup — ľudia si rezervujú
  // výsledok, nie stretnutie („15-min hovor" je stretnutie, „Reštart plán" je výsledok).
  OFFER: {
    NAME: 'Reštart plán',
    LENGTH: '15 minút',
    // Kapacita. DRŽ TO PRAVDIVÉ — scarcity funguje len dokým je skutočná.
    // SPOTS_PER_MONTH = koľko ľudí za mesiac naozaj vezmeš (trvalý limit, mení sa zriedka).
    SPOTS_PER_MONTH: 5,
    // SPOTS_LEFT = koľko miest je voľných PRÁVE TERAZ. Zobrazí sa len ak je to číslo,
    // takže `null` znamená „počet voľných miest neuvádzaj". Vypĺňaj len vtedy, keď to
    // budeš reálne každý mesiac prepisovať — odpočet, ktorý mesiace stojí na tom istom
    // čísle, ľudia odhalia a stojí to dôveru viac, než by scarcity priniesla.
    SPOTS_LEFT: null,
  },
  UTM: {
    utm_source: 'kviz',
    utm_medium: 'referral',
    utm_campaign: 'pravda-o-chudnuti',
  },
};

// ---------- OTÁZKY ----------
// type: 'tf'  = tvrdenie Pravda/Mýtus (so stamp pečiatkou)
// type: 'mc'  = výber z možností
const QUESTIONS = [
  {
    type: 'tf',
    q: 'Ak jem po 18:00, priberám — aj keď mám denný príjem kalórií v poriadku.',
    correct: 1, // 0 = Pravda, 1 = Mýtus
    verdict: 'mytus',
    explain: 'Telo nemá večerný spínač na tuk. Rozhoduje <strong>celkový denný príjem energie</strong>, nie hodina na hodinkách. Neskoré jedenie škodí najmä preto, že večer siahame po chipsoch pri telke — nie preto, že je po šiestej.',
  },
  {
    type: 'tf',
    q: 'Keď robím cviky na brucho, spaľujem tuk práve na bruchu.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Lokálne spaľovanie („spot reduction") <strong>neexistuje</strong> — telo si berie tuk z celého tela podľa vlastného poradia, ktoré je dané geneticky. Stovky brušákov ti posilnia svaly POD tukom, ale neodkryjú ich. Brucho sa robí v kuchyni, nie na podložke.',
  },
  {
    type: 'mc',
    q: 'Koľko minút rezkej chôdze potrebuješ na spálenie jednej 100 g tabuľky mliečnej čokolády?',
    options: ['Asi 20 minút', 'Asi 45 minút', 'Asi 90 minút', 'Asi 4 hodiny'],
    correct: 2,
    explain: 'Tabuľka mliečnej čokolády má okolo <strong>530 kcal</strong>. Podľa hmotnosti a tempa môže jej výdaj predstavovať približne 75–100 minút rezkej chôdze. Pointa nie je trestať sa pohybom za jedlo, ale vedieť, že príjem energie sa zvýši oveľa rýchlejšie, než ju pohybom vydáme.',
  },
  {
    type: 'tf',
    q: 'Keď prestanem cvičiť, svaly sa mi premenia na tuk.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Sval a tuk sú <strong>dve úplne rozdielne tkanivá</strong> — jedno sa na druhé premeniť nevie, rovnako ako sa kosť nepremení na krv. Bez tréningu svaly pomaly ubúdajú a ak jedálniček ostane rovnaký, tuk pribúda. Vyzerá to ako „premena", ale sú to dva samostatné procesy.',
  },
  {
    type: 'tf',
    q: 'Čím viac sa pri cvičení potím, tým viac tuku spaľujem.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Pot je <strong>klimatizácia, nie tukomer</strong> — telo sa ním chladí. Zapotíš sa aj v saune, kde nespáliš takmer nič. Váha po spotenom tréningu klesne o vodu, ktorú prvým pohárom doplníš späť. Rozhoduje vydaná energia, nie mokré tričko.',
  },
  {
    type: 'mc',
    q: 'Čo u väčšiny ľudí spáli za deň viac energie?',
    options: ['Hodinový tréning v posilňovni', 'Bežný pohyb počas dňa (chôdza, schody, domácnosť)', 'Je to presne rovnaké', 'Ani jedno — rozhoduje len strava'],
    correct: 1,
    explain: 'Hodina tréningu je užitočná, ale <strong>bežný denný pohyb</strong> (chôdza, schody či domácnosť) sa zbiera počas celého dňa. Preto môže aktívny nešportovec vydať viac energie než človek, ktorý si zacvičí a zvyšok dňa presedí.',
  },
  {
    type: 'tf',
    q: 'Detoxikačné čaje a šťavy čistia telo od toxínov.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Detox už máš v tele zabudovaný zadarmo — volá sa <strong>pečeň a obličky</strong>. Žiadny čaj ich prácu nezrýchli. Ak po „detoxe" schudneš, je to voda a obsah čriev, nie tuk.',
  },
  {
    type: 'mc',
    q: 'Aké je reálne a udržateľné tempo chudnutia?',
    options: ['3–4 kg týždenne', '0,5–1 kg týždenne', 'Aspoň 10 kg mesačne', 'Na tempe nezáleží'],
    correct: 1,
    explain: 'Pre mnohých ľudí je <strong>0,5–1 kg týždenne</strong> rozumné orientačné tempo. Závisí však od východiskovej hmotnosti, zdravia a nastaveného deficitu. Príliš prísne režimy sa zvyčajne horšie dodržiavajú — dlhodobý výsledok stojí najmä na návykoch, ktoré zvládneš udržať.',
  },
];

// Segmentačná otázka — bez bodov, bez správnej odpovede
const SEGMENT_Q = {
  q: 'Čo ťa pri chudnutí brzdí najviac?',
  options: [
    { label: 'Neviem, čo a koľko mám jesť', value: 'co-jest' },
    { label: 'Cez deň sa držím, večer prídu chute', value: 'vecerne-chute' },
    { label: 'Vždy začnem, ale po pár dňoch prestanem', value: 'nevydrzim' },
    { label: 'Nemám čas plánovať jedlo a variť', value: 'nemam-cas' },
    { label: 'Viem, čo mám robiť, ale potrebujem podporu', value: 'potrebujem-podporu' },
  ],
};

// Nahradzuje pôvodnú otázku „Nakoľko vážne to teraz myslíš?". Tá bola sebadeklarácia —
// vážne to myslí každý, kto dokliká kvíz, takže signál bol takmer nulový. História
// návratov je SPRÁVANIE: kto priznal opakované návraty, ten už dokázal, že samoobsluha
// mu nestačí. Zároveň je to druhé číslo (vedľa skóre), z ktorého sa skladá diagnóza.
// Text je bez rodových prípon — pohlavie sa vyberá až vo formulári na konci.
const HISTORY_Q = {
  q: 'Koľkokrát sa ti už zhodené kilá vrátili?',
  options: [
    { label: 'Ešte nikdy — toto by bol môj prvý poriadny pokus', value: 'prvykrat' },
    { label: 'Raz alebo dvakrát', value: 'raz-dva' },
    { label: 'Trikrát a viac — vždy sa to vrátilo', value: 'viackrat' },
    { label: 'Váha ide stále dokola, hore-dole', value: 'jojo' },
  ],
};

const READINESS_Q = {
  q: 'Ako to chceš tentokrát dotiahnuť?',
  options: [
    { label: 'Chcem, aby ma niekto viedol a bol pri tom so mnou', value: 'podpora' },
    { label: 'Stačí mi jasný plán a systém — zvyšok zvládnem sám/sama', value: 'plan' },
    { label: 'Zatiaľ si chcem len doplniť informácie', value: 'informacie' },
  ],
};

const SEGMENT_RESULTS = {
  'co-jest': 'Tvoja hlavná brzda nie je vôľa, ale každodenné rozhodovanie. Pomôže ti mať dopredu pripravený konkrétny plán jedál a porcií, aby si nemusel/a zakaždým hádať, čo je správne.',
  'vecerne-chute': 'Večerné chute často začínajú už cez deň — príliš malým jedlom, chýbajúcimi bielkovinami alebo dlhými pauzami. Potrebuješ plán, ktorý ťa zasýti a počíta aj s večerom.',
  'nevydrzim': 'Nepotrebuješ ďalší prísny štart. Potrebuješ systém, ktorý funguje aj počas slabšieho dňa a po zaváhaní ťa vráti späť bez pocitu, že začínaš od nuly.',
  'nemam-cas': 'Tvoj plán musí rešpektovať reálny život. Jednoduché jedlá, bežné suroviny a rozhodnutia urobené vopred ti pomôžu pokračovať aj počas pracovného alebo rodinného chaosu.',
  'potrebujem-podporu': 'Vedomosti už pravdepodobne máš. Rozdiel spraví pravidelná spätná väzba a človek, ktorému môžeš napísať práve vtedy, keď motivácia klesne.',
};

// Čo konkrétne sa na hovore vyrieši — podľa brzdy, ktorú človek sám označil v kvíze.
// Personalizácia prvého bodu ponuky je najlacnejší spôsob, ako hovor prestane znieť všeobecne.
// Texty sú zámerne bez rodových prípon, aby fungovali pre ženy aj mužov.
const SEGMENT_CALL_PROMISE = {
  'co-jest': 'ukážem ti, čo a koľko jesť — bez hádania pri každom jedle',
  'vecerne-chute': 'nájdeme, čím ti večerné chute začínajú už cez deň, a čo s tým',
  'nevydrzim': 'postavíme to tak, aby ťa jeden slabší deň nezhodil na začiatok',
  'nemam-cas': 'zmestíme to do tvojho dňa — bez varenia navyše a hodín v posilňovni',
  'potrebujem-podporu': 'vieš už, čo robiť — povieme si, ako to udržať, keď motivácia klesne',
};

// Mikro-veta pod tlačidlom, napojená na jeho vlastnú históriu. Urgencia z faktu,
// ktorý sám priznal, je vierohodnejšia než akýkoľvek odpočet alebo výzva k akcii.
const HISTORY_NUDGE = {
  'prvykrat': 'Začni rovno správne — druhý pokus je vždy ťažší ako prvý.',
  'raz-dva': '',
  'viackrat': 'Nech toto nie je ďalší pokus v tom istom kruhu.',
  'jojo': 'Ten kruh sa dá prerušiť — ale nie tým istým spôsobom ako doteraz.',
};

// Ako o histórii hovoríme v diagnóze. Formulácie sú vecné, nie vyčítavé —
// človek nám práve priznal svoju najcitlivejšiu vec, tak ju nepoužijeme proti nemu.
const HISTORY_CLAUSE = {
  'prvykrat': null,
  'raz-dva': 'kilá sa ti už raz-dvakrát vrátili',
  'viackrat': 'kilá sa ti vrátili trikrát a viac',
  'jojo': 'váha ti ide stále dokola',
};

// Vyhodnotenie podľa pásma skóre
const BANDS = [
  {
    min: 0, max: 2,
    name: { zena: 'Mýty ťa vodia za nos', muz: 'Mýty ťa vodia za nos' },
    slug: 'zaciatocnicka',
    text: {
      zena: 'A nie je to tvoja chyba — protichodné rady počúvaš zo všetkých strán. Dobrá správa? Práve si si ujasnila niekoľko dôležitých základov. Samotné informácie však ešte nikoho neschudli — rozhoduje, čo s nimi urobíš zajtra.',
      muz: 'A nie je to tvoja chyba — protichodné rady počúvaš zo všetkých strán. Dobrá správa? Práve si si ujasnil niekoľko dôležitých základov. Samotné informácie však ešte nikoho neschudli — rozhoduje, čo s nimi urobíš zajtra.',
    },
  },
  {
    min: 3, max: 5,
    name: { zena: 'Bojovníčka s polovičnou mapou', muz: 'Bojovník s polovičnou mapou' },
    slug: 'pokrocila',
    text: {
      zena: 'Základ máš — ale <strong>pár mýtov ťa stále brzdí</strong>. A presne tie bývajú dôvod, prečo výsledky prichádzajú pomalšie, než by mali, alebo sa po čase zastavia. Keď doplníš medzery a pridáš systém, telo zareaguje.',
      muz: 'Základ máš — ale <strong>pár mýtov ťa stále brzdí</strong>. A presne tie bývajú dôvod, prečo výsledky prichádzajú pomalšie, než by mali, alebo sa po čase zastavia. Keď doplníš medzery a pridáš systém, telo zareaguje.',
    },
  },
  {
    min: 6, max: 8,
    name: { zena: 'Teóriu máš v malíčku', muz: 'Teóriu máš v malíčku' },
    slug: 'expertka',
    text: {
      zena: 'Vieš, ako to funguje — takže ďalší článok o chudnutí ti už nič nepridá. Rozdiel spraví <strong>systém, dôslednosť a podpora</strong>. Presne tam sa láme hranica medzi „viem, čo mám robiť" a „naozaj to robím".',
      muz: 'Vieš, ako to funguje — takže ďalší článok o chudnutí ti už nič nepridá. Rozdiel spraví <strong>systém, dôslednosť a podpora</strong>. Presne tam sa láme hranica medzi „viem, čo mám robiť" a „naozaj to robím".',
    },
  },
];

// ---------- STAV ----------
const state = {
  index: 0,
  score: 0,
  answers: [],   // { q, chosen, correct }
  segment: null,
  history: null,
  readiness: null,
  gender: 'zena', // 'zena' | 'muz'
  quizStarted: false,
  gateTracked: false,
};

const app = document.getElementById('app');
const progressTrack = document.getElementById('progressTrack');
const progressFill = document.getElementById('progressFill');

const TOTAL_STEPS = QUESTIONS.length + 3; // + segment, termín a pripravenosť

// ---------- OBRAZOVKY ----------
function showIntro() {
  progressTrack.hidden = true;
  app.innerHTML = `
    <section class="intro">
      <div class="eyebrow">Kvíz · 8 otázok o mýtoch + 3 krátke o tebe · asi 5 minút</div>
      <h1>Pravda o chudnutí: si v obraze, alebo veríš <span class="flip">mýtom?</span></h1>
      <p class="lead">Po každej odpovedi sa hneď dozvieš, ako to je naozaj — takže z kvízu odchádzaš s novými vedomosťami, nech dopadneš akokoľvek.</p>
      <div class="intro-facts">
        <span>🧠 Overené fakty, žiadne poučky</span>
        <span>📊 Osobné vyhodnotenie</span>
        <span>🎯 3 tipy k tvojmu výsledku</span>
      </div>
      <button class="btn" id="startBtn">Poďme na to</button>
      <p class="intro-note">Na konci ťa poprosím o e-mail — pošlem ti naň vyhodnotenie a 3 tipy. Skóre a výsledok uvidíš hneď po zadaní adresy.</p>
      <p class="footnote">Vytvoril Ján — tréner a výživový poradca, ktorý sám schudol 45 kg a drží si to už 8 rokov.</p>
    </section>
  `;
  document.getElementById('startBtn').addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('trackCustom', 'QuizStart');
    state.quizStarted = true;
    // Rovno do prvej otázky — pohlavie sa vyberá až vo formulári na konci
    // (menej trenia po kliku z reklamy, prvá otázka je najsilnejší hook).
    showQuestion();
  });
}

function updateProgress(step) {
  progressTrack.hidden = false;
  progressFill.style.width = `${Math.round((step / TOTAL_STEPS) * 100)}%`;
}

function showQuestion() {
  const i = state.index;
  const item = QUESTIONS[i];
  updateProgress(i);

  const opts = item.type === 'tf' ? ['Pravda', 'Mýtus'] : item.options;

  app.innerHTML = `
    <section class="question-screen">
      <div class="step-label">Otázka ${i + 1} z ${QUESTIONS.length}</div>
      <h2>${item.q}</h2>
      <div class="options" id="options">
        ${opts.map((o, idx) => `<button class="option" data-idx="${idx}">${o}</button>`).join('')}
      </div>
      <div id="revealSlot"></div>
    </section>
  `;

  document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => answer(parseInt(btn.dataset.idx, 10)));
  });
}

function answer(chosenIdx) {
  const item = QUESTIONS[state.index];
  const isCorrect = chosenIdx === item.correct;
  state.answers.push({ q: item.q, correct: isCorrect });
  // Skóre vždy odvodíme zo zaznamenaných odpovedí, aby sa nemohlo rozísť s výsledkom.
  state.score = state.answers.filter(a => a.correct).length;

  // zamkni možnosti a vyfarbi
  document.querySelectorAll('.option').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === item.correct) btn.classList.add('correct');
    else if (idx === chosenIdx) btn.classList.add('wrong');
    else btn.classList.add('dim');
  });

  // edukačný panel s pečiatkou
  const stamp = item.type === 'tf'
    ? `<div class="stamp ${item.verdict}">${item.verdict === 'mytus' ? 'Mýtus' : 'Pravda'}</div>`
    : '';

  const verdictLine = isCorrect
    ? '<div class="verdict ok">✓ Presne tak!</div>'
    : '<div class="verdict miss">Tentoraz nie — ale teraz to už vieš:</div>';

  document.getElementById('revealSlot').innerHTML = `
    <div class="reveal">
      ${stamp}
      ${verdictLine}
      <p>${item.explain}</p>
      <div class="btn-row">
        <button class="btn" id="nextBtn">${state.index < QUESTIONS.length - 1 ? 'Ďalšia otázka' : 'Pokračovať'}</button>
      </div>
    </div>
  `;

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
  nextBtn.addEventListener('click', () => {
    state.index++;
    if (state.index < QUESTIONS.length) showQuestion();
    else showSegment();
  });
}

function showSegment() {
  updateProgress(QUESTIONS.length);
  app.innerHTML = `
    <section class="question-screen">
      <div class="step-label">Ešte 3 krátke otázky — nebodované</div>
      <h2>${SEGMENT_Q.q}</h2>
      <p class="step-note">Podľa nich ti na konci odporučím ďalší krok. Na skóre nemajú vplyv.</p>
      <div class="options">
        ${SEGMENT_Q.options.map((o, idx) => `<button class="option" data-idx="${idx}">${o.label}</button>`).join('')}
      </div>
    </section>
  `;
  document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.segment = SEGMENT_Q.options[parseInt(btn.dataset.idx, 10)].value;
      showHistory();
    });
  });
}

function showHistory() {
  updateProgress(QUESTIONS.length + 1);
  app.innerHTML = `
    <section class="question-screen">
      <div class="step-label">Ešte 2 krátke otázky — bez bodovania</div>
      <h2>${HISTORY_Q.q}</h2>
      <p class="step-note">Toto je pre vyhodnotenie najdôležitejšia odpoveď — bez nej sa nedá povedať, či ti chýbajú informácie, alebo niečo úplne iné.</p>
      <div class="options">
        ${HISTORY_Q.options.map((o, idx) => `<button class="option" data-idx="${idx}">${o.label}</button>`).join('')}
      </div>
    </section>
  `;
  document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.history = HISTORY_Q.options[parseInt(btn.dataset.idx, 10)].value;
      showReadiness();
    });
  });
}

function showReadiness() {
  updateProgress(QUESTIONS.length + 2);
  app.innerHTML = `
    <section class="question-screen">
      <div class="step-label">Posledná otázka — bez bodovania</div>
      <h2>${READINESS_Q.q}</h2>
      <p class="step-note">Podľa toho ti odporučím buď samostatný plán, alebo vedenie so mnou.</p>
      <div class="options">
        ${READINESS_Q.options.map((o, idx) => `<button class="option" data-idx="${idx}">${o.label}</button>`).join('')}
      </div>
    </section>
  `;
  document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.readiness = READINESS_Q.options[parseInt(btn.dataset.idx, 10)].value;
      showGate();
    });
  });
}

function showGate() {
  updateProgress(TOTAL_STEPS);
  if (!state.gateTracked && typeof fbq === 'function') {
    fbq('trackCustom', 'QuizComplete', {
      score: state.score,
      segment: state.segment,
      history: state.history,
      readiness: state.readiness,
    });
    state.gateTracked = true;
  }
  app.innerHTML = `
    <section class="gate">
      <div class="step-label">Hotovo ✓ Tvoje vyhodnotenie je pripravené</div>
      <h2>Kam ti mám poslať výsledok + 3 praktické tipy?</h2>
      <p class="sub">Skóre uvidíš hneď. Do e-mailu ti pošlem vyhodnotenie a tipy, ktoré nadväzujú na tvoj výsledok.</p>
      <div class="field">
        <label>Píšem ti ako…</label>
        <div class="gender-row" id="genderRow">
          <button type="button" class="gender-pill${state.gender === 'zena' ? ' active' : ''}" data-g="zena">Žena</button>
          <button type="button" class="gender-pill${state.gender === 'muz' ? ' active' : ''}" data-g="muz">Muž</button>
        </div>
      </div>
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
        <span>Súhlasím so spracovaním údajov na zaslanie vyhodnotenia a tipov k zdravému chudnutiu a s občasnými informáciami o mojich službách a spolupráci. Odhlásiť sa dá kedykoľvek jedným klikom.</span>
      </label>
      <div class="error-msg" id="errMsg"></div>
      <button class="btn" id="submitBtn">Získať moje osobné vyhodnotenie</button>
    </section>
  `;

  document.getElementById('submitBtn').addEventListener('click', submitLead);

  document.querySelectorAll('.gender-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.gender = btn.dataset.g;
      document.querySelectorAll('.gender-pill').forEach(b => b.classList.toggle('active', b === btn));
      document.getElementById('name').placeholder = state.gender === 'muz' ? 'Napr. Peter' : 'Napr. Zuzana';
    });
  });
}

async function submitLead() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const gdpr = document.getElementById('gdpr').checked;
  const err = document.getElementById('errMsg');
  const submitBtn = document.getElementById('submitBtn');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!name || !emailOk || !gdpr) {
    err.textContent = !name ? 'Doplň, prosím, meno.'
      : !emailOk ? 'Skontroluj, prosím, e-mail — nevyzerá kompletný.'
      : 'Bez súhlasu ti vyhodnotenie nemôžem poslať.';
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Odosielam vyhodnotenie…';

  const correctCount = state.answers.filter(a => a.correct).length;
  const wrongAnswers = state.answers.filter(a => !a.correct);
  const band = bandFor(correctCount);
  const payload = {
    name,
    email,
    score: correctCount,
    maxScore: QUESTIONS.length,
    band: band.slug,
    bandName: band.name[state.gender],
    gender: state.gender,
    // Kvalifikáciu ukladáme aj do existujúceho segmentu, takže je okamžite
    // viditeľná v Supabase, Google Sheete aj admin e-maile bez zmeny backendu.
    // POZOR: prostredný diel je od v3 história návratov, predtým tam bola urgencia.
    // Staré a nové riadky sa preto nesmú porovnávať naslepo — rozlišuje ich quizVersion.
    segment: [state.segment, state.history, state.readiness].filter(Boolean).join('|'),
    baseSegment: state.segment,
    history: state.history,
    readiness: state.readiness,
    wrong: wrongAnswers.map(a => a.q),
    ts: new Date().toISOString(),
    source: 'pravda-o-chudnuti',
    // v1 = len segment · v2 = segment|urgencia|pripravenost · v3 = segment|historia|pripravenost
    quizVersion: 3,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Lead API: ${response.status}`);

    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration', {
        value: 5.00,
        currency: 'EUR',
        segment: state.segment,
        history: state.history,
        readiness: state.readiness,
      });
    }
    showResult(name);
  } catch (error) {
    err.textContent = 'Vyhodnotenie sa nepodarilo odoslať. Skontroluj pripojenie a skús to ešte raz.';
    err.classList.add('show');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Skúsiť odoslať znova';
  }
}

function bandFor(score) {
  return BANDS.find(b => score >= b.min && score <= b.max);
}

// Jadro kvízu. Samotné skóre je UZAVRETIE („poučil som sa, hotovo") a uspokojený človek
// nemá dôvod nič meniť. Diagnóza namiesto toho postaví vedľa seba dve čísla, ktoré človek
// sám dal — čo VIE a čo DOSIAHOL — a nechá hovoriť rozdiel medzi nimi.
// Nič sa nedomýšľa ani nepodsúva: obe hodnoty sú jeho vlastné odpovede.
function gapDiagnosis(score, max, history) {
  const knows = score >= 6;                 // horné pásmo = vedomosti nie sú brzda
  const clause = HISTORY_CLAUSE[history];   // null = ešte to poriadne neskúšal
  const missed = max - score;

  if (clause && knows) {
    return {
      title: 'Vieš to — a aj tak sa to vracia',
      text: `Máš <strong>${score} z ${max}</strong> správne a ${clause}. To nie je nedostatok informácií — tie preukázateľne máš. Toto je presne rozdiel medzi <strong>vedieť</strong> a <strong>robiť</strong>, a ten sa sám od seba nezatvorí.`,
    };
  }
  if (clause && !knows) {
    return {
      title: 'Časť odpovede je v tých mýtoch',
      text: `Máš <strong>${score} z ${max}</strong> a ${clause}. Časť dôvodu môže byť práve v tých ${missed} otázkach, ktoré ťa prekvapili — a časť v tom, že v tom nikto nebol s tebou.`,
    };
  }
  if (knows) {
    return {
      title: 'Teória nie je tvoja brzda',
      text: `Máš <strong>${score} z ${max}</strong> správne. Vedomosti teda máš — jediná otázka je, či to, čo vieš, aj naozaj denne robíš. Presne tam sa láme väčšina pokusov.`,
    };
  }
  return {
    title: 'Začínaš so správnymi informáciami',
    text: `Máš <strong>${score} z ${max}</strong>. ${missed} vecí ťa prekvapilo — a to je dobrá správa: teraz ich už vieš, takže ťa nebudú brzdiť tak, ako brzdia väčšinu ľudí.`,
  };
}

// Slovenské skloňovanie miest: 1 miesto · 2–4 miesta · 5 a viac miest.
function spotsPhrase(n) {
  if (n === 1) return 'je voľné posledné miesto';
  if (n < 5) return `sú voľné ${n} miesta`;
  return `je voľných ${n} miest`;
}

// Štandardné eventy Meta pixela (majú vlastné `trackSingle`); všetko ostatné je vlastný
// event a musí ísť cez `trackSingleCustom`, inak ho pixel zahodí.
const FB_STANDARD_EVENTS = ['Lead', 'CompleteRegistration', 'Contact', 'Schedule', 'ViewContent', 'PageView'];

// Event explicitne na pixel ad účtu. Stránka inicializuje dva pixely a ad účet
// k druhému (Valyra) nemá prístup — bez adresného odoslania sa signál v Ads Manageri stratí.
// CompleteRegistration zámerne necháme na `track`: kampaň na ňom má learning history.
function trackAd(event, params) {
  if (typeof fbq !== 'function') return;
  const method = FB_STANDARD_EVENTS.includes(event) ? 'trackSingle' : 'trackSingleCustom';
  fbq(method, CONFIG.PIXEL_AD, event, params);
}

function showResult(name) {
  progressTrack.hidden = true;
  const correctCount = state.answers.filter(a => a.correct).length;
  const missed = state.answers.filter(a => !a.correct);
  const wrongCount = missed.length;
  const band = bandFor(correctCount);

  const segmentResult = SEGMENT_RESULTS[state.segment] || SEGMENT_RESULTS['co-jest'];

  // Výsledok vedie na HOVOR s Jánom (nie na appku). Valyra = nástroj počas platenej spolupráce.
  // ÚROVEŇ ZÁUJMU (tri pásma). Tierujeme podľa toho, čo človek chce, a podľa toho,
  // čo sa mu už reálne stalo — nie podľa toho, ako vážne to o sebe tvrdí.
  //   HOT  = chce vedenie ALEBO sa mu to opakovane vrátilo (dôkaz, že sám na to nemá systém)
  //   COLD = chce len informácie a opakované návraty nemá  → tlačidlo nenápadné
  //   WARM = zvyšok (chce plán)                            → hovor tiež primárne
  const wantsGuidance = state.readiness === 'podpora';
  const repeatedRelapse = state.history === 'viackrat' || state.history === 'jojo';
  const hot = wantsGuidance || repeatedRelapse;
  const cold = !hot && state.readiness === 'informacie';
  const tier = hot ? 'hot' : (cold ? 'cold' : 'warm');

  // Kto výslovne povedal, že si chce len dopĺňať informácie, nedostane nátlakové prvky
  // (voľné miesta, výzva k akcii) — a to ani vtedy, keď ho história zaradí do HOT.
  // Ponuku a diagnózu vidí v plnej sile; potlačí sa len tlak. Vyslovené prianie
  // preváži nad tým, čo si o jeho potrebe myslíme my.
  const noPressure = cold || state.readiness === 'informacie';

  const diagnosis = gapDiagnosis(correctCount, QUESTIONS.length, state.history);

  const offer = CONFIG.OFFER;

  let nextStep;
  if (wantsGuidance) {
    nextStep = `Nechceš na to byť sám/sama — a to je najrozumnejšie rozhodnutie. Za ${offer.LENGTH} spolu pomenujeme tvoju hlavnú brzdu a odídeš s prvým konkrétnym krokom.`;
  } else if (repeatedRelapse) {
    nextStep = `Skúšala si to už viackrát a vrátilo sa to. To nie je o vôli — ďalší pokus tým istým spôsobom skončí rovnako. Za ${offer.LENGTH} si povieme, čo treba spraviť inak.`;
  } else if (cold) {
    nextStep = 'Pokojne si to nechaj uležať. Vyhodnotenie a tipy ti chodia na e-mail — a keď budeš chcieť ísť do toho naozaj, termín si vyberieš kedykoľvek.';
  } else {
    nextStep = `Máš k tomu vážny vzťah, len ti chýba jasný plán. Za ${offer.LENGTH} si prejdeme, ako má vyzerať a čím začať, aby sadol tvojmu reálnemu životu.`;
  }

  // Prvý bod ponuky hovorí o TEJ brzde, ktorú človek sám označil — nie o chudnutí vo všeobecnosti.
  const callPromise = SEGMENT_CALL_PROMISE[state.segment] || SEGMENT_CALL_PROMISE['co-jest'];

  // Scarcity je pravdivá (sólo kouč = reálne limitované miesta), preto ju ukazujeme.
  // Zvedavcom ju nepodsúvame — na nerozhodnutého tlak nepatrí, tých drží e-mailová séria.
  // Mesačná kapacita je trvalý fakt, počet voľných miest sa mení. Preto sa kapacita
  // zobrazuje vždy a odpočet miest len vtedy, keď je SPOTS_LEFT reálne udržiavané číslo —
  // nepravdivý odpočet je horší než žiadny.
  const spotsLeftSentence = (typeof offer.SPOTS_LEFT === 'number' && offer.SPOTS_LEFT > 0)
    ? ` Tento mesiac ${spotsPhrase(offer.SPOTS_LEFT)}.`
    : '';
  const spotsHtml = (!noPressure && offer.SPOTS_PER_MONTH)
    ? `<p class="offer-scarcity">Beriem maximálne <strong>${offer.SPOTS_PER_MONTH} nových ľudí mesačne</strong>, lebo pri každom som osobne.${spotsLeftSentence}</p>`
    : '';

  const offerCardHtml = `
      <div class="offer" id="offerCard">
        <div class="offer-eyebrow">Tvoj ďalší krok</div>
        <h3 class="offer-title">${offer.NAME}</h3>
        <div class="offer-meta">${offer.LENGTH} po telefóne · zadarmo · bez karty</div>
        <p class="offer-lead">S čím z toho hovoru odídeš:</p>
        <div class="offer-stack">
          <div>✓ <strong>Tvoju hlavnú brzdu pomenovanú nahlas</strong> — ${callPromise}.</div>
          <div>✓ <strong>Prvý konkrétny krok</strong> — jedna vec, ktorou začneš najbližší týždeň, nastavená na tvoj bežný deň. Ten krok je tvoj, aj keby sme spolu viac nehovorili.</div>
          <div>✓ <strong>Jasno v tom, čo ďalej</strong> — ak budeš chcieť, aby som ťa viedol, poviem ti presne ako to vyzerá. Ak nie, rozlúčime sa v pohode.</div>
        </div>
        <p class="offer-guarantee"><strong>Ako pracujem:</strong> keď sa do toho spolu pustíme, ostávam s tebou, kým sa to nepohne. Neplatíš za počet stretnutí, ale za to, že to konečne zaberie.</p>
        ${spotsHtml}
      </div>`;

  const bookBtnHtml = `<a class="btn${cold ? ' secondary' : ''}" id="consultBtn" href="${CONFIG.CAL_URL}" target="_blank" rel="noopener">${cold ? `Pozrieť voľné termíny (${offer.LENGTH})` : `📞 Chcem svoj ${offer.NAME}`}</a>`;
  const nudge = HISTORY_NUDGE[state.history];
  const nudgeHtml = (!noPressure && nudge) ? `<p class="cta-urgency">${nudge}</p>` : '';
  const valyraNoteHtml = `<p class="valyra-note">Valyra nie je appka na stiahnutie zadarmo — je to nástroj, cez ktorý ťa vediem. Ak si na hovore povieme, že ti moje vedenie pomôže, dostaneš ju ako súčasť spolupráce: svoj plán, úlohy, výsledky a kontakt so mnou.</p>`;
  const ctaButtons = `${offerCardHtml}\n      ${bookBtnHtml}\n      ${nudgeHtml}\n      ${valyraNoteHtml}`;
  const qualificationResult = nextStep;

  const recapHtml = missed.length
    ? `
      <div class="recap">
        <h3>Kde ťa mýty dobehli</h3>
        ${missed.slice(0, 3).map(m => `<div class="recap-item"><strong>${m.q}</strong>Správnu odpoveď už poznáš — máš ju aj v e-maili.</div>`).join('')}
      </div>`
    : `
      <div class="recap">
        <h3>Bez jedinej chyby</h3>
        <div class="recap-item"><strong>Plný počet bodov.</strong> Vedomosti nie sú tvoja brzda — teraz je čas premeniť ich na výsledky.</div>
      </div>`;

  app.innerHTML = `
    <section class="result">
      <div class="score-hero">
        <div class="score-num">${correctCount}<small> / ${QUESTIONS.length}</small></div>
        <div class="score-breakdown">
          <span>✓ Správne: <strong>${correctCount}</strong></span>
          <span>✕ Nesprávne: <strong>${wrongCount}</strong></span>
        </div>
        <div class="typology">${band.name[state.gender]}</div>
      </div>
      <div class="diagnosis">
        <div class="diagnosis-label">Diagnóza</div>
        <h3>${diagnosis.title}</h3>
        <p>${diagnosis.text}</p>
      </div>
      <p class="verdict-text">${name}, ${band.text[state.gender]}</p>
      <div class="personal-insight"><strong>Čo z toho pre teba vyplýva</strong>${segmentResult}</div>
      <div class="personal-insight"><strong>Tvoj najlepší ďalší krok</strong>${qualificationResult}</div>
      <p class="email-note">📬 Podrobné vyhodnotenie + 3 praktické tipy ti práve odišli na e-mail. Ak neprídu do pár minút, pozri si priečinok Hromadné/Spam.</p>
      ${recapHtml}
      <div class="coach-card">
        <p><strong>Ja som Ján.</strong> Sám som schudol 45 kg — z 133 na 88 — a držím si to už <strong>8 rokov</strong>. Nie mesiac po diéte, osem rokov. Presne preto viem, že nerozhodujú zázračné diéty, ale systém a podpora.</p>
        <p class="coach-proof">Schudnúť dokáže hladom skoro každý. Udržať si to je tá časť, na ktorej to ľuďom padá — a to je presne to, čo ťa učím.</p>
      </div>
      ${ctaButtons}
      <p class="retry-line"><button class="link-btn" id="againBtn">Skúsiť kvíz znova</button></p>
      <p class="social-line"><a href="https://www.instagram.com/janykaras" target="_blank" rel="noopener" id="igLink">Sledovať Jána na Instagrame</a></p>
    </section>
  `;

  const consultMeta = {
    segment: state.segment, band: band.slug, history: state.history, readiness: state.readiness, tier,
  };

  // Zobrazenie ponuky meriame zvlášť od kliku — inak sa nedá zistiť, či ponuku ľudia
  // odmietajú, alebo sa k nej vôbec nedostanú. Pomer ConsultView → ConsultClick
  // je jediné číslo, ktoré povie, či copy ponuky funguje.
  trackAd('ConsultView', consultMeta);

  const consultBtn = document.getElementById('consultBtn');
  // Odkaz smeruje priamo na Cal.com (rezervácia hovoru). Klik = signál záujmu o hovor.
  // POZOR: klik nie je rezervácia. Skutočnú rezerváciu treba páliť z Cal.com webhooku
  // ako event `Lead` — bez toho sa počet reálnych hovorov z reklamy nedá vyhodnotiť.
  consultBtn.addEventListener('click', () => trackAd('ConsultClick', consultMeta));

  document.getElementById('igLink').addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('trackCustom', 'InstagramClick');
  });

  document.getElementById('againBtn').addEventListener('click', () => {
    state.index = 0; state.score = 0; state.answers = []; state.segment = null;
    state.history = null; state.readiness = null; state.gateTracked = false;
    showIntro();
    window.scrollTo(0, 0);
  });
}

// ---------- SERVICE WORKER ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}

// ---------- ŠTART ----------
showIntro();
