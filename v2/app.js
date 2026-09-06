const CONFIG = {
  API: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  PIXEL: '2221207801987418',
  SOURCE: 'funnel-v2',
  VERSION: 10,
  CALENDAR: 'https://calendar.app.google/xfubmW69zjcoGnsH8',
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

const GOALS = [
  { value: 'minus-5-10', label: 'Schudnúť približne 5–10 kg' },
  { value: 'minus-10-20', label: 'Schudnúť približne 10–20 kg' },
  { value: 'minus-20-plus', label: 'Schudnúť viac ako 20 kg' },
  { value: 'forma-navyky', label: 'Dostať sa do formy a nastaviť si návyky' },
];

const TIMINGS = [
  { value: 'hned', label: 'Chcem začať hneď', note: 'V najbližších 7 dňoch.' },
  { value: 'do-14-dni', label: 'Chcem začať do 14 dní', note: 'Potrebujem si len nastaviť termín.' },
  { value: 'neskor', label: 'Zatiaľ sa iba rozhliadam', note: 'Teraz ešte nechcem začať.' },
];

const INVESTMENTS = [
  { value: 'ano', label: 'Áno, ak mi vedenie bude sedieť', note: 'Prvých 7 dní vyskúšam zdarma; potom môžem pokračovať 7 týždňov za 150 €.' },
  { value: 'porozpravat', label: 'Potrebujem sa o tom najprv porozprávať', note: 'Chcem vedieť, čo presne dostanem a či je to pre mňa.' },
  { value: 'nie', label: 'Nie, hľadám iba bezplatný plán', note: 'Teraz nechcem investovať do osobného vedenia.' },
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
      ['Označ úspech', 'Zapíš si, čo si dodržala. Mozog potrebuje vidieť sériu.'],
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

const state = { step: 0, goal: '', problem: '', timing: '', investment: '', readiness: '', name: '', email: '', leadId: '', marketingConsent: false };
const app = document.getElementById('app');

function getCookie(name) {
  const prefix = `${name}=`;
  const part = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : '';
}

const attribution = (() => {
  const q = new URLSearchParams(location.search);
  const fbclid = (q.get('fbclid') || '').slice(0, 300);
  const savedFbc = getCookie('_fbc');
  return {
    fbp: getCookie('_fbp').slice(0, 200),
    fbc: (savedFbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : '')).slice(0, 400),
    fbclid,
    utmSource: (q.get('utm_source') || '').slice(0, 100),
    utmMedium: (q.get('utm_medium') || '').slice(0, 100),
    utmCampaign: (q.get('utm_campaign') || '').slice(0, 150),
    utmContent: (q.get('utm_content') || '').slice(0, 150),
    utmTerm: (q.get('utm_term') || '').slice(0, 150),
    eventId: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    landingUrl: location.href.slice(0, 1000),
  };
})();

function hasMeasurementConsent() {
  try { return localStorage.getItem('valyra_fb_consent') === 'granted'; }
  catch { return false; }
}

function track(event, params = {}, options = {}) {
  if (!hasMeasurementConsent() || typeof fbq !== 'function') return;
  const standard = ['Lead', 'CompleteRegistration', 'Contact', 'ViewContent'];
  fbq(standard.includes(event) ? 'trackSingle' : 'trackSingleCustom', CONFIG.PIXEL, event, { funnel: 'v2', ...params }, options);
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
      <div class="eyebrow">Osobné vedenie pre zaneprázdnených ľudí</div>
      <h1>Schudni popri práci a rodine bez ďalšieho začínania odznova.</h1>
      <p class="lead">Zisti, či je moje 8-týždňové vedenie vhodné pre tvoj cieľ, režim a možnosti. Plán počas spolupráce upravujeme podľa toho, čo sa deje v tvojom reálnom živote.</p>
      <ul class="promise">
        <li><span class="tick">✓</span><span>Strava a pohyb nastavené <strong>podľa práce, rodiny a času</strong></span></li>
        <li><span class="tick">✓</span><span>Pravidelná kontrola a úpravy, keď sa zmení režim alebo výsledky</span></li>
        <li><span class="tick">✓</span><span>Prvých 7 dní zdarma a bez karty — až potom sa rozhodneš</span></li>
      </ul>
      <button class="primary" id="start">Zistiť, či je vedenie pre mňa</button>
      <p class="micro">Krátka kvalifikácia · približne 2 minúty · bez záväzku</p>
      <div class="qualification-note"><strong>Transparentne:</strong> ak ti prvý týždeň pomôže, pokračovanie ďalších 7 týždňov stojí spolu 150 €. Ak nie, neplatíš nič.</div>
      <figure class="client-result">
        <img src="/img/clientka-15kg.webp" width="1400" height="1168" loading="lazy" decoding="async" alt="Výsledok klientky pod Jánovým vedením: 85 kg v roku 2024, 75 kg v roku 2025 a 70 kg v roku 2026">
        <figcaption>
          <div class="eyebrow">Reálna klientka · reálny výsledok</div>
          <strong>85 kg → 70 kg. Spolu –15 kg.</strong>
          <p>Nie fotografia po pár dobrých dňoch, ale postupný výsledok pod mojím vedením od roku 2024 do roku 2026.</p>
          <small>Každý človek je iný a výsledky sa môžu líšiť.</small>
        </figcaption>
      </figure>
      <div class="proof">
        <img src="/img/jan-dnes-88.jpg" width="152" height="152" alt="Ján Karas dnes">
        <p><strong>Ján Karas</strong><br>Schudol som 45 kg a osem rokov si výsledok držím. Tento týždeň je postavený na tom, čo pomohlo mne prestať stále začínať znova.</p>
      </div>
    </section>`;
  document.getElementById('start').addEventListener('click', () => {
    track('V2Start');
    renderGoal();
  });
  track('V2View');
}

function shell(content, step) {
  return `${brand()}<section class="shell"><div class="topline"><span>Osobné vedenie na mieru</span><span>Krok ${step} z 5</span></div><div class="progress"><span style="width:${step / 5 * 100}%"></span></div><div class="panel">${content}</div></section>`;
}

function renderGoal() {
  state.step = 1;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoj cieľ</div><h2>Čo chceš reálne dosiahnuť?</h2><p class="question-note">Vyber výsledok, ktorý je pre teba teraz najdôležitejší.</p><div class="options">${GOALS.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 1);
  bindOptions('goal', renderProblem);
  bindBack(renderLanding);
  track('V2Step', { step: 1, screen: 'goal' });
}

function renderProblem() {
  state.step = 2;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoja hlavná brzda</div><h2>Čo ti popri práci a rodine robí najväčší problém?</h2><p class="question-note">Podľa odpovede viem, čo by sme museli nastaviť ako prvé.</p><div class="options">${PROBLEMS.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 2);
  bindOptions('problem', renderTiming);
  bindBack(renderGoal);
  track('V2Step', { step: 2, screen: 'problem' });
}

function renderTiming() {
  state.step = 3;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoj termín</div><h2>Kedy chceš so zmenou naozaj začať?</h2><p class="question-note">Nejde o správnu odpoveď. Potrebujem vedieť, či je pre teba vedenie aktuálne teraz.</p><div class="options">${TIMINGS.map(x => `<button class="option" data-value="${x.value}"><strong>${x.label}</strong><small>${x.note}</small></button>`).join('')}</div>`, 3);
  bindOptions('timing', renderInvestment);
  bindBack(renderProblem);
  track('V2Step', { step: 3, screen: 'timing' });
}

