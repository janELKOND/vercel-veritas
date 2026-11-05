/* ============================================================
   Pravda o chudnutí — voľný kvíz
   Bez e-mailu, bez registrácie, bez merania. Výsledok sa ukáže hneď.
   Lead magnet bol vypnutý 5. 11. 2026: kvíz sa rozdáva ľuďom zadarmo.
   ============================================================ */

const SHARE_URL = 'https://kviz.valyra.sk/';

// ---------- OTÁZKY ----------
// type: 'tf'  = tvrdenie Pravda/Mýtus (so stamp pečiatkou)
// type: 'mc'  = výber z možností
// correct = index správnej možnosti; pri 'tf' 0 = Pravda, 1 = Mýtus
const QUESTIONS = [
  {
    type: 'tf',
    q: 'Ak jem po 18:00, priberám — aj keď mám denný príjem kalórií v poriadku.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Telo nemá večerný spínač na tuk. Rozhoduje <strong>celkový denný príjem energie</strong>, nie hodina na hodinkách. Neskoré jedenie škodí najmä preto, že večer siahame po chipsoch pri telke — nie preto, že je po šiestej.',
  },
  {
    type: 'mc',
    q: 'Koľko cukru je v pohári (250 ml) obyčajného kravského mlieka?',
    options: ['Žiadny — cukor má len sladené mlieko', 'Asi 3 g', 'Asi 12 g', 'Asi 30 g'],
    correct: 2,
    explain: 'Pohár mlieka má okolo <strong>12 g cukru</strong>, teda asi 3 kocky. Je to prírodná laktóza, nie pridaný cukor, a plnotučné aj odtučnené mlieko jej má približne rovnako. Svetová zdravotnícka organizácia ju do limitu voľných cukrov nepočíta, takže mlieko kvôli nej vyraďovať netreba.',
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
    q: 'Hnedý cukor je pri chudnutí zdravšia voľba ako biely.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Hnedý cukor je v podstate <strong>ten istý cukor s trochou melasy</strong>. Kalórií má prakticky rovnako a minerálov v bežnej porcii zanedbateľne málo. Rozhoduje, koľko cukru zješ, nie akú má farbu.',
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
    q: 'Keď málo spím, mám tendenciu viac jesť.',
    correct: 0,
    verdict: 'pravda',
    explain: 'Súhrn 11 štúdií ukázal, že ľudia s kráteným spánkom zjedli v priemere <strong>o 385 kcal denne viac</strong>, pričom ich výdaj energie sa výrazne nezmenil. Spánok teda patrí k chudnutiu rovnako ako jedlo a pohyb.',
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
    q: '100 % ovocný džús sa nepočíta ako cukor, lebo je z ovocia.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Svetová zdravotnícka organizácia počíta cukor z ovocných štiav medzi <strong>voľné cukry</strong>, rovnako ako ten pridaný. Celé ovocie je iný prípad: má vlákninu a viac zasýti. Džús ľahko vypiješ a nezasýti ťa.',
  },
  {
    type: 'tf',
    q: 'Detoxikačné čaje a šťavy čistia telo od toxínov.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Detox už máš v tele zabudovaný zadarmo — volá sa <strong>pečeň a obličky</strong>. Žiadny čaj ich prácu nezrýchli. Ak po „detoxe" schudneš, je to voda a obsah čriev, nie tuk.',
  },
  {
    type: 'tf',
    q: 'Keď mi váha cez noc stúpne o 1 kg, pribudol mi kilogram tuku.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Kilogram tuku predstavuje približne <strong>7 000 kcal navyše</strong> — to sa za jeden večer bežne nezje. Skoky na váhe sú najmä voda, soľ a obsah tráviaceho traktu. Sleduj preto trend za niekoľko týždňov, nie jedno ráno.',
  },
  {
    type: 'mc',
    q: 'Čo má na 1 gram najviac energie?',
    options: ['Bielkoviny', 'Sacharidy', 'Tuk', 'Alkohol'],
    correct: 2,
    explain: '<strong>Tuk má 9 kcal/g</strong>, alkohol 7 kcal/g, bielkoviny aj sacharidy po 4 kcal/g. Tuk preto netreba vyraďovať, len si pri tučných jedlách viac všímať porciu.',
  },
  {
    type: 'tf',
    q: 'Olivový olej a orechy sú zdravé, ale pri chudnutí na ich množstve záleží.',
    correct: 0,
    verdict: 'pravda',
    explain: 'Zdravé neznamená bez kalórií. Polievková lyžica oleja má okolo <strong>100 kcal</strong> a hrsť orechov ešte viac. Patria do jedálnička, len je dobré vedieť, koľko ich v skutočnosti ide na panvicu alebo do šalátu.',
  },
  {
    type: 'mc',
    q: 'Aké je reálne a udržateľné tempo chudnutia?',
    options: ['3–4 kg týždenne', '0,5–1 kg týždenne', 'Aspoň 10 kg mesačne', 'Na tempe nezáleží'],
    correct: 1,
    explain: 'Pre mnohých ľudí je <strong>0,5–1 kg týždenne</strong> rozumné orientačné tempo. Závisí však od východiskovej hmotnosti, zdravia a nastaveného deficitu. Príliš prísne režimy sa zvyčajne horšie dodržiavajú — dlhodobý výsledok stojí najmä na návykoch, ktoré zvládneš udržať.',
  },
];

