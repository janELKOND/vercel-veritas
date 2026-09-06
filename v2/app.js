const CONFIG = {
  API: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  PIXEL: '2221207801987418',
  SOURCE: 'funnel-v2',
  VERSION: 8,
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

const state = { step: 0, problem: '', history: '', readiness: '', name: '', email: '', leadId: '', marketingConsent: false };
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
      <div class="eyebrow">7 dní bez diéty</div>
      <h1>Zisti, čo ti bráni schudnúť — a dostaň 7-dňový plán, ktorý zvládneš aj bez diéty.</h1>
      <p class="lead">Za dve minúty zistíš svoju hlavnú brzdu a dostaneš konkrétne raňajky, obedy, večere a jeden zvládnuteľný návyk na každý deň.</p>
      <ul class="promise">
        <li><span class="tick">✓</span><span>Každý deň iba <strong>jeden zvládnuteľný krok</strong></span></li>
        <li><span class="tick">✓</span><span>Bez zakázaných jedál a bez dokonalého režimu</span></li>
        <li><span class="tick">✓</span><span>Podľa tvojej skutočnej brzdy, nie všeobecná poučka</span></li>
      </ul>
      <button class="primary" id="start">Chcem svoj 7-dňový plán</button>
      <p class="micro">Zadarmo · približne 2 minúty · príde aj na e-mail</p>
      <p class="trial-note">Po pláne si môžeš nezáväzne vyskúšať aj 7 dní osobného vedenia zdarma.</p>
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
    renderProblem();
  });
  track('V2View');
}

function shell(content, step) {
  return `${brand()}<section class="shell"><div class="topline"><span>7-dňový plán</span><span>Krok ${step} z 4</span></div><div class="progress"><span style="width:${step / 4 * 100}%"></span></div><div class="panel">${content}</div></section>`;
}

function renderProblem() {
  state.step = 1;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoja hlavná brzda</div><h2>Čo ti to kazí najviac?</h2><p class="question-note">Vyber jednu možnosť, ktorá najlepšie sedí na bežný týždeň.</p><div class="options">${PROBLEMS.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 1);
  bindOptions('problem', renderHistory);
  bindBack(renderLanding);
  track('V2Step', { step: 1, screen: 'problem' });
}

function renderHistory() {
  state.step = 2;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoja skúsenosť</div><h2>Koľkokrát sa ti kilá vrátili?</h2><p class="question-note">Odpoveď určí, či plán postavíme viac na štarte alebo na udržaní výsledku.</p><div class="options">${HISTORIES.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 2);
  bindOptions('history', renderReadiness);
  bindBack(renderProblem);
  track('V2Step', { step: 2, screen: 'history' });
}