function renderInvestment() {
  state.step = 4;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Aby sme si rozumeli</div><h2>Ak ti prvý týždeň pomôže, chceš pokračovať ďalších 7 týždňov za 150 €?</h2><p class="question-note">Prvých 7 dní je zdarma a bez karty. Platiť začneš iba vtedy, keď sa rozhodneš pokračovať.</p><div class="options">${INVESTMENTS.map(x => `<button class="option" data-value="${x.value}"><strong>${x.label}</strong><small>${x.note}</small></button>`).join('')}</div>`, 4);
  document.querySelectorAll('.option[data-value]').forEach(btn => btn.addEventListener('click', () => {
    state.investment = btn.dataset.value;
    state.readiness = state.investment === 'ano' && state.timing !== 'neskor' ? 'podpora' : state.investment === 'porozpravat' ? 'plan' : 'informacie';
    renderGate();
  }));
  bindBack(renderTiming);
  track('V2Step', { step: 4, screen: 'investment' });
}

function bindOptions(key, next) {
  document.querySelectorAll('.option[data-value]').forEach(btn => btn.addEventListener('click', () => {
    state[key] = btn.dataset.value;
    next();
  }));
}

function bindBack(next) {
  document.getElementById('back')?.addEventListener('click', next);
}

function renderGate() {
  state.step = 5;
  const plan = PLANS[state.problem] || PLANS['co-jest'];
  const goalLabel = GOALS.find(x => x.value === state.goal)?.label || '';
  const timingLabel = TIMINGS.find(x => x.value === state.timing)?.label || '';
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Posledný krok</div><h2>Kam ti mám poslať vyhodnotenie?</h2><div class="personal-preview"><small>Tvoj cieľ a prvé zameranie</small><strong>${goalLabel}</strong><p>${plan.insight} Začiatok: ${timingLabel.toLowerCase()}.</p></div><p class="question-note">Po odoslaní hneď uvidíš svoj 7-dňový akčný štart. Ak chceš začať čoskoro, vyberieš si aj termín krátkeho hovoru.</p>
    <form id="leadForm" novalidate>
      <div class="field"><label for="name">Krstné meno</label><input id="name" name="name" autocomplete="given-name" maxlength="100" required></div>
      <div class="field"><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" maxlength="200" inputmode="email" required></div>
      <p class="data-note">E-mail použijem na vytvorenie a doručenie vyžiadaného plánu. <a href="https://valyra.sk/PrivacyPolicy" target="_blank" rel="noopener">Ako spracúvam údaje</a>.</p>
      <label class="consent"><input id="marketingConsent" type="checkbox"><span>Chcem dostať aj jeden nadväzujúci e-mail od Jána s tipom a možnosťou nezáväznej konzultácie. Odhlásiť sa môžem jedným klikom.</span></label>
      <div class="error" id="leadError" role="alert" aria-live="polite"></div>
      <button class="primary" id="submitLead" type="submit">Zobraziť vyhodnotenie a ďalší krok</button>
    </form>`, 5);
  document.getElementById('leadForm').addEventListener('submit', submitLead);
  bindBack(renderInvestment);
  track('V2Step', { step: 5, screen: 'email' });
}