// Pásma sú podiel správnych odpovedí, aby sa nemuseli meniť pri každej novej otázke.
const BANDS = [
  {
    share: 0.4,
    name: 'Mýty ťa vodia za nos',
    text: 'Nerob si z toho nič — protichodné rady počúvame zo všetkých strán. Teraz už vieš, ako to je naozaj, a to je najlepší základ.',
  },
  {
    share: 0.75,
    name: 'Základ máš, pár mýtov ostalo',
    text: 'Vo väčšine vecí máš jasno. Nižšie si pozri otázky, v ktorých ťa mýty ešte dobehli.',
  },
  {
    share: 1,
    name: 'Teóriu máš v malíčku',
    text: 'Tak ľahko ťa nenachytajú. Pošli kvíz ďalej niekomu, kto ešte verí detoxom.',
  },
];

// ---------- STAV ----------
const state = {
  index: 0,
  answers: [], // { q, correct, right, explain }
};

const app = document.getElementById('app');
const progressTrack = document.getElementById('progressTrack');
const progressFill = document.getElementById('progressFill');

// ---------- OBRAZOVKY ----------
function introHookHtml() {
  return `
      <div class="q-hook">
        <div class="eyebrow">Kvíz · ${QUESTIONS.length} otázok · bez registrácie</div>
        <h1>Pravda o chudnutí: si v obraze, alebo veríš <span class="flip">mýtom?</span></h1>
        <p class="lead">Po každej odpovedi sa hneď dozvieš, ako to je naozaj. Začni prvou otázkou:</p>
      </div>`;
}

function creditHtml() {
  return '<p class="footnote">Kvíz pripravil Ján Karas, tréner a výživový poradca.</p>';
}

function updateProgress(step) {
  progressTrack.hidden = false;
  progressFill.style.width = `${Math.round((step / QUESTIONS.length) * 100)}%`;
}

function optionLabels(item) {
  return item.type === 'tf' ? ['Pravda', 'Mýtus'] : item.options;
}

function showQuestion() {
  const i = state.index;
  const item = QUESTIONS[i];
  const isFirst = i === 0;
  if (isFirst) progressTrack.hidden = true;
  else updateProgress(i);

  app.innerHTML = `
    <section class="question-screen${isFirst ? ' first' : ''}">
      ${isFirst ? introHookHtml() : ''}
      <div class="step-label">Otázka ${i + 1} z ${QUESTIONS.length}</div>
      <h2>${item.q}</h2>
      <div class="options" id="options">
        ${optionLabels(item).map((o, idx) => `<button class="option" data-idx="${idx}">${o}</button>`).join('')}
      </div>
      <div id="revealSlot"></div>
      ${isFirst ? creditHtml() : ''}
    </section>
  `;

  document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => answer(parseInt(btn.dataset.idx, 10)));
  });
}

