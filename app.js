/* ============================================================
   Pravda o chudnutí — kvízová appka (lead magnet pre Valyra)
   ============================================================ */

// ---------- KONFIGURÁCIA ----------
const CONFIG = {
  // Sem vlož webhook na zber leadov (Make.com / Google Apps Script / Formspree).
  // Ak necháš prázdne, lead sa nikam neodošle — pixel event sa vystrelí aj tak.
  WEBHOOK_URL: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  CONTACT_EMAIL: 'karas.jan2@gmail.com',
  VALYRA_URL: 'https://valyra.sk/',
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
    explain: 'Tabuľka mliečnej čokolády má okolo <strong>530 kcal</strong> — a rezká chôdza spáli zhruba 330 kcal za hodinu. Takže <strong>asi hodina a pol svižného pochodu</strong>. Preto platí zlaté pravidlo: zlú stravu sa prebehať nedá — jedlom sa dá „zjesť" každý tréning.',
  },
  {
    type: 'mc',
    q: 'Koľko prírodného cukru (laktózy) obsahuje 1 dcl polotučného mlieka?',
    options: ['Žiadny', 'Asi 1 g', 'Asi 5 g', 'Asi 15 g'],
    correct: 2,
    explain: 'V 1 dcl mlieka je <strong>približne 5 g laktózy</strong> — prírodného mliečneho cukru. Nie je to pridaný cukor a v bežnom množstve nie je problém. Pozor si dávaj skôr na sladené „mliečne nápoje".',
  },
  {
    type: 'tf',
    q: 'Keď prestanem cvičiť, svaly sa mi premenia na tuk.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Sval a tuk sú <strong>dve úplne rozdielne tkanivá</strong> — jedno sa na druhé premeniť nevie, rovnako ako sa kosť nepremení na krv. Bez tréningu svaly pomaly ubúdajú a ak jedálniček ostane rovnaký, tuk pribúda. Vyzerá to ako „premena", ale sú to dva samostatné procesy.',
  },
  {
    type: 'mc',
    q: 'Ktorá živina má najviac kalórií na 1 gram?',
    options: ['Cukor', 'Bielkoviny', 'Tuk', 'Všetky majú rovnako'],
    correct: 2,
    explain: '<strong>Tuk má 9 kcal na gram</strong> — cukor aj bielkoviny len 4. Tichým druhým je alkohol so 7 kcal/g: dva poháre vína majú kalórie ako večera, len bez zasýtenia. Preto lyžica oleja „nevinne" navýši jedlo o 90 kcal.',
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
    q: 'Koľko kalórií denne spáli 1 kg svalov navyše — len tak, v pokoji?',
    options: ['Asi 13 kcal', 'Asi 50 kcal', 'Asi 100 kcal', 'Asi 250 kcal'],
    correct: 0,
    explain: 'Prekvapenie: len <strong>asi 13 kcal denne</strong> — mýtus o „100 kcal na kilo svalov" je zveličený takmer 10-násobne. Svaly ti pri chudnutí pomáhajú inak: tréning s nimi spáli veľa energie, tvarujú postavu a chránia ťa pred jojo efektom. Ale zázračná pec v pokoji to nie je.',
  },
  {
    type: 'tf',
    q: 'Keď žena začne cvičiť s činkami, do pár mesiacov naberie veľké svaly.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Ženy majú výrazne <strong>menej testosterónu</strong> — budovanie viditeľnej svalovej hmoty trvá roky tvrdého tréningu a jedenia v nadbytku. Činky ženskú postavu spevnia a vytvarujú. Kulturistky, ktorých sa ženy boja, tak vyzerajú po dekáde extrémnej driny, nie po 3 mesiacoch v posilke.',
  },
  {
    type: 'mc',
    q: 'Čo u väčšiny ľudí spáli za deň viac energie?',
    options: ['Hodinový tréning v posilňovni', 'Bežný pohyb počas dňa (chôdza, schody, domácnosť)', 'Je to presne rovnaké', 'Ani jedno — rozhoduje len strava'],
    correct: 1,
    explain: 'Hodina v posilke spáli 300–500 kcal, ale <strong>bežný denný pohyb</strong> (odborne NEAT) dokáže spáliť aj dvojnásobok — po celom dni sa to nasčíta. Preto aktívny nešportovec často spáli viac než človek, čo hodinu cvičí a zvyšok dňa presedí. 8 000 krokov denne je nenápadná superzbraň.',
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
    explain: '<strong>0,5–1 kg týždenne</strong> je tempo, pri ktorom chudneš tuk, nie svaly a vodu — a hlavne ho udržíš. Rýchle diéty vedú k jojo efektu: 95 % ľudí po nich váhu naberie späť.',
  },
];

// Segmentačná otázka — bez bodov, bez správnej odpovede
const SEGMENT_Q = {
  // Neutrálny tvar — pohlavie v tomto bode ešte nepoznáme (pýta sa až vo formulári)
  q: 'A posledná otázka — keby si mohol/mohla na sebe zmeniť jednu vec, čo by to bolo?',
  options: [
    { label: 'Schudnúť a cítiť sa dobre vo svojom tele', value: 'schudnut' },
    { label: 'Mať viac energie počas dňa', value: 'energia' },
    { label: 'Prestať sa točiť v kruhu diét a začínania odznova', value: 'kruh-diet' },
    { label: 'Vybudovať si návyky, ktoré konečne vydržia', value: 'navyky' },
  ],
};

