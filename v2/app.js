const CONFIG = {
  API: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  PIXEL: '2221207801987418',
  SOURCE: 'funnel-v2',
  VERSION: 6,
};

const PROBLEMS = [
  { value: 'co-jest', label: 'Neviem, čo a koľko mám jesť' },
  { value: 'vecerne-chute', label: 'Večer prídu chute a sladké' },
  { value: 'nevydrzim', label: 'Začnem, ale po pár dňoch prestanem' },
  { value: 'nemam-cas', label: 'Nemám čas plánovať a variť' },
  { value: 'potrebujem-podporu', label: 'Viem čo robiť, ale chýba mi podpora' },
];

const HISTORIES = [
  { value: 'prvykrat', label: 'Toto bude môj prvý poriadny pokus' },
  { value: 'raz-dva', label: 'Kilá sa mi vrátili raz alebo dvakrát' },
  { value: 'viackrat', label: 'Vrátili sa mi už trikrát alebo viackrát' },
  { value: 'jojo', label: 'Moja váha ide stále hore-dole' },
];

const BREAKS = [
  { value: 'vecer', label: 'Večer doma', phrase: 'večer doma' },
  { value: 'praca', label: 'Cez deň v práci', phrase: 'cez deň v práci' },
  { value: 'vikend', label: 'Cez víkend', phrase: 'cez víkend' },
  { value: 'zaciatok', label: 'Po pár dňoch', phrase: 'už po pár dňoch' },
];

