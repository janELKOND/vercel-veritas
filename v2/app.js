const CONFIG = {
  API: 'https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead',
  PIXEL: '2221207801987418',
  SOURCE: 'funnel-v2',
  VERSION: 7,
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

const state = { step: 0, problem: '', history: '', readiness: '', name: '', email: '', leadId: '', breakPoint: '', sent: false };
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
        <div class="eyebrow">Najprv si ma vyskúšaj</div>
        <p><strong>Po pláne môžeš ísť na bezplatnú úvodnú konzultáciu.</strong> Ak zistíme, že ti viem pomôcť, prvých 7 dní môjho 2-mesačného vedenia cez Valyru dostaneš úplne zdarma.</p>
        <p><strong>Prvý týždeň neplatíš nič a nepotrebujem tvoju kartu.</strong> Až po siedmich dňoch sa rozhodneš: skončíš bez poplatku alebo pokračuješ ďalších 7 týždňov za 150 €.</p>
      </div>
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
  app.innerHTML = shell(`<div class="eyebrow">Tvoja hlavná brzda</div><h2>Čo ti to kazí najviac?</h2><p class="question-note">Vyber jednu možnosť, ktorá najlepšie sedí na bežný týždeň.</p><div class="options">${PROBLEMS.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 1);
  bindOptions('problem', renderHistory);
  track('V2Step', { step: 1, screen: 'problem' });
}

function renderHistory() {
  state.step = 2;
  app.innerHTML = shell(`<div class="eyebrow">Tvoja skúsenosť</div><h2>Koľkokrát sa ti kilá vrátili?</h2><p class="question-note">Odpoveď určí, či plán postavíme viac na štarte alebo na udržaní výsledku.</p><div class="options">${HISTORIES.map(x => `<button class="option" data-value="${x.value}">${x.label}</button>`).join('')}</div>`, 2);
  bindOptions('history', renderReadiness);
  track('V2Step', { step: 2, screen: 'history' });
}

function renderReadiness() {
  state.step = 3;
  app.innerHTML = shell(`<div class="eyebrow">Tvoj ďalší krok</div><h2>Ako chceš pokračovať?</h2><p class="question-note">Pomôže mi ukázať ti správnu možnosť — bez nátlaku.</p><div class="options"><button class="option" data-value="podpora"><strong>Chcem začať čo najskôr</strong><small>Chcem, aby ma niekto viedol a bol pri tom so mnou.</small></button><button class="option" data-value="plan"><strong>Najprv si prejdem plán</strong><small>Chcem konkrétne kroky a potom sa rozhodnem.</small></button><button class="option" data-value="informacie"><strong>Zatiaľ iba zisťujem</strong><small>Chcem si doplniť informácie bez rozhodnutia.</small></button></div>`, 3);
  bindOptions('readiness', renderGate);
  track('V2Step', { step: 3, screen: 'readiness' });
}

function bindOptions(key, next) {
  document.querySelectorAll('.option[data-value]').forEach(btn => btn.addEventListener('click', () => {
    state[key] = btn.dataset.value;
    next();
  }));
}

function renderGate() {
  state.step = 4;
  app.innerHTML = shell(`<div class="eyebrow">Tvoj plán je pripravený</div><h2>Kam ti ho mám poslať?</h2><p class="question-note">Hneď ho uvidíš aj tu. Pošlem ti ho aj e-mailom — zostane ti poruke.</p>
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
      readiness: state.readiness,
      segment: `${state.problem}|${state.history}|${state.readiness}`,
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
      <h3>Nemusíš zisťovať sama, prečo sa ti to stále vracia.</h3>
      <p>Na krátkej konzultácii prejdeme tvoju hlavnú brzdu a nájdeme prvú úpravu, ktorá sedí do tvojho reálneho života. Konzultácia je bezplatná a bez záväzku.</p>
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
      <div class="package-intro">
        <small>Vyberieme riešenie podľa toho, koľko podpory potrebuješ</small>
        <strong>Najviac odporúčam osobné vedenie. Najprv si ho však bez rizika vyskúšaš.</strong>
      </div>
      <article class="main-program">
        <div class="main-program-head"><div><div class="free-badge">Odporúčaná voľba</div><span class="package-kicker">Osobné vedenie · 8 týždňov</span><h4>Prvých 7 dní neplatíš nič</h4></div><div class="main-price"><strong>0 €</strong><span>bez karty<br>a bez záväzku</span></div></div>
        <p>Najprv si na vlastnej koži overíš, ako vyzerá vedenie, ktoré sa prispôsobuje tebe — nie ty programu.</p>
        <div class="trial-title">Čo spolu spravíme počas prvého týždňa:</div>
        <div class="trial-steps">
          <div><b>1</b><span><strong>Úvodná konzultácia</strong>Prejdeme cieľ, režim a hlavnú brzdu.</span></div>
          <div><b>2</b><span><strong>Plán na mieru</strong>Nastavím stravu a pohyb, ktoré reálne zvládneš.</span></div>
          <div><b>3</b><span><strong>Vedenie cez Valyru</strong>Uvidíš úlohy, pokrok a budeš vedieť, čo robiť ďalej.</span></div>
          <div><b>4</b><span><strong>Kontrola a prvá úprava</strong>Podľa hladu, energie a reality plán upravíme.</span></div>
        </div>
        <div class="adaptive-offer"><strong>Program sa mení spolu s tebou.</strong><span>Keď sa zmení tvoj režim, výsledky, hlad, energia, práca alebo rodinné povinnosti, upravíme aj stravu a pohyb.</span></div>
        <div class="continue-price"><strong>Po 7 dňoch sa rozhodneš ty.</strong><span>Ak ti vedenie sedí, ďalších 7 týždňov stojí spolu <b>150 €</b>. Ak nie, skončíš bez poplatku.</span></div>
      </article>
      <div class="alternatives-title">Ak nepotrebuješ práve 8 týždňov osobného vedenia</div>
      <div class="alternatives">
        <article class="alternative-card"><div><span class="package-kicker">Samostatný štart · 30 dní</span><h4>Plán na mieru</h4></div><strong class="alt-price">69 €</strong><p>Analýza, kalórie a porcie, jedálniček, pohyb, Valyra a jedna úprava po prvom týždni. Bez pravidelného vedenia.</p></article>
        <article class="alternative-card"><div><span class="package-kicker">Viac času a podpory · 12 týždňov</span><h4>Kompletná premena</h4></div><strong class="alt-price">229 €</strong><p>Pravidelné konzultácie, prioritná komunikácia, riešenie stagnácie a záverečný plán na udržanie výsledku.</p></article>
      </div>
      <button class="primary" id="helpBtn">Chcem vyskúšať 7 dní vedenia zdarma</button>
      <div class="objections"><div><strong>Nemám čas.</strong><span>Preto nastavíme minimum, ktoré sa zmestí do tvojho reálneho dňa.</span></div><div><strong>Nechcem ďalšiu diétu.</strong><span>Nedostaneš zákazový zoznam, ale plán podľa tvojich chutí a režimu.</span></div><div><strong>Čo ak to vzdám?</strong><span>Slabší deň nie je koniec — plán upravíme a pokračuješ ďalším krokom.</span></div></div>
      <p class="offer-micro">Nemusíš vedieť, ktorý balíček potrebuješ. Najprv si prejdeme tvoju situáciu — bez platby a bez rozhodnutia naslepo.</p>
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
    <div class="field"><label for="phone">Telefón <span style="font-weight:400">(nepovinné)</span></label><input id="phone" type="tel" inputmode="tel" maxlength="40" placeholder="Ak chceš, aby som ti zavolal"></div>
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
  const phone = document.getElementById('phone').value.trim();
  const note = document.getElementById('note').value.trim();
  const message = [`Praská mi to ${selected.phrase}.`, note].filter(Boolean).join('\n\n');
  const repeated = state.history === 'viackrat' || state.history === 'jojo';
  const payload = {
    typ: 'konzultacia', leadId: state.leadId, name: state.name, email: state.email, phone, message,
    preferredTime: '', segment: state.problem, history: state.history,
    readiness: state.readiness, selectedPath: 'written_consult',
    tier: state.readiness === 'podpora' || repeated || state.problem === 'potrebujem-podporu' ? 'hot' : state.readiness === 'informacie' ? 'cold' : 'warm',
    source: CONFIG.SOURCE, creativeId, band: '7-dňový štartovací plán',
    quizVersion: CONFIG.VERSION, ts: new Date().toISOString(),
  };
  try {
    const res = await fetch(CONFIG.API, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const out = await res.json();
    if (!out || !['message', 'call'].includes(out.kind)) throw new Error('unconfirmed');
    state.sent = true;
    track('Lead', { way: 'message', segment: state.problem, funnel_version: CONFIG.VERSION, value: 25, currency: 'EUR' });
    track('Contact', { content_name: 'v2-personal-help' });
    document.getElementById('contactBox').innerHTML = `<div class="done"><strong>✓ Žiadosť je odoslaná.</strong><br>Prvým krokom je krátky hovor, na ktorom ti odporučím vhodnú formu pomoci. Vyber si termín, ktorý ti vyhovuje:<a class="calendar-cta" id="calendarCta" href="${CONFIG.CALENDAR}" target="_blank" rel="noopener">📞 Vybrať termín 15-min hovoru</a><span class="calendar-note">Rezervácia termínu je nezáväzná. Ak sa rozhodneš pre osobné vedenie, prvých 7 dní si vyskúšaš zdarma.</span></div>`;
    document.getElementById('calendarCta').addEventListener('click', () => track('ScheduleIntent', { lead_id: state.leadId, readiness: state.readiness, tier: payload.tier }));
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