// Vyhodnotenie podľa pásma skóre
const BANDS = [
  {
    min: 0, max: 4,
    name: { zena: 'Mýty ťa vodia za nos', muz: 'Mýty ťa vodia za nos' },
    slug: 'zaciatocnicka',
    text: {
      zena: 'A nie je to tvoja chyba — <strong>diétny priemysel na týchto mýtoch zarába miliardy</strong>, takže ich počúvaš zo všetkých strán. Dobrá správa? Práve si sa dozvedela viac pravdy o chudnutí než väčšina ľudí za celý rok. S dobrými informáciami a podporou to pôjde rýchlejšie, než čakáš.',
      muz: 'A nie je to tvoja chyba — <strong>diétny priemysel na týchto mýtoch zarába miliardy</strong>, takže ich počúvaš zo všetkých strán. Dobrá správa? Práve si sa dozvedel viac pravdy o chudnutí než väčšina ľudí za celý rok. S dobrými informáciami a podporou to pôjde rýchlejšie, než čakáš.',
    },
  },
  {
    min: 5, max: 8,
    name: { zena: 'Bojovníčka s polovičnou mapou', muz: 'Bojovník s polovičnou mapou' },
    slug: 'pokrocila',
    text: {
      zena: 'Základ máš — ale <strong>pár mýtov ťa stále brzdí</strong>. A presne tie bývajú dôvod, prečo výsledky prichádzajú pomalšie, než by mali, alebo sa po čase zastavia. Keď doplníš medzery a pridáš systém, telo zareaguje.',
      muz: 'Základ máš — ale <strong>pár mýtov ťa stále brzdí</strong>. A presne tie bývajú dôvod, prečo výsledky prichádzajú pomalšie, než by mali, alebo sa po čase zastavia. Keď doplníš medzery a pridáš systém, telo zareaguje.',
    },
  },
  {
    min: 9, max: 12,
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
      <div class="eyebrow">Kvíz · 12 otázok · 3 minúty</div>
      <h1>Pravda o chudnutí: si v obraze, alebo veríš <span class="flip">mýtom?</span></h1>
      <p class="lead">Po každej odpovedi sa hneď dozvieš, ako to je naozaj — takže z kvízu odchádzaš s novými vedomosťami, nech dopadneš akokoľvek.</p>
      <div class="intro-facts">
        <span>🧠 Overené fakty, žiadne poučky</span>
        <span>📊 Osobné vyhodnotenie</span>
        <span>🎯 3 tipy podľa tvojich odpovedí</span>
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
  app.innerHTML = `
    <section class="gate">
      <div class="step-label">Hotovo ✓ Tvoje vyhodnotenie je pripravené</div>
      <h2>Kam ti mám poslať výsledok + 3 tipy presne podľa tvojich odpovedí?</h2>
      <p class="sub">Skóre uvidíš hneď. Do e-mailu ti pošlem vyhodnotenie a konkrétne tipy, čo ti podľa odpovedí najviac brzdí výsledky.</p>
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

function submitLead() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const gdpr = document.getElementById('gdpr').checked;
  const err = document.getElementById('errMsg');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!name || !emailOk || !gdpr) {
    err.textContent = !name ? 'Doplň, prosím, meno.'
      : !emailOk ? 'Skontroluj, prosím, e-mail — nevyzerá kompletný.'
      : 'Bez súhlasu ti vyhodnotenie nemôžem poslať.';
    err.classList.add('show');
    return;
  }

  // Meta Pixel — rovnaká udalosť a hodnota ako Formio, kampane porovnáš 1:1
  if (typeof fbq === 'function') {
    fbq('track', 'CompleteRegistration', { value: 5.00, currency: 'EUR' });
  }

  // Webhook (ak je nastavený) — Google Apps Script vyžaduje no-cors + text/plain
  if (CONFIG.WEBHOOK_URL) {
    const band = bandFor(state.score);
    fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
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
      }),
    }).catch(() => { /* lead nesmie zablokovať výsledok */ });
  }

  showResult(name);
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
      <p class="email-note">📬 Podrobné vyhodnotenie + 3 tipy presne pre teba ti práve odišli na e-mail. Ak neprídu do pár minút, pozri si priečinok Hromadné/Spam.</p>
      ${recapHtml}
      <div class="coach-card">
        <p><strong>Ja som Ján.</strong> Sám som schudol 45 kg — z 133 na 88 — a držím si to už 8 rokov. Presne preto viem, že nerozhodujú zázračné diéty, ale systém a podpora. Tú dostaneš vo Valyre.</p>
        <a class="coach-link" href="https://www.instagram.com/janykaras" target="_blank" rel="noopener" id="igLink">📸 Sleduj ma na Instagrame @janykaras</a>
      </div>
      <div class="offer-stack">
        <div>✓ jedálniček vypočítaný na tvoje telo a cieľ — hotový za 2 minúty</div>
        <div>✓ Ján v chate — reálny kouč, nie robot</div>
        <div>✓ bez karty — po 7 dňoch sa ti nič samo nestrhne</div>
      </div>
      <button class="btn" id="ctaBtn">Vyskúšať Valyru — 7 dní zadarmo →</button>
      <a class="btn secondary" id="consultBtn" href="#">✉️ Chcem prebrať svoj výsledok — napíš mi</a>
      <p class="retry-line"><button class="link-btn" id="againBtn">Skúsiť kvíz znova</button></p>
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
    if (typeof fbq === 'function') fbq('trackCustom', 'ConsultClick', { segment: state.segment, band: band.slug });
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