const PLANS = {
  'co-jest': {
    title: 'Menej rozhodovania, viac istoty',
    insight: 'Nepotrebuješ ďalší zoznam zakázaných jedál. Potrebuješ jednoduchú kostru taniera, ktorú použiješ aj v bežný pracovný deň.',
    days: [
      ['Bielkovina k prvému jedlu', 'Vajcia, tvaroh, grécky jogurt alebo strukoviny. Dnes nič nerátaj.'],
      ['Poskladaj jeden normálny tanier', 'Polovica zelenina, štvrtina bielkovina, štvrtina príloha.'],
      ['Zopakuj včerajší obed', 'Opakovanie je výhoda. Nemusíš každý deň vymyslieť nový recept.'],
      ['Priprav núdzové jedlo', 'Maj doma jednu rýchlu kombináciu na deň, keď nestíhaš.'],
      ['Jedz bez mobilu', 'Aspoň jedno jedlo zjedz pomaly a bez obrazovky.'],
      ['Po zaváhaní pokračuj', 'Ďalšie jedlo je normálne. Žiadne hladovanie ani nový pondelok.'],
      ['Vyber si tri jedlá na ďalší týždeň', 'Nie celý jedálniček. Tri jedlá, ktoré vieš naozaj zopakovať.'],
    ],
  },
  'vecerne-chute': {
    title: 'Večer sa rieši už cez deň',
    insight: 'Večerná chuť často nie je slabá vôľa, ale účet za deň s malým jedlom, stresom a únavou.',
    days: [
      ['Raňajky s bielkovinou', 'Vajcia, tvaroh alebo grécky jogurt. Začni sýtosťou, nie zákazom.'],
      ['Normálny obed', 'Nešetri kalórie celý deň na úkor večera. Daj si plnohodnotný obed.'],
      ['Naplánuj olovrant', 'Dve hodiny pred kritickým časom si daj ovocie s jogurtom alebo tvarohom.'],
      ['Urči večernú porciu vopred', 'Ak chceš sladké, daj si porciu na tanier. Nejedz z obalu.'],
      ['Vytvor koniec jedenia', 'Po večeri čaj, zuby a odchod z kuchyne. Jednoduchý opakovaný signál.'],
      ['Po zaváhaní nič nekompenzuj', 'Ráno sa normálne naraňajkuj. Jeden večer nerozhodne, séria áno.'],
      ['Zapíš si spúšťač', 'Hlad, stres alebo zvyk? Jedno slovo ti ukáže, čo treba riešiť ďalej.'],
    ],
  },
  'nevydrzim': {
    title: 'Plán, ktorý prežije aj zlý deň',
    insight: 'Problém nie je začiatok. Problém je plán nastavený iba na dni, keď máš energiu a motiváciu.',
    days: [
      ['Vyber minimum', 'Jedna vec, ktorú zvládneš aj v najhorší deň. Napríklad desať minút chôdze.'],
      ['Zopakuj minimum', 'Dnes nič nepridávaj. Dôslednosť je cieľ, nie výkon.'],
      ['Priprav záložný obed', 'Rozhodni vopred, čo zješ, keď pôvodný plán padne.'],
      ['Skráť pohyb, nezruš ho', 'Ak nemáš 30 minút, sprav 10. Nula nie je jediná alternatíva.'],
      ['Označ úspech', 'Zapíš si, čo si dodržal(a). Mozog potrebuje vidieť sériu.'],
      ['Nacvič návrat', 'Keď niečo nevyjde, ďalší krok je normálny. Nečakaj na pondelok.'],
      ['Ponechaj len to, čo fungovalo', 'Na ďalší týždeň si zober dve veci, nie sedem nových pravidiel.'],
    ],
  },
  'nemam-cas': {
    title: 'Jedlo bez každodenného plánovania',
    insight: 'Tvoj plán musí šetriť rozhodnutia aj čas. Inak prehrá v prvom náročnom dni.',
    days: [
      ['Uvar dve porcie navyše', 'To, čo varíš dnes, vyrieši aj zajtrajší obed.'],
      ['Vyber tri rýchle jedlá', 'Maj tri kombinácie do 10 minút, ktoré vieš spraviť bez receptu.'],
      ['Nakúp jednu záchrannú kombináciu', 'Napríklad tvaroh, pečivo, zelenina a ovocie.'],
      ['Použi mrazenú zeleninu', 'Praktickosť nie je prehra. Je to spôsob, ako plán udržať.'],
      ['Zjednoduš raňajky', 'Jedny raňajky opakuj celý pracovný týždeň.'],
      ['Po chaotickom dni pokračuj', 'Nič nedoháňaj. Ďalšie jedlo je znovu jednoduché a normálne.'],
      ['Naplánuj iba tri dni', 'Nedeľa nemusí vyriešiť celý týždeň. Začni troma najťažšími dňami.'],
    ],
  },
  'potrebujem-podporu': {
    title: 'Zodpovednosť namiesto ďalších informácií',
    insight: 'Pravdepodobne už vieš dosť. Chýba ti systém, v ktorom sa niekomu ozveš aj vtedy, keď motivácia klesne.',
    days: [
      ['Napíš si jediný záväzok', 'Jedna konkrétna vec na dnes, nie celý nový režim.'],
      ['Urči čas kontroly', 'Daj si do kalendára päť minút na krátke zhodnotenie dňa.'],
      ['Povedz cieľ jednému človeku', 'Nie kvôli tlaku. Kvôli tomu, aby cieľ nezostal iba v hlave.'],
      ['Pošli krátky stav', 'Stačia dve vety: čo vyšlo a kde to prasklo.'],
      ['Vopred si vypýtaj pomoc', 'Urči, komu napíšeš, keď príde slabší deň.'],
      ['Priznaj zaváhanie bez trestu', 'Zaváhanie nie je koniec. Je to informácia pre ďalší krok.'],
      ['Dohodni ďalšiu kontrolu', 'Podpora funguje iba vtedy, keď má konkrétny ďalší termín.'],
    ],
  },
};

const state = { step: 0, problem: '', history: '', name: '', email: '', leadId: '', breakPoint: '', sent: false };
const app = document.getElementById('app');

function track(event, params = {}) {
  if (typeof fbq !== 'function') return;
  const standard = ['Lead', 'CompleteRegistration', 'Contact', 'ViewContent'];
  fbq(standard.includes(event) ? 'trackSingle' : 'trackSingleCustom', CONFIG.PIXEL, event, { funnel: 'v2', ...params });
}

