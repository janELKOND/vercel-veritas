/* ============================================================
   Pravda o chudnutí — voľný kvíz
   Bez e-mailu, bez registrácie. Výsledok sa ukáže hneď.
   Meranie: len anonymná Vercel Web Analytics (virtuálne stránky, viď mark()).
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
    q: 'Ak jem po 18:00, automaticky priberám — aj keď mám denný príjem kalórií v poriadku.',
    correct: 1,
    verdict: 'mytus',
    explain: 'O priberaní nerozhoduje jedna hodina na hodinkách, ale <strong>dlhodobá energetická bilancia</strong>. Čas jedla však nie je úplne bez vplyvu: v malej kontrolovanej štúdii so 16 ľuďmi zvýšilo neskoré jedenie hlad a znížilo výdaj asi o 60 kcal počas bdelého dňa, hoci kalórie boli rovnaké.',
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
    explain: 'Súhrn <strong>13 štúdií s 1 158 účastníkmi</strong> nenašiel, že by tréning konkrétnej partie znižoval tuk práve na nej. Brušáky posilnia svaly, no to, odkiaľ tuk ubúda, cvikom neriadiš.',
  },
  {
    type: 'mc',
    q: 'Koľko minút rezkej chôdze potrebuješ na spálenie jednej 100 g tabuľky mliečnej čokolády?',
    options: ['Asi 20 minút', 'Asi 45 minút', 'Asi 90 minút', 'Asi 4 hodiny'],
    correct: 2,
    explain: 'Tabuľka mliečnej čokolády má okolo <strong>535 kcal</strong>. To zodpovedá približne 70–110 minútam rezkej chôdze pri hmotnosti 60–90 kg. Pointa nie je trestať sa pohybom za jedlo, ale vedieť, že energiu prijmeme oveľa rýchlejšie, než ju pohybom vydáme.',
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
    explain: 'Svaly a tuk sú <strong>rozdielne tkanivá</strong> a svalová bunka sa na tukovú nemení. Bez tréningu svaly postupne ubúdajú. Ak ostane jedálniček rovnaký, tuk môže pribúdať. Vyzerá to ako premena, ale sú to dva samostatné procesy.',
  },
  {
    type: 'tf',
    q: 'Keď málo spím, mám tendenciu viac jesť.',
    correct: 0,
    verdict: 'pravda',
    explain: 'Súhrn 11 menších štúdií ukázal, že ľudia s kráteným spánkom zjedli v priemere <strong>o 385 kcal denne viac</strong>, pričom sa ich výdaj energie výrazne nezmenil. Spánok preto pri chudnutí nie je vedľajšia vec.',
  },
  {
    type: 'tf',
    q: 'Čím viac sa pri cvičení potím, tým viac tuku spaľujem.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Pot slúži najmä na <strong>ochladzovanie tela</strong>. Zapotíš sa aj v saune, no úbytok váhy po nej je z veľkej časti tekutina. Podobne je to po spotenom tréningu: po napití sa váha vráti. Pre tuk je dôležitá energetická bilancia, nie mokré tričko.',
  },
  {
    type: 'mc',
    q: 'Čo u väčšiny ľudí spáli za deň viac energie?',
    options: ['Hodinový tréning v posilňovni', 'Bežný pohyb počas dňa (chôdza, schody, domácnosť)', 'Je to presne rovnaké', 'Ani jedno — rozhoduje len strava'],
    correct: 1,
    explain: '<strong>Bežný pohyb počas dňa</strong> môže medzi ľuďmi podobnej postavy robiť rozdiel až 2 000 kcal denne, najmä podľa práce. Tréning je užitočný, ale aktívny nešportovec môže vydať viac energie než človek, ktorý si zacvičí a zvyšok dňa presedí.',
  },
  {
    type: 'tf',
    q: '100 % ovocný džús sa nepočíta ako cukor, lebo je z ovocia.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Svetová zdravotnícka organizácia počíta cukor z ovocných štiav medzi <strong>voľné cukry</strong>, rovnako ako ten pridaný. Celé ovocie je iný prípad: v štúdii sýtilo celé jablko viac než jablkový džús.',
  },
  {
    type: 'tf',
    q: 'Detoxikačné čaje a šťavy čistia telo od toxínov.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Odpadové látky telo odstraňuje samo, najmä cez <strong>pečeň a obličky</strong>. Pre komerčné detoxy chýbajú kvalitné štúdie, že toxíny naozaj odstraňujú. Prípravky s preháňadlami alebo diuretikami môžu navyše uškodiť.',
  },
  {
    type: 'tf',
    q: 'Keď mi váha cez noc stúpne o 1 kg, pribudol mi kilogram tuku.',
    correct: 1,
    verdict: 'mytus',
    explain: 'Kilogram tukového tkaniva nesie približne <strong>7 700–8 200 kcal</strong> energie, takže taký prírastok tuku cez noc bežne nepribudne. Krátkodobé skoky spôsobuje najmä voda, jedlo v tráviacom trakte, soľ, sacharidy alebo hormonálne zmeny. Sleduj preto trend za niekoľko týždňov, nie jedno ráno.',
  },
  {
    type: 'mc',
    q: 'Čo má na 1 gram najviac energie?',
    options: ['Bielkoviny', 'Sacharidy', 'Tuk', 'Alkohol'],
    correct: 2,
    explain: 'Pri výpočte energie na etiketách v EÚ má <strong>tuk 9 kcal/g</strong>, alkohol 7 kcal/g, bielkoviny aj sacharidy po 4 kcal/g. Tuk preto netreba vyraďovať, len si pri tučných jedlách viac všímať porciu.',
  },
  {
    type: 'tf',
    q: 'Olivový olej a orechy sú zdravé, ale pri chudnutí na ich množstve záleží.',
    correct: 0,
    verdict: 'pravda',
    explain: 'Zdravé neznamená bez kalórií. Polievková lyžica oleja (14 g) má okolo <strong>120 kcal</strong> a aj orechy sú energeticky husté. Patria do jedálnička, len je dobré vedieť, koľko ich naozaj skončí na panvici alebo v šaláte.',
  },
  {
    type: 'mc',
    q: 'Aké je reálne a udržateľné tempo chudnutia?',
    options: ['3–4 kg týždenne', '0,5–1 kg týždenne', 'Aspoň 10 kg mesačne', 'Na tempe nezáleží'],
    correct: 1,
    explain: 'Britská NHS odporúča pri chudnutí <strong>0,5–1 kg týždenne</strong>. Vhodné tempo však závisí od východiskovej hmotnosti, zdravia a prípadnej liečby. Príliš prísne režimy sa zvyčajne horšie dodržiavajú.',
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

// ---------- MERANIE ----------
// Vercel Web Analytics: kroky kvízu sa zapisujú ako virtuálne stránky, lebo vlastné
// eventy sú len na Pro pláne. V Analytics → Pages sa dá prečítať lievik:
//   /  →  /kviz/start (prvá odpoveď)  →  /kviz/vysledok (dokončený)  →  /kviz/zdielanie
// Každý krok sa zapíše najviac raz za načítanie stránky, opakovanie kvízu ho nezdvojí.
const marked = new Set();
function mark(step) {
  if (marked.has(step)) return;
  marked.add(step);
  try {
    if (typeof window.va === 'function') window.va('pageview', { path: `/kviz/${step}` });
  } catch (error) {
    // Meranie nesmie nikdy rozbiť kvíz.
  }
}

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
  return '<p class="footnote">Kvíz pripravil Ján Karas, tréner a výživový poradca. Slúži na vzdelávanie a nenahrádza radu lekára.</p>';
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
  if (state.index === 0) mark('start');
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
  mark('vysledok');

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
  mark('zdielanie');

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