function renderReadiness() {
  state.step = 3;
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoj ďalší krok</div><h2>Ako chceš pokračovať?</h2><p class="question-note">Pomôže mi ukázať ti správnu možnosť — bez nátlaku.</p><div class="options"><button class="option" data-value="podpora"><strong>Chcem začať čo najskôr</strong><small>Chcem, aby ma niekto viedol a bol pri tom so mnou.</small></button><button class="option" data-value="plan"><strong>Najprv si prejdem plán</strong><small>Chcem konkrétne kroky a potom sa rozhodnem.</small></button><button class="option" data-value="informacie"><strong>Zatiaľ iba zisťujem</strong><small>Chcem si doplniť informácie bez rozhodnutia.</small></button></div>`, 3);
  bindOptions('readiness', renderGate);
  bindBack(renderHistory);
  track('V2Step', { step: 3, screen: 'readiness' });
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
  state.step = 4;
  const plan = PLANS[state.problem] || PLANS['co-jest'];
  app.innerHTML = shell(`<button class="back" id="back" type="button">← Späť</button><div class="eyebrow">Tvoj plán je pripravený</div><h2>Kam ti ho mám poslať?</h2><div class="personal-preview"><small>Podľa tvojich odpovedí</small><strong>${plan.title}</strong><p>${plan.insight}</p></div><p class="question-note">Plán ti zobrazíme hneď a pošleme aj e-mailom, aby sa nestratil a mohla si sa k nemu vrátiť.</p>
    <form id="leadForm" novalidate>
      <div class="field"><label for="name">Krstné meno</label><input id="name" name="name" autocomplete="given-name" maxlength="100" required></div>
      <div class="field"><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email" maxlength="200" inputmode="email" required></div>
      <p class="data-note">E-mail použijem na vytvorenie a doručenie vyžiadaného plánu. <a href="https://valyra.sk/PrivacyPolicy" target="_blank" rel="noopener">Ako spracúvam údaje</a>.</p>
      <label class="consent"><input id="marketingConsent" type="checkbox"><span>Chcem dostať aj jeden nadväzujúci e-mail od Jána s tipom a možnosťou nezáväznej konzultácie. Odhlásiť sa môžem jedným klikom.</span></label>
      <div class="error" id="leadError" role="alert" aria-live="polite"></div>
      <button class="primary" id="submitLead" type="submit">Zobraziť môj 7-dňový plán</button>
    </form>`, 4);
  document.getElementById('leadForm').addEventListener('submit', submitLead);
  bindBack(renderReadiness);
  track('V2Step', { step: 4, screen: 'email' });
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
  const payload = {
    name, email, score: null, maxScore: null,
    band: '7-dňový štartovací plán',
    bandName: `Tvoja brzda: ${problemLabel}`,
    baseSegment: state.problem,
    history: state.history,
      readiness: state.readiness,
      segment: `${state.problem}|${state.history}|${state.readiness}`,
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
  const relapse = state.history === 'viackrat' || state.history === 'jojo';
  let cta = state.readiness === 'podpora'
    ? {
        title: 'Poďme to nastaviť priamo na teba.',
        text: 'Vyber si termín bezplatného 15-minútového hovoru. Prejdeme tvoju hlavnú brzdu a povieme si prvú konkrétnu úpravu.',
        label: 'Vybrať termín bezplatného hovoru',
        className: 'primary calendar-button',
      }
    : state.readiness === 'informacie'
    ? {
        title: 'Najprv si pokojne prejdi svoj plán.',
        text: 'Ak zatiaľ iba zisťuješ, nemusíš sa teraz rozhodovať. Keď budeš chcieť prejsť svoju situáciu osobne, termíny nájdeš tu.',
        label: 'Pozrieť voľné termíny',
        className: 'calendar-link-soft',
      }
    : {
        title: 'Chceš sa spýtať na svoj plán?',
        text: 'Na nezáväznom 15-minútovom hovore si prejdeme, ako kroky prispôsobiť tvojmu režimu, chutiam a možnostiam.',
        label: 'Chcem sa spýtať na svoj plán',
        className: 'primary calendar-button',
      };
  const todayStep = plan.days[0];
  if (state.readiness === 'podpora') cta = { ...cta, label: 'Vybrať termín pre moje vedenie' };
  else if (state.readiness === 'plan') cta = { ...cta, label: `Spýtať sa na: ${plan.title.toLowerCase()}` };
  else if (state.problem === 'vecerne-chute') cta = { ...cta, label: 'Pomôcť s večernými chuťami' };
  else if (state.problem === 'nemam-cas') cta = { ...cta, label: 'Nastaviť plán pre môj čas' };
  else if (state.problem === 'nevydrzim') cta = { ...cta, label: 'Nastaviť plán, ktorý vydržím' };
  app.innerHTML = `${brand()}<section class="result">
    <div class="result-head"><div class="eyebrow">Tvoj plán je hotový</div><h2>${escapeHtml(state.name)}, toto je tvoj najbližší týždeň.</h2><p>Nepridávaj si k nemu ďalších desať pravidiel. Každý deň sprav iba jednu vec.</p></div>
    <div class="diagnosis"><small>Tvoja hlavná brzda</small><h3>${plan.title}</h3><p>${plan.insight}${relapse ? ' Keďže sa ti kilá už vracali, najdôležitejší bude šiesty deň: návrat bez trestu a bez čakania na nový pondelok.' : ''}</p></div>
    <div class="personal-preview"><small>Sprav dnes</small><strong>${todayStep[0]}</strong><p>${todayStep[1]}</p></div>
    <div class="days">${plan.days.map((d, i) => `<article class="day"><div class="day-num">${i + 1}</div><div><strong>${d[0]}</strong><p>${d[1]}</p></div></article>`).join('')}</div>
    <p class="micro">Plán som poslal aj na <strong>${escapeHtml(state.email)}</strong>. Ak ho nevidíš, skontroluj priečinok Spam alebo Hromadné.</p>
    <section class="coach-offer" id="help">
      <div class="eyebrow">Bezplatná úvodná konzultácia</div>
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
        <a class="${cta.className}" id="calendarCta" href="${CONFIG.CALENDAR}" target="_blank" rel="noopener">${cta.label}</a>
        <p class="offer-micro">Hovor je bezplatný a bez záväzku. Ak si potom vyskúšaš osobné vedenie, prvých 7 dní neplatíš nič. Až potom sa rozhodneš, či pokračuješ ďalších 7 týždňov za 150 €.</p>
      </div>
    </section>
  </section>`;
  document.getElementById('calendarCta').addEventListener('click', recordCalendarIntent);
  track('ViewContent', { content_name: 'v2-seven-day-plan', segment: state.problem });
}

function recordCalendarIntent() {
  const repeated = state.history === 'viackrat' || state.history === 'jojo';
  const payload = {
    typ: 'cesta', leadId: state.leadId, selectedPath: 'calendar',
    readiness: state.readiness,
    tier: state.readiness === 'podpora' || repeated || state.problem === 'potrebujem-podporu' ? 'hot' : state.readiness === 'informacie' ? 'cold' : 'warm',
    source: CONFIG.SOURCE, creativeId, quizVersion: CONFIG.VERSION,
  };
  fetch(CONFIG.API, { method: 'POST', mode: 'cors', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
  track('ScheduleIntent', { lead_id: state.leadId, readiness: state.readiness, tier: payload.tier });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

renderLanding();