const creativeId = (() => {
  try {
    const key = 'valyra_v2_creative';
    const q = new URLSearchParams(location.search);
    const raw = q.get('ad_id') || q.get('utm_content') || q.get('creative_id') || '';
    const clean = /[{}]/.test(raw) ? '' : raw.slice(0, 60);
    if (clean) sessionStorage.setItem(key, clean);
    return clean || sessionStorage.getItem(key) || '';
  } catch { return ''; }
})();

function brand() {
  return '<div class="brand"><span class="brand-mark">V</span><span>VALYRA</span></div>';
}

function renderLanding() {
  state.step = 0;
  app.innerHTML = `${brand()}
    <section class="hero">
      <div class="eyebrow">7 dní bez diéty</div>
      <h1>Prestaň začínať odznova.</h1>
      <p class="lead">Za dve minúty zistíš, čo ti pri chudnutí najčastejšie podkopáva nohy, a dostaneš jednoduchý plán na najbližších sedem dní.</p>
      <ul class="promise">
        <li><span class="tick">✓</span><span>Každý deň iba <strong>jeden zvládnuteľný krok</strong></span></li>
        <li><span class="tick">✓</span><span>Bez zakázaných jedál a bez dokonalého režimu</span></li>
        <li><span class="tick">✓</span><span>Podľa tvojej skutočnej brzdy, nie všeobecná poučka</span></li>
      </ul>
      <button class="primary" id="start">Chcem svoj 7-dňový plán</button>
      <p class="micro">Zadarmo · približne 2 minúty · príde aj na e-mail</p>
      <div class="path-preview">
        <div class="eyebrow">Čo môže nasledovať</div>
        <p><strong>Plán je prvý krok.</strong> Ak budeš chcieť pokračovať, môžeš si potom vypýtať bezplatnú úvodnú konzultáciu so mnou.</p>
        <p>Keď zistíme, že ti viem pomôcť, ponúknem ti <strong>2 mesiace osobného vedenia cez Valyru za 150 €</strong>. Zaplatíš až po prvom týždni, keď si spoluprácu najprv vyskúšaš.</p>
      </div>
      <div class="proof">
        <img src="/img/jan-dnes-88.jpg" width="152" height="152" alt="Ján Karas dnes">
        <p><strong>Ján Karas</strong><br>Schudol som 45 kg a osem rokov si výsledok držím. Tento týždeň je postavený na tom, čo pomohlo mne prestať stále začínať znova.</p>
      </div>
    </section>`;
  document.getElementById('start').addEventListener('click', () => {
    track('V2Start');
    renderProblem();
  });
  track('V2View');
}

function shell(content, step) {
  return `${brand()}<section class="shell"><div class="topline"><span>7-dňový plán</span><span>Krok ${step} z 3</span></div><div class="progress"><span style="width:${step / 3 * 100}%"></span></div><div class="panel">${content}</div></section>`;
}

