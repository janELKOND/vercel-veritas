/* ============================================================
   Pravda o chudnutí — kvízová appka (lead magnet pre Valyra)
   ============================================================ */

// ---------- KONFIGURÁCIA ----------
const CONFIG = {
  WEBHOOK_URL: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  CONTACT_EMAIL: 'karas.jan2@gmail.com',
  // Človek už na výsledku klikol na vyskúšanie produktu, preto ide priamo do onboardingu.
  VALYRA_URL: 'https://valyra.sk/Onboarding',
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
  q: 'A posledná otázka — čo ťa dnes pri chudnutí brzdí najviac?',
  options: [
    { label: 'Neviem, čo a koľko mám jesť', value: 'co-jest' },
    { label: 'Cez deň sa držím, večer prídu chute', value: 'vecerne-chute' },
    { label: 'Vždy začnem, ale po pár dňoch prestanem', value: 'nevydrzim' },
    { label: 'Nemám čas plánovať jedlo a variť', value: 'nemam-cas' },
    { label: 'Viem, čo mám robiť, ale potrebujem podporu', value: 'potrebujem-podporu' },
  ],
};

const SEGMENT_RESULTS = {
  'co-jest': 'Tvoja hlavná brzda nie je vôľa, ale každodenné rozhodovanie. Pomôže ti mať dopredu pripravený konkrétny plán jedál a porcií, aby si nemusel/a zakaždým hádať, čo je správne.',
  'vecerne-chute': 'Večerné chute často začínajú už cez deň — príliš malým jedlom, chýbajúcimi bielkovinami alebo dlhými pauzami. Potrebuješ plán, ktorý ťa zasýti a počíta aj s večerom.',
  'nevydrzim': 'Nepotrebuješ ďalší prísny štart. Potrebuješ systém, ktorý funguje aj počas slabšieho dňa a po zaváhaní ťa vráti späť bez pocitu, že začínaš od nuly.',
  'nemam-cas': 'Tvoj plán musí rešpektovať reálny život. Jednoduché jedlá, bežné suroviny a rozhodnutia urobené vopred ti pomôžu pokračovať aj počas pracovného alebo rodinného chaosu.',
  'potrebujem-podporu': 'Vedomosti už pravdepodobne máš. Rozdiel spraví pravidelná spätná väzba a človek, ktorému môžeš napísať práve vtedy, keď motivácia klesne.',
};

// Vyhodnotenie podľa pásma skóre
const BANDS = [
  {
    min: 0, max: 2,
    name: { zena: 'Mýty ťa vodia za nos', muz: 'Mýty ťa vodia za nos' },
    slug: 'zaciatocnicka',
    text: {
      zena: 'A nie je to tvoja chyba — protichodné rady počúvaš zo všetkých strán. Dobrá správa? Práve si si ujasnila niekoľko dôležitých základov. S dobrými informáciami a podporou sa rozhoduje jednoduchšie.',
      muz: 'A nie je to tvoja chyba — protichodné rady počúvaš zo všetkých strán. Dobrá správa? Práve si si ujasnil niekoľko dôležitých základov. S dobrými informáciami a podporou sa rozhoduje jednoduchšie.',
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
      zena: 'Vieš, ako to funguje — a ak výsledky napriek tomu neprichádzajú, problém nie je vo vedomostiach. Je v <strong>systéme, dôslednosti a podpore</strong>. Presne tam sa láme rozdiel medzi „viem, čo mám robiť" a „naozaj to robím".',
      muz: 'Vieš, ako to funguje — a ak výsledky napriek tomu neprichádzajú, problém nie je vo vedomostiach. Je v <strong>systéme, dôslednosti a podpore</strong>. Presne tam sa láme rozdiel medzi „viem, čo mám robiť" a „naozaj to robím".',
    },
  },
];

// ---------- STAV ----------
const state = {
  index: 0,
  score: 0,
  answers: [],   // { q, chosen, correct }
  segment: null,
  gender: 'zena', // 'zena' | 'muz'
  quizStarted: false,
  gateTracked: false,
};

const app = document.getElementById('app');
const progressTrack = document.getElementById('progressTrack');
const progressFill = document.getElementById('progressFill');

const TOTAL_STEPS = QUESTIONS.length + 1; // + segmentačná

// ---------- OBRAZOVKY ----------
function showIntro() {
  progressTrack.hidden = true;
  app.innerHTML = `
    <section class="intro">
      <div class="eyebrow">Kvíz · 8 otázok · približne 3 minúty</div>
      <h1>Pravda o chudnutí: si v obraze, alebo veríš <span class="flip">mýtom?</span></h1>
      <p class="lead">Po každej odpovedi sa hneď dozvieš, ako to je naozaj — takže z kvízu odchádzaš s novými vedomosťami, nech dopadneš akokoľvek.</p>
      <div class="intro-facts">
        <span>🧠 Overené fakty, žiadne poučky</span>
        <span>📊 Osobné vyhodnotenie</span>
        <span>🎯 3 tipy k tvojmu výsledku</span>
      </div>
      <button class="btn" id="startBtn">Poďme na to</button>
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
  if (isCorrect) state.score++;

  state.answers.push({ q: item.q, correct: isCorrect });

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
      <div class="step-label">Posledná otázka — táto sa neboduje</div>
      <h2>${SEGMENT_Q.q}</h2>
      <div class="options">
        ${SEGMENT_Q.options.map((o, idx) => `<button class="option" data-idx="${idx}">${o.label}</button>`).join('')}
      </div>
    </section>
  `;
  document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.segment = SEGMENT_Q.options[parseInt(btn.dataset.idx, 10)].value;
      showGate();
    });
  });
}