async function submitLead(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const marketingConsent = document.getElementById('marketingConsent').checked;
  const error = document.getElementById('leadError');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    error.textContent = 'Doplň, prosím, meno a platný e-mail.';
    return;
  }
  state.name = name;
  state.email = email;
  state.marketingConsent = marketingConsent;
  const btn = document.getElementById('submitLead');
  btn.disabled = true;
  btn.textContent = 'Pripravujem plán…';
  const problemLabel = PROBLEMS.find(x => x.value === state.problem)?.label || '';
  const goalLabel = GOALS.find(x => x.value === state.goal)?.label || '';
  const timingLabel = TIMINGS.find(x => x.value === state.timing)?.label || '';
  const payload = {
    name, email, score: null, maxScore: null,
    band: 'Tvoj 7-dňový akčný štart',
    bandName: `Cieľ: ${goalLabel} · štart: ${timingLabel}`,
    baseSegment: state.problem,
    history: '', readiness: state.readiness,
    goal: state.goal, timing: state.timing, investment: state.investment,
    segment: `${state.problem}||${state.readiness}|${state.goal}|${state.timing}|${state.investment}`,
    wrong: [], source: CONFIG.SOURCE, quizVersion: CONFIG.VERSION,
    creativeId, marketingConsent, measurementConsent: hasMeasurementConsent(), ...attribution,
  };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(CONFIG.API, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const out = await res.json();
    state.leadId = out.leadId || out.id || '';
    track('Lead', { content_name: 'funnel-v2-plan', creative_id: creativeId || undefined }, { eventID: attribution.eventId });
    renderResult();
  } catch {
    error.textContent = 'Plán sa nepodarilo uložiť. Skús to, prosím, ešte raz.';
    btn.disabled = false;
    btn.textContent = 'Skúsiť znova';
  }
}