function renderProblem() {
  state.step = 1;
  app.innerHTML = shell(`<div class="eyebrow">Tvoja hlavná brzda</div><h2>Čo ti to kazí najviac?</h2><p class="question-note">Vyber jednu možnosť, ktorá najlepšie sedí na bežný týždeň.</p><div class="options">${PROBLEMS.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 1);
  bindOptions('problem', renderHistory);
  track('V2Step', { step: 1, screen: 'problem' });
}

function renderHistory() {
  state.step = 2;
  app.innerHTML = shell(`<div class="eyebrow">Tvoja skúsenosť</div><h2>Koľkokrát sa ti kilá vrátili?</h2><p class="question-note">Odpoveď určí, či plán postavíme viac na štarte alebo na udržaní výsledku.</p><div class="options">${HISTORIES.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 2);
  bindOptions('history', renderGate);
  track('V2Step', { step: 2, screen: 'history' });
}

function bindOptions(key, next) {
  document.querySelectorAll('.option[data-value]').forEach(btn => btn.addEventListener('click', () => {
    state[key] = btn.dataset.value;
    next();
  }));
}

function renderGate() {
  state.step = 3;
  app.innerHTML = shell(`<div class="eyebrow">Tvoj plán je pripravený</div><h2>Kam ti ho mám poslať?</h2><p class="question-note">Hneď ho uvidíš aj tu. Pošlem ti ho na e-mail, aby si sa k nemu vedel(a) vrátiť.</p>
    <form id="leadForm" novalidate>
      <div class="field"><label for="name">Krstné meno</label><input id="name" name="name" autocomplete="given-name" maxlength="100" required></div>
      <div class="field"><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" maxlength="200" inputmode="email" required></div>
      <label class="consent"><input id="consent" type="checkbox" required><span>Súhlasím so spracovaním údajov na vytvorenie plánu a so zaslaním dvoch e-mailov od Jána o pláne a možnosti spolupráce. Odhlásiť sa môžem jedným klikom.</span></label>
      <div class="error" id="leadError" role="alert" aria-live="polite"></div>
      <button class="primary" id="submitLead" type="submit">Zobraziť môj 7-dňový plán</button>
    </form>`, 3);
  document.getElementById('leadForm').addEventListener('submit', submitLead);
  track('V2Step', { step: 3, screen: 'email' });
}

async function submitLead(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const consent = document.getElementById('consent').checked;
  const error = document.getElementById('leadError');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !consent) {
    error.textContent = 'Doplň, prosím, meno, platný e-mail a súhlas.';
    return;
  }
  state.name = name;
  state.email = email;
  const btn = document.getElementById('submitLead');
  btn.disabled = true;
  btn.textContent = 'Pripravujem plán…';
  const problemLabel = PROBLEMS.find(x => x.value === state.problem)?.label || '';
  const payload = {
    name, email, score: null, maxScore: null,
    band: '7-dňový štartovací plán',
    bandName: `Tvoja brzda: ${problemLabel}`,
    baseSegment: state.problem,
    history: state.history,
    readiness: 'plan',
    segment: `${state.problem}|${state.history}|plan`,
    wrong: [], source: CONFIG.SOURCE, quizVersion: CONFIG.VERSION,
    creativeId,
  };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(CONFIG.API, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const out = await res.json();
    state.leadId = out.leadId || out.id || '';
    track('CompleteRegistration', { content_name: 'funnel-v2-plan', creative_id: creativeId || undefined });
    renderResult();
  } catch {
    error.textContent = 'Plán sa nepodarilo uložiť. Skús to, prosím, ešte raz.';
    btn.disabled = false;
    btn.textContent = 'Skúsiť znova';
  }
}

function renderResult() {
  const plan = PLANS[state.problem] || PLANS['co-jest'];
  const relapse = state.history === 'viackrat' || state.history === 'jojo';
  app.innerHTML = `${brand()}<section class="result">
    <div class="result-head"><div class="eyebrow">Tvoj plán je hotový</div><h2>${escapeHtml(state.name)}, toto je tvoj najbližší týždeň.</h2><p>Nepridávaj si k nemu ďalších desať pravidiel. Každý deň sprav iba jednu vec.</p></div>
    <div class="diagnosis"><small>Tvoja hlavná brzda</small><h3>${plan.title}</h3><p>${plan.insight}${relapse ? ' Keďže sa ti kilá už vracali, najdôležitejší bude šiesty deň: návrat bez trestu a bez čakania na nový pondelok.' : ''}</p></div>
    <div class="days">${plan.days.map((d, i) => `<article class="day"><div class="day-num">${i + 1}</div><div><strong>${d[0]}</strong><p>${d[1]}</p></div></article>`).join('')}</div>
    <p class="micro">Plán som poslal aj na <strong>${escapeHtml(state.email)}</strong>. Ak ho nevidíš, skontroluj priečinok Spam alebo Hromadné.</p>
    <section class="coach-offer" id="help">
      <div class="eyebrow">Bezplatná úvodná konzultácia</div>
      <h3>Nemusíš zisťovať sám/sama, prečo sa ti to stále vracia.</h3>
      <p>Na krátkej konzultácii prejdeme tvoju hlavnú brzdu a nájdeme prvú úpravu, ktorá sedí do tvojho reálneho života. Konzultácia je bezplatná a bez záväzku.</p>
      <div class="program-card">
        <small>Ak si spolupráca sadne</small>
        <strong>2 mesiace osobného vedenia cez Valyru</strong>
        <ul><li>jednoduchý plán podľa tvojho života,</li><li>moja pravidelná kontrola a úpravy,</li><li>podpora, aby jeden zlý deň neznamenal koniec.</li></ul>
        <div class="price"><span>150 € spolu</span><em>platba až po prvom týždni</em></div>
      </div>
      <button class="primary" id="helpBtn">Chcem bezplatnú konzultáciu</button>
      <p class="offer-micro">Najprv sa porozprávame. Až potom sa rozhodneš, či chceš program.</p>
      <div class="contact-box" id="contactBox" hidden></div>
    </section>
  </section>`;
  document.getElementById('helpBtn').addEventListener('click', openContact, { once: true });
  track('ViewContent', { content_name: 'v2-seven-day-plan', segment: state.problem });
}

