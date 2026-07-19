/* ============================================================
   Pravda o chudnutí — zber leadov + automatické e-maily
   Google Apps Script (vlož do Rozšírenia → Apps Script v Google Sheete)
   ============================================================ */

const SHEET_NAME = 'Leady';
const FROM_NAME = 'Ján — Valyra';
const VALYRA_URL = 'https://valyra.pro/?utm_source=email&utm_medium=email&utm_campaign=pravda-o-chudnuti';
const REPLY_TO = 'karas.jan2@gmail.com';

/* ---------- PRÍJEM LEADU Z KVÍZU ---------- */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Formio (rezervácia hovoru z fitness kalkulačky) — vlastná vetva, kvízu sa nedotýka
    if (data.source && String(data.source).indexOf('formio') === 0) {
      return handleFormio_(data);
    }

    // Supabase quizLead → len zápis do sheetu (prehľad pre Jána).
    // E-maily posiela Supabase most (bridge_0..7); stĺpce J-L označíme
    // 'SUPABASE', aby ich followUp() nikdy neposlal druhýkrát.
    if (data.mode === 'sheet_only') {
      const lock = LockService.getScriptLock();
      lock.waitLock(20000);
      const s = getSheet_();
      // dedup:true (backfill) — e-mail už v sheete = preskoč, nech sa nič nezdvojí
      if (data.dedup && data.email) {
        const emails = s.getRange(2, 3, Math.max(s.getLastRow() - 1, 1), 1).getValues();
        for (let i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).toLowerCase() === String(data.email).toLowerCase()) {
            lock.releaseLock();
            return ContentService.createTextOutput('ok skip');
          }
        }
      }
      s.appendRow([
        data.ts ? new Date(data.ts) : new Date(),
        data.name || '',
        data.email || '',
        data.score,
        data.maxScore,
        data.bandName || '',
        data.band || '',
        data.segment || '',
        Array.isArray(data.wrong) ? data.wrong.join(' | ') : (data.wrong || ''),
        'SUPABASE',
        'SUPABASE',
        'SUPABASE',
      ]);
      lock.releaseLock();
      return ContentService.createTextOutput('ok');
    }

    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),                    // A: čas
      data.name || '',               // B: meno
      data.email || '',              // C: e-mail
      data.score,                    // D: skóre
      data.maxScore,                 // E: max
      data.bandName || '',           // F: pásmo
      data.band || '',               // G: pásmo (slug)
      data.segment || '',            // H: segment (motivácia)
      (data.wrong || []).join(' | '),// I: chybné otázky
      'ÁNO',                         // J: e-mail 1 (vyhodnotenie) — posiela sa hneď
      '',                            // K: e-mail 2 (deň 2)
      '',                            // L: e-mail 3 (deň 5)
    ]);
    const row = sheet.getLastRow();

    // E-mail 1 leadovi — ak zlyhá (kvóta, plné úložisko…), zapíše sa to do sheetu
    let mailErr = '';
    try {
      sendEmail1_(data);
    } catch (err) {
      mailErr = String(err);
      sheet.getRange(row, 10).setValue('CHYBA: ' + mailErr);
    }

    // Notifikácia Jánovi o novom leade
    try {
      MailApp.sendEmail({
        to: REPLY_TO,
        name: FROM_NAME,
        subject: '🎯 Nový lead z kvízu: ' + (data.name || '?') + ' (' + (data.email || '?') + ')',
        body:
          'Meno: ' + (data.name || '') +
          '\nE-mail: ' + (data.email || '') +
          '\nSkóre: ' + data.score + '/' + data.maxScore + ' — ' + (data.bandName || '') +
          '\nSegment: ' + (data.segment || '') +
          '\nChybné otázky: ' + ((data.wrong || []).join(' | ') || '—') +
          (mailErr ? '\n\n⚠️ POZOR: vyhodnocovací e-mail leadovi ZLYHAL: ' + mailErr : ''),
      });
    } catch (e2) {}

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message);
  }
}

/* ---------- FORMIO: REZERVÁCIA HOVORU ---------- */
const FORMIO_SHEET = 'Formio rezervácie';