function answer(chosenIdx) {
  const item = QUESTIONS[state.index];
  const isCorrect = chosenIdx === item.correct;
  state.answers.push({
    q: item.q,
    correct: isCorrect,
    right: optionLabels(item)[item.correct],
    explain: item.explain,
  });

  document.querySelectorAll('.option').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === item.correct) btn.classList.add('correct');
    else if (idx === chosenIdx) btn.classList.add('wrong');
    else btn.classList.add('dim');
  });

  const stamp = item.type === 'tf'
    ? `<div class="stamp ${item.verdict}">${item.verdict === 'mytus' ? 'Mýtus' : 'Pravda'}</div>`
    : '';

  const verdictLine = isCorrect
    ? '<div class="verdict ok">✓ Presne tak!</div>'
    : '<div class="verdict miss">Tentoraz nie — ale teraz to už vieš:</div>';

  const isLast = state.index === QUESTIONS.length - 1;
  document.getElementById('revealSlot').innerHTML = `
    <div class="reveal">
      ${stamp}
      ${verdictLine}
      <p>${item.explain}</p>
      <div class="btn-row">
        <button class="btn" id="nextBtn">${isLast ? 'Pozrieť výsledok' : 'Ďalšia otázka'}</button>
      </div>
    </div>
  `;

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
  nextBtn.addEventListener('click', () => {
    state.index++;
    if (state.index < QUESTIONS.length) showQuestion();
    else showResult();
    window.scrollTo(0, 0);
  });
}

function bandFor(score) {
  const share = score / QUESTIONS.length;
  return BANDS.find(b => share <= b.share);
}

function recapHtml(missed) {
  if (!missed.length) {
    return `
      <div class="recap">
        <h3>Bez jedinej chyby</h3>
        <div class="recap-item"><strong>Plný počet bodov.</strong> Klobúk dole.</div>
      </div>`;
  }
  return `
      <div class="recap">
        <h3>Kde ťa mýty dobehli</h3>
        ${missed.map(m => `
        <div class="recap-item">
          <strong>${m.q}</strong>
          <span class="recap-right">Správne: ${m.right}</span>
          <p class="recap-explain">${m.explain}</p>
        </div>`).join('')}
      </div>`;
}

function showResult() {
  progressTrack.hidden = true;
  const total = QUESTIONS.length;
  const score = state.answers.filter(a => a.correct).length;
  const missed = state.answers.filter(a => !a.correct);
  const band = bandFor(score);

  app.innerHTML = `
    <section class="result">
      <div class="score-hero">
        <div class="score-num">${score}<small> / ${total}</small></div>
        <div class="score-breakdown">
          <span>✓ Správne: <strong>${score}</strong></span>
          <span>✕ Nesprávne: <strong>${missed.length}</strong></span>
        </div>
        <div class="typology">${band.name}</div>
      </div>
      <p class="verdict-text">${band.text}</p>
      ${recapHtml(missed)}
      <button class="btn" id="shareBtn">Poslať kvíz ďalej</button>
      <p class="retry-line"><button class="link-btn" id="againBtn">Skúsiť kvíz znova</button></p>
      ${creditHtml()}
    </section>
  `;

  document.getElementById('shareBtn').addEventListener('click', () => share(score, total));
  document.getElementById('againBtn').addEventListener('click', () => {
    state.index = 0;
    state.answers = [];
    showQuestion();
    window.scrollTo(0, 0);
  });
}

async function share(score, total) {
  const text = `Mám ${score} z ${total} v kvíze Pravda o chudnutí. Koľko dáš ty?`;
  const btn = document.getElementById('shareBtn');

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Pravda o chudnutí', text, url: SHARE_URL });
    } catch (error) {
      // Zrušené zdieľanie nie je chyba, človek si to len rozmyslel.
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
    btn.textContent = 'Odkaz je skopírovaný ✓';
  } catch (error) {
    btn.textContent = SHARE_URL;
  }
}

// ---------- SERVICE WORKER ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}

// ---------- ŠTART ----------
showQuestion();