function openContact() {
  const btn = document.getElementById('helpBtn');
  btn.hidden = true;
  const box = document.getElementById('contactBox');
  box.hidden = false;
  box.innerHTML = `<strong>Kedy ti to najčastejšie praskne?</strong><div class="breaks">${BREAKS.map(x => `<button class="option" data-break="${x.value}">${x.label}</button>`).join('')}</div>
    <div class="field"><label for="note">Chceš niečo doplniť? <span style="font-weight:400">(nepovinné)</span></label><textarea id="note" maxlength="1200" placeholder="Stačí jedna veta…"></textarea></div>
    <div class="error" id="contactError" role="alert" aria-live="polite"></div>
    <button class="primary" id="sendContact">Požiadať o konzultáciu</button>`;
  box.querySelectorAll('[data-break]').forEach(x => x.addEventListener('click', () => {
    state.breakPoint = x.dataset.break;
    box.querySelectorAll('[data-break]').forEach(y => y.classList.toggle('active', y === x));
  }));
  document.getElementById('sendContact').addEventListener('click', submitContact);
  track('V2HelpOpen', { segment: state.problem });
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function submitContact() {
  const error = document.getElementById('contactError');
  if (!state.breakPoint) {
    error.textContent = 'Vyber, prosím, kedy ti to najčastejšie praskne.';
    return;
  }
  const btn = document.getElementById('sendContact');
  btn.disabled = true;
  btn.textContent = 'Posielam…';
  const selected = BREAKS.find(x => x.value === state.breakPoint);
  const note = document.getElementById('note').value.trim();
  const message = [`Praská mi to ${selected.phrase}.`, note].filter(Boolean).join('\n\n');
  const repeated = state.history === 'viackrat' || state.history === 'jojo';
  const payload = {
    typ: 'konzultacia', name: state.name, email: state.email, phone: '', message,
    preferredTime: '', segment: state.problem, history: state.history,
    readiness: 'podpora', selectedPath: 'written_consult',
    tier: repeated || state.problem === 'potrebujem-podporu' ? 'hot' : 'warm',
    source: CONFIG.SOURCE, creativeId, band: '7-dňový štartovací plán',
    quizVersion: CONFIG.VERSION, ts: new Date().toISOString(),
  };
  try {
    const res = await fetch(CONFIG.API, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const out = await res.json();
    if (!out || out.kind !== 'message') throw new Error('unconfirmed');
    state.sent = true;
    track('Lead', { way: 'message', segment: state.problem, funnel_version: CONFIG.VERSION, value: 25, currency: 'EUR' });
    track('Contact', { content_name: 'v2-personal-help' });
    document.getElementById('contactBox').innerHTML = `<div class="done"><strong>✓ Žiadosť o konzultáciu je odoslaná.</strong><br>Ján sa pozrie na tvoju situáciu a ozve sa ti na <strong>${escapeHtml(state.email)}</strong>. Na konzultácii si najprv overíte, či ti jeho 2-mesačné vedenie dáva zmysel.</div>`;
  } catch {
    error.textContent = 'Správu sa nepodarilo odoslať. Skús to, prosím, ešte raz.';
    btn.disabled = false;
    btn.textContent = 'Skúsiť znova';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

renderLanding();