function handleFormio_(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(FORMIO_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(FORMIO_SHEET);
    sheet.appendRow(['Čas', 'Meno', 'Telefón', 'Kedy volať', 'Z kalkulačky', 'Zdroj', 'Zavolané?']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
    new Date(),
    d.name || '',
    d.phone || '',
    d.preferredTime || '',
    d.summary || '',
    d.source || '',
    '',
  ]);
  MailApp.sendEmail({
    to: REPLY_TO,
    subject: '📞 Nová rezervácia hovoru: ' + (d.name || '?') + ' (' + (d.phone || '?') + ')',
    body:
      'Meno: ' + (d.name || '') +
      '\nTelefón: ' + (d.phone || '') +
      '\nKedy volať: ' + (d.preferredTime || '') +
      '\n\n' + (d.summary || '') +
      '\n\nZdroj: ' + (d.source || ''),
    name: FROM_NAME,
  });
  return ContentService.createTextOutput('ok');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Čas', 'Meno', 'E-mail', 'Skóre', 'Max', 'Pásmo', 'Pásmo (slug)', 'Segment', 'Chybné otázky', 'E-mail 1', 'E-mail 2', 'E-mail 3']);
  }
  return sheet;
}

/* ---------- E-MAIL 1: VYHODNOTENIE + 3 TIPY (hneď) ---------- */
function sendEmail1_(data) {
  const tips = tipsForBand_(data.band);
  const wrongBlock = (data.wrong && data.wrong.length)
    ? `\nKde ťa mýty dobehli:\n${data.wrong.map(q => '• ' + q).join('\n')}\n\nSprávne odpovede si videla priamo v kvíze — a nižšie máš tipy, ktoré na ne nadväzujú.\n`
    : '\nPrešla si kvízom bez jedinej chyby — klobúk dole! O to viac platí, že tvoja brzda nie sú vedomosti.\n';

  const body =
`Ahoj ${data.name},

tu je tvoje vyhodnotenie kvízu Pravda o chudnutí:

TVOJE SKÓRE: ${data.score} z ${data.maxScore} — ${data.bandName}
${wrongBlock}
3 TIPY PRESNE PRE TEBA:

1. ${tips[0]}

2. ${tips[1]}

3. ${tips[2]}

Začni tipom č. 1 — už tento týždeň. Malý krok, ktorý reálne spravíš, porazí dokonalý plán, ktorý ostane v hlave.

A ak chceš svoj výsledok prebrať osobne, stačí odpovedať na tento e-mail. Čítam každú správu.

Ján
tréner a výživový poradca
(sám som schudol 45 kg — z 133 na 88 — a držím si to už 8 rokov)

P.S. Ak už nechceš odo mňa dostávať e-maily, odpíš STOP a vymažem ťa.`;

  MailApp.sendEmail({
    to: data.email,
    subject: `${data.name}, tvoje vyhodnotenie: ${data.score}/${data.maxScore} — ${data.bandName}`,
    body: body,
    name: FROM_NAME,
    replyTo: REPLY_TO,
  });
}

function tipsForBand_(band) {
  const TIPS = {
    zaciatocnicka: [
      'Prestaň hľadať zázračnú diétu. Jediné, čo rozhoduje, je kalorický deficit — a najjednoduchší začiatok je zmenšiť porcie o pätinu a vynechať sladené nápoje. Žiadne zakázané potraviny, žiadne hladovanie.',
      'Pi 2–3 litre denne. Znie to banálne, ale veľká časť „hladu" počas dňa je v skutočnosti smäd. Daj si pohár vody vždy, keď dostaneš chuť na niečo mimo jedla.',
      'Zabudni na „od pondelka nasadím režim". Vyber si JEDNU zmenu (napr. raňajky s bielkovinami) a drž ju 2 týždne. Návyky vyhrávajú nad odhodlaním — odhodlanie vydrží tri dni, návyk roky.',
    ],
    pokrocila: [
      'Prestaň sa vážiť každý deň. Váž sa raz týždenne ráno + raz mesačne si zmeraj obvody (pás, boky, stehno). Denné výkyvy váhy sú voda a stres — a zbytočne ti ničia motiváciu.',
      'Daj bielkoviny do každého jedla (tvaroh, vajcia, mäso, ryby, strukoviny). Bielkoviny najviac zasýtia, chránia svaly pri chudnutí a znížia večerné chute — najčastejší dôvod, prečo sa deficit rozpadne.',
      'Naplánuj si 3 hlavné jedlá deň vopred. Nie celý jedálniček na mesiac — len zajtrajšok. Keď je rozhodnuté vopred, večerná unavená hlava nemusí bojovať s chladničkou.',
    ],
    expertka: [
      'Tvoj problém nie je „čo", ale „ako pravidelne". Zaveď si nedeľnú prípravu: 30 minút plánovania jedál a nákupu na týždeň. Systém porazí motiváciu zakaždým.',
      'Sprav si 14-dňový úprimný tracking — všetko, čo zješ, vrátane ochutnávok pri varení a dojedania po deťoch. U žien, ktoré „jedia zdravo a nechudnú", sa takmer vždy nájde 300–500 skrytých kalórií denne.',
      'Zaobstaraj si zodpovednosť. Kamarátka, skupina alebo kouč — komu sa raz týždenne „hlásiš". Vedomosti máš, ale samota pri chudnutí je najčastejší dôvod, prečo to po 3 týždňoch vyhasne.',
    ],
  };
  return TIPS[band] || TIPS.pokrocila;
}