function showGate() {
  updateProgress(TOTAL_STEPS);
  if (!state.gateTracked && typeof fbq === 'function') {
    fbq('trackCustom', 'QuizComplete', { score: state.score, segment: state.segment });
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
        <span>Súhlasím so spracovaním údajov na zaslanie vyhodnotenia a tipov k zdravému chudnutiu. Odhlásiť sa dá kedykoľvek jedným klikom.</span>
      </label>
      <div class="error-msg" id="errMsg"></div>
      <button class="btn" id="submitBtn">Zobraziť moje skóre</button>
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

  const band = bandFor(state.score);
  const payload = {
    name,
    email,
    score: state.score,
    maxScore: QUESTIONS.length,
    band: band.slug,
    bandName: band.name[state.gender],
    gender: state.gender,
    segment: state.segment,
    wrong: state.answers.filter(a => !a.correct).map(a => a.q),
    ts: new Date().toISOString(),
    source: 'pravda-o-chudnuti',
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
      fbq('track', 'CompleteRegistration', { value: 5.00, currency: 'EUR' });
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

function showResult(name) {
  progressTrack.hidden = true;
  const band = bandFor(state.score);
  const missed = state.answers.filter(a => !a.correct);

  const params = new URLSearchParams({
    ...CONFIG.UTM,
    utm_content: state.segment || 'neznamy',
    utm_term: band.slug,
  });
  const valyraLink = `${CONFIG.VALYRA_URL}?${params.toString()}`;
  const segmentResult = SEGMENT_RESULTS[state.segment] || SEGMENT_RESULTS['co-jest'];

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
        <div class="score-num">${state.score}<small> / ${QUESTIONS.length}</small></div>
        <div class="typology">${band.name[state.gender]}</div>
      </div>
      <p class="verdict-text">${name}, ${band.text[state.gender]}</p>
      <div class="personal-insight"><strong>Čo z toho pre teba vyplýva</strong>${segmentResult}</div>
      <p class="email-note">📬 Podrobné vyhodnotenie + 3 praktické tipy ti práve odišli na e-mail. Ak neprídu do pár minút, pozri si priečinok Hromadné/Spam.</p>
      ${recapHtml}
      <div class="coach-card">
        <p><strong>Ja som Ján.</strong> Sám som schudol 45 kg — z 133 na 88 — a držím si to už 8 rokov. Presne preto viem, že nerozhodujú zázračné diéty, ale systém a podpora. Tú dostaneš vo Valyre.</p>
      </div>
      <div class="offer-stack">
        <div>✓ jedálniček vypočítaný na tvoje telo a cieľ — hotový za 2 minúty</div>
        <div>✓ Ján v chate — reálny kouč, nie robot</div>
        <div>✓ bez karty — po 7 dňoch sa ti nič samo nestrhne</div>
      </div>
      <button class="btn" id="ctaBtn">Zostaviť môj plán vo Valyre →</button>
      <a class="btn secondary" id="consultBtn" href="#">✉️ Chcem prebrať výsledok s Jánom</a>
      <p class="retry-line"><button class="link-btn" id="againBtn">Skúsiť kvíz znova</button></p>
      <p class="social-line"><a href="https://www.instagram.com/janykaras" target="_blank" rel="noopener" id="igLink">Sledovať Jána na Instagrame</a></p>
    </section>
  `;

  const consultBtn = document.getElementById('consultBtn');
  const mailSubject = encodeURIComponent(`Môj výsledok v kvíze: ${state.score}/${QUESTIONS.length}`);
  const mailBody = encodeURIComponent(
    state.gender === 'muz'
      ? `Ahoj Ján,\n\npráve som dokončil kvíz Pravda o chudnutí a vyšlo mi ${state.score} z ${QUESTIONS.length} (${band.name.muz}).\n\nChcel by som svoj výsledok prebrať s tebou.\n\n${name}`
      : `Ahoj Ján,\n\npráve som dokončila kvíz Pravda o chudnutí a vyšlo mi ${state.score} z ${QUESTIONS.length} (${band.name.zena}).\n\nChcela by som svoj výsledok prebrať s tebou.\n\n${name}`
  );
  consultBtn.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  consultBtn.addEventListener('click', () => {
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'ConsultClick', { segment: state.segment, band: band.slug });
    }
  });

  document.getElementById('igLink').addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('trackCustom', 'InstagramClick');
  });

  document.getElementById('ctaBtn').addEventListener('click', () => {
    if (typeof fbq === 'function') fbq('trackCustom', 'ValyraCTA', { segment: state.segment, band: band.slug });
    window.location.href = valyraLink;
  });
  document.getElementById('againBtn').addEventListener('click', () => {
    state.index = 0; state.score = 0; state.answers = []; state.segment = null;
    state.gateTracked = false;
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