function renderResult() {
  const plan = PLANS[state.problem] || PLANS['co-jest'];
  const qualified = state.investment === 'ano' && (state.timing === 'hned' || state.timing === 'do-14-dni');
  const wantsConversation = state.investment === 'porozpravat' && state.timing !== 'neskor';
  const showCalendar = qualified || wantsConversation;
  const cta = qualified
    ? {
        title: 'Podľa odpovedí ti osobné vedenie dáva zmysel.',
        text: 'Vyber si termín bezplatného 15-minútového hovoru. Prejdeme tvoj cieľ, režim a prvú konkrétnu úpravu. Potom môžeš začať 7-dňovou skúškou zdarma.',
        label: 'Vybrať termín a začať',
        className: 'primary calendar-button',
      }
    : {
        title: wantsConversation ? 'Najprv si to poďme nezáväzne prejsť.' : 'Teraz si prejdi svoj akčný štart.',
        text: wantsConversation
          ? 'Na 15-minútovom hovore ti vysvetlím, ako vedenie funguje a čo by sme prispôsobili tvojmu životu.'
          : 'Podľa odpovedí zatiaľ nehľadáš osobné vedenie. To je v poriadku — začni týmito siedmimi krokmi. Keď budeš chcieť začať a investovať do vedenia, môžeš sa vrátiť.',
        label: 'Nezáväzne prejsť vedenie',
        className: 'primary calendar-button',
      };
  const todayStep = plan.days[0];
  app.innerHTML = `${brand()}<section class="result">
    <div class="result-head"><div class="eyebrow">Tvoj 7-dňový akčný štart</div><h2>${escapeHtml(state.name)}, toto je tvoj najbližší týždeň.</h2><p>Je to prvý krok, nie generický jedálniček na celý život. Pri osobnom vedení by sme ho upravovali podľa tvojich reakcií, času a výsledkov.</p></div>
    <div class="diagnosis"><small>Tvoja hlavná brzda</small><h3>${plan.title}</h3><p>${plan.insight}</p></div>
    <div class="personal-preview"><small>Sprav dnes</small><strong>${todayStep[0]}</strong><p>${todayStep[1]}</p></div>
    <div class="days">${plan.days.map((d, i) => `<article class="day"><div class="day-num">${i + 1}</div><div><strong>${d[0]}</strong><p>${d[1]}</p></div></article>`).join('')}</div>
    <p class="micro">Plán som poslal aj na <strong>${escapeHtml(state.email)}</strong>. Ak ho nevidíš, skontroluj priečinok Spam alebo Hromadné.</p>
    <section class="coach-offer" id="help">
      <div class="eyebrow">${showCalendar ? 'Tvoj ďalší krok' : 'Bez tlaku'}</div>
      <h3>${cta.title}</h3>
      <p>${cta.text}</p>
      <figure class="result-client-proof">
        <img src="/img/clientka-15kg.webp" width="1400" height="1168" loading="lazy" decoding="async" alt="Premena klientky pod Jánovým vedením: 85 kg v roku 2024, 75 kg v roku 2025 a 70 kg v roku 2026">
        <figcaption>
          <div class="eyebrow">Reálna klientka · postupná premena</div>
          <strong>85 kg → 70 kg. Spolu −15 kg.</strong>
          <p>Nie rýchla diéta ani fotografia po pár dobrých dňoch. Výsledok vznikal postupne pod mojím vedením popri bežnom živote.</p>
          <small>Každý človek je iný a výsledky sa môžu líšiť.</small>
        </figcaption>
      </figure>
      <figure class="result-client-proof">
        <img src="/img/clientka-20kg.webp" width="1100" height="916" loading="lazy" decoding="async" alt="Premena klientky pod Jánovým vedením: vľavo pred spoluprácou, vpravo po schudnutí 20 kg za 5 mesiacov">
        <figcaption>
          <div class="eyebrow">Reálna klientka · 5 mesiacov</div>
          <strong>−20 kg za 5 mesiacov.</strong>
          <p>Stravu a pohyb sme nastavili podľa jej života a počas spolupráce priebežne upravovali podľa výsledkov a aktuálnych potrieb.</p>
          <small>Každý človek je iný a výsledky sa môžu líšiť.</small>
        </figcaption>
      </figure>
      <div class="single-next-step">
        ${showCalendar ? `<a class="${cta.className}" id="calendarCta" href="${CONFIG.CALENDAR}" target="_blank" rel="noopener">${cta.label}</a><p class="offer-micro">Hovor je bezplatný a bez záväzku. Prvých 7 dní vedenia neplatíš nič. Ak ti spolupráca sedí, ďalších 7 týždňov stojí spolu 150 €.</p>` : '<p class="offer-micro">Akčný štart máš aj v e-maile. Osobné vedenie ponúkam ľuďom, ktorí chcú začať v najbližších 14 dňoch a po skúšobnom týždni sú pripravení pokračovať.</p>'}
      </div>
    </section>
  </section>`;
  document.getElementById('calendarCta')?.addEventListener('click', recordCalendarIntent);
  track('ViewContent', { content_name: 'v2-seven-day-plan', segment: state.problem });
}

function recordCalendarIntent() {
  const payload = {
    typ: 'cesta', leadId: state.leadId, selectedPath: 'calendar',
    readiness: state.readiness,
    tier: state.investment === 'ano' && state.timing !== 'neskor' ? 'hot' : state.investment === 'porozpravat' ? 'warm' : 'cold',
    source: CONFIG.SOURCE, creativeId, quizVersion: CONFIG.VERSION,
  };
  fetch(CONFIG.API, { method: 'POST', mode: 'cors', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
  track('ScheduleIntent', { lead_id: state.leadId, readiness: state.readiness, tier: payload.tier });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

renderLanding();