/* ---------- FOLLOW-UP: deň 2 a deň 5 ----------
   Nastav časovú spúšť (trigger): funkcia followUp, denne, napr. o 9:00 */
function followUp() {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < rows.length; i++) {
    const [ts, name, email, score, max, bandName, band, segment, , , mail2, mail3] = rows[i];
    if (!email) continue;
    const days = (now - new Date(ts)) / (1000 * 60 * 60 * 24);

    if (days >= 2 && !mail2) {
      sendEmail2_(name, email);
      sheet.getRange(i + 1, 11).setValue('ÁNO');
    }
    if (days >= 5 && !mail3) {
      sendEmail3_(name, email, band);
      sheet.getRange(i + 1, 12).setValue('ÁNO');
    }
  }
}

/* E-mail 2 (deň 2): tvoj príbeh + mäkké CTA na Valyru */
function sendEmail2_(name, email) {
  const body =
`Ahoj ${name},

pred ôsmimi rokmi som mal 133 kíl.

Skúsil som všetko, čo ti napadne — krabičky, detoxy, „od pondelka nový život". Vždy to vydržalo pár týždňov a potom prišiel návrat. Aj s úrokmi.

Zlomilo sa to až vtedy, keď som prestal hľadať dokonalú diétu a postavil si systém: jednoduché jedlá, ktoré mi chutia, pohyb, ktorý ma baví, a plán, ktorý prežije aj zlý deň. Schudol som 45 kg — a čo je dôležitejšie, držím si to dodnes.

Presne tento prístup som vložil do Valyry: plán šitý na tvoj život + reálny kouč (ja), ktorý ťa nenechá spadnúť, keď príde ten zlý týždeň. Lebo príde — a práve vtedy sa rozhoduje.

Prvých 7 dní máš zadarmo, bez záväzkov:
${VALYRA_URL}

Ján

P.S. Ak máš otázku, odpíš na tento e-mail. Odpovedám osobne.
P.P.S. Nechceš už e-maily? Odpíš STOP.`;

  MailApp.sendEmail({
    to: email,
    subject: `${name}, ako som schudol 45 kg (a prečo to nebola diéta)`,
    body: body,
    name: FROM_NAME,
    replyTo: REPLY_TO,
  });
}

/* E-mail 3 (deň 5): námietky + pozvánka na konzultáciu */
function sendEmail3_(name, email, band) {
  const body =
`Ahoj ${name},

môžem byť na chvíľu úprimný?

Väčšina žien, ktoré si spravili môj kvíz, už niekedy chudnúť skúšala. A väčšine to na čas aj vyšlo — kým neprišla chorá dcéra, náročný týždeň v práci alebo len obyčajná únava. Potom prvé „výnimky", potom výčitky, potom „aj tak to nemá zmysel".

Ak to poznáš: nie je to slabá vôľa. Je to chýbajúci systém a chýbajúca podpora. Sila vôle je batéria — vybije sa. Systém beží ďalej.

Preto ti ponúkam dve cesty:

1. Vyskúšaj Valyru na 7 dní zadarmo — plán na mieru + ja ako tvoj kouč:
${VALYRA_URL}

2. Alebo mi jednoducho odpíš na tento e-mail slovom „KONZULTÁCIA" a pár slovami napíš, čo ti doteraz nefungovalo. Pozriem sa na to a odpíšem ti osobne — zadarmo, bez háčika.

Nech si vyberieš čokoľvek (aj keď nič), držím ti palce. Ale nenechaj to len tak vyhasnúť — o pol roka budeš rada, že si dnes spravila prvý krok.

Ján

P.S. Nechceš už e-maily? Odpíš STOP.`;

  MailApp.sendEmail({
    to: email,
    subject: `${name}, nie je to o vôli (a mám pre teba návrh)`,
    body: body,
    name: FROM_NAME,
    replyTo: REPLY_TO,
  });
}

/* ---------- TEST: spusti túto funkciu na skúšku ---------- */
function testEmail1() {
  sendEmail1_({
    name: 'Janko',
    email: REPLY_TO,
    score: 4,
    maxScore: 9,
    band: 'pokrocila',
    bandName: 'Bojovníčka s polovičnou mapou',
    wrong: ['Detoxikačné čaje a šťavy čistia telo od toxínov.'],
  });
}
