# Veritas kvíz — plán opráv lievika

**Stav:** návrh, nezačaté
**Vytvorené:** 23. 7. 2026

> **Poznámka k tomuto dokumentu:** repo je verejné, preto tu nie sú žiadne kontakty
> leadov, ID Google Sheetu ani ID ad účtu. Tie sú v Sheete a v Ads Manageri.

---

## 0. Kontext — odkiaľ sa čísla berú

Reklamné dáta z Meta Marketing API, obdobie 18.–23. 7. 2026.
Dáta o lieviku z Google Sheetu, stav k 22. 7. 2026 19:10.

| Vec | Hodnota |
|---|---|
| Kampaň | `120248696552820194` „New Leads Campaign Kviz – pravda o chudnuti" |
| Ad set | `120248696552830194` „Kviz – CompleteRegistration" |
| Reklama | `120248696552840194` „Kviz – reklama 1" |
| Rozpočet | 6 €/deň (CBO), objective `OUTCOME_LEADS`, optimalizácia na CompleteRegistration |
| Pixel ad účtu | `2221207801987418` |
| Druhý pixel | `1529505581872759` (veritas) — **ad účet k nemu NEMÁ prístup** |

**Terminológia — nezamieňať:**

- „lead" v tejto kampani = **dokončený kvíz** = pixel event `CompleteRegistration`. Hovory sa tu nezbierajú.
- Meta „Website leads" = pixel event `Lead` = **rezervácia hovoru**. To je to, čo sa touto úlohou pridáva.

---

## 1. Lievik ako celok — kde tečie

| Krok | Konverzia | Stav |
|---|---|---|
| Impresia → klik | 8,6 % (CTR 11–12 %, CPC 0,02 €) | ✅ nadpriemer |
| **Klik → dokončený kvíz** | **~10 %** (696 klikov → 68 leadov) | 🔴 **diera č. 1** |
| **Lead → registrácia** | **11 %** (100 → 11) | 🔴 **diera č. 2** |
| Registrácia → trial | 82 % (11 → 9) | ✅ |
| Trial → aktívny | 100 % (9 → 9) | ✅ |
| Trial → platiaci | 11 % (9 → 1) | ⏳ predčasné, 8 z 9 ešte beží |

**Ceny za krok:** lead 0,29 € · registrácia 2,64 € · trial 3,22 € · platiaci 29 €

Proti predplatnému 19/49/129 €/mes. je CAC 29 € návratný za ~1,5 mesiaca pri najlacnejšom tarife. Ekonomika teda funguje — ale **jeden platiaci zákazník nie je miera, je to anekdota**. Najspoľahlivejšie číslo je zatiaľ **3,22 € za trial** (n=9).

### Diera č. 1: klik → dokončený kvíz (~10 %)

Deväť z desiatich zaplatených klikov nedôjde na koniec kvízu. Z 21 € za kliky ~19 € nevyprodukovalo nič.

**Kritické: časť tejto diery sa nedá zmerať.** Meta „link click" nie je načítaná stránka. Bez vlastných eventov sa nedá rozlíšiť, či ľudia odpadávajú na pomalom načítaní, na prvej otázke, alebo až na e-mailovom formulári na konci. To sú tri úplne odlišné opravy. **Preto sekcia 4 (meranie) predchádza akejkoľvek oprave kvízu.**

### Diera č. 2: lead → registrácia (11 %)

89 zo 100 ľudí dalo e-mail a nikdy si nezaložilo účet. Nie je to rovnomerné — viď segmenty v sekcii 5.2. Časť tých leadov nie je zachrániteľná (`schudnut`, `navyky`), tie treba prestať kupovať, nie zachraňovať.

**Otvorené: existuje vôbec e-mailová sekvencia?** Ak nie, je to najlacnejšia oprava v systéme.

### Prečo sa opravy oplatí spraviť pred škálovaním

Modelovo na 100 € rozpočtu (projekcia, nie sľub):

| Scenár | Leady | Registrácie | Platiaci | CAC |
|---|---|---|---|---|
| Dnes | 345 | 38 | ~3,4 | 29 € |
| Po oprave kvízu (10 → 20 %) | 690 | 76 | ~7 | 14,50 € |
| + oprava lead → registrácia (11 → 20 %) | 690 | 138 | ~12,5 | 8 € |

Opravy sa **násobia, nie sčítavajú**. Zdvíhať rozpočet pred nimi znamená rýchlejšie liať peniaze do toho istého sita.

---

## 2. Poradie opráv

1. **Zacielenie 45+ a iba feed** (sekcia 3) — 5 minút, bez kódu, hneď lacnejšie leady
2. **Osobné oslovenie dvoch ľudí, ktorí sa zaregistrovali a nedokončili onboarding** (kontakty v Sheete) — 10 minút, dvaja skoro-zákazníci
3. **Dátum ku každému leadu + vyhodenie testov** (sekcia 4.2) — polhodina, odomkne všetky ďalšie analýzy
4. **Eventy v kvíze** (sekcia 4.1) — bez nich zostane diera č. 1 hádankou
5. **E-mailová sekvencia** (sekcia 8), ak ešte neexistuje
6. **Rezervácia konzultácie** (sekcie 5–7)
7. **Až potom** zdvíhať rozpočet

---

## 3. Zacielenie reklamy — bez kódu, priamo v Ads Manageri

### 3.1 Vek: zúžiť na 45+

| Vek | Míňané | Leady | Cena/lead |
|---|---|---|---|
| 25–34 | 8,06 € | 20 | 0,40 € |
| 35–44 | 8,65 € | 21 | 0,41 € |
| **45–54** | 8,15 € | **40** | **0,20 €** |
| 55–64 | 3,63 € | 11 | 0,33 € |
| **65+** | 1,58 € | 11 | **0,14 €** |

56 % rozpočtu ide na 25–44, ktorí dávajú lead za dvojnásobok. Presun na 45+ by pri rovnakých peniazoch dal ~83 leadov namiesto 41.

### 3.2 Umiestnenia: nechať iba feed

| Umiestnenie | Míňané | Leady | Cena/lead |
|---|---|---|---|
| **Feed** | 21,70 € | 83 | **0,26 €** |
| Instagram Reels | 6,19 € | 13 | 0,48 € |
| Threads feed | 0,55 € | 4 | 0,14 € |
| Instagram Stories | 0,87 € | 2 | 0,44 € |
| Facebook Reels | 0,73 € | 1 | 0,73 € |

Reels + Stories zožrali 7,79 € a dali 16 leadov; vo feede by to bolo ~30. Threads je najlacnejší, ale objem je príliš malý na záver — nechať bežať a sledovať.

**Kreatívu nemeniť.** CTR 11–12 % a CPC 0,02 € je nadpriemer, tá časť funguje.

---

## 4. Meranie — predchádza všetkým opravám

Bez tejto sekcie sa všetko ostatné opravuje poslepiačky.

### 4.1 Chýbajúce eventy v kvíze

Dnes sa meria len koniec (`CompleteRegistration`). Doplniť:

| Event | Kedy | Načo |
|---|---|---|
| `PageView` | načítanie landingu | koľko klikov sa vôbec dostane na stránku |
| `ViewContent` / `quiz_start` | zobrazenie prvej otázky | koľko ľudí kvíz vôbec začne |
| `quiz_step` (s číslom otázky) | prechod na ďalšiu otázku | **na ktorej otázke odpadávajú** |
| `quiz_email_shown` | zobrazenie e-mailového formulára | koľko ich dôjde až po formulár |
| `CompleteRegistration` | odoslanie e-mailu (existuje) | lead |

`quiz_step` je z toho najdôležitejší — povie presne, ktorá otázka ľudí odrádza. Ak je to jedna konkrétna, oprava je päťminútová.

Vlastné eventy posielať cez `fbq('trackCustom', 'quiz_step', { krok: 3 })`.

### 4.2 Dáta v Sheete

- **Pridať timestamp ku každému leadu.** Bez neho sa nedajú robiť kohorty a žiadna zmena sa nedá vyhodnotiť. Jeden stĺpec, odomyká všetko ostatné.
- **Zjednotiť formát segmentu.** Sheet dnes obsahuje dva naraz: jednoduchý (`vecerne-chute`) a zložený (`vecerne-chute|hned|plan`). Zložené sú zrejme novšie, ale bez timestampu sa to nedá overiť ani férovo porovnať.
- **Filtrovať testovacie záznamy** — e-maily obsahujúce `+test` (v dátach z 22. 7. bol jeden, počítaný medzi 100 leadmi).

### 4.3 Dva pixely

Event `Lead` **musí ísť na pixel `2221207801987418`** (ten patrí ad účtu). Pixel `1529505581872759` ad účet nevidí — eventy z neho sú pre reklamu neviditeľné, aj keby ľudia rezervovali.

Ak stránka inicializuje oba, použiť explicitne `fbq('trackSingle', '2221207801987418', 'Lead')`.

---

## 5. Rezervácia nezáväznej konzultácie

### 5.1 Kam to patrí

Na **obrazovku s výsledkom kvízu, pod výsledok** — nie namiesto neho a nie ako medzikrok pred ním. Používateľ musí najprv dostať to, po čo prišiel.

### 5.2 Komu to zobraziť — nie všetkým

| Segment | Leady | Registrácie | Miera | Platiaci |
|---|---|---|---|---|
| `co-jest` | 15 | 4 | **27 %** | 0 |
| `nevydrzim` | 13 | 3 | **23 %** | 0 |
| `nemam-cas` | 11 | 1 | 9 % | 0 |
| `potrebujem-podporu` | 15 | 1 | 7 % | 0 |
| `vecerne-chute` | 31 | 2 | 6 % | **1** |
| `schudnut` | 11 | 0 | **0 %** | 0 |
| `navyky` | 4 | 0 | **0 %** | 0 |

**Pravidlo:** `co-jest` a `nevydrzim` sa do trialu dostanú sami — tým konzultáciu neponúkať, pridal by si im krok navyše. Ponuku zobraziť segmentom **`schudnut`, `navyky`, `potrebujem-podporu`** (30 leadov, dokopy 1 registrácia), kde samoobsluha preukázateľne nefunguje.

Tým sa drží časová záťaž pod kontrolou: konzultácia je 1:1 čas, ktorý sa neškáluje. Plošná ponuka = kúpený plný diár za 29 centov za kus.

Implementačne: podmieniť zobrazenie bloku podľa segmentu, ktorý kvíz už aj tak počíta.

### 5.3 Copy

Nepoužívať „Rezervuj si konzultáciu" — znie ako záväzok a predaj.

```
Chceš to prebrať osobne?

15 minút, nezáväzne, po telefóne.
Povieme si, prečo ti to doteraz nešlo a čo s tým.

Bez predaja čohokoľvek — ak to nebude sedieť, povieme si to rovno.
```

Veta o nepredávaní tam patrí zámerne: presne toho sa ľudia pri „konzultácii zdarma" boja.

### 5.4 Mechanizmus

**Voľba A (odporúčaná): Cal.com embed.** Zadarmo, človek si rovno klikne termín, padne to do kalendára. Odpadá ručné dohadovanie termínu.

**Voľba B (fallback): vlastný mini-formulár.** Meno + telefón + tri predvyplnené okná („dnes večer / zajtra doobeda / zajtra večer"). Nižšia bariéra, ale termín potvrdzuje človek ručne. Posiela na ten istý Apps Script endpoint, len s iným `typ`.

---

## 6. Meranie rezervácie

1. `fbq('trackSingle', '2221207801987418', 'Lead')` **až po potvrdenom zápise**, nie pri kliku na tlačidlo.
2. Do zapisovaných dát pridať stĺpec `typ`: `kviz` (dokončený kvíz) / `konzultacia` (rezervácia hovoru). Bez toho sa oba kroky zlejú do jedného hárka.

---

## 7. Oprava `no-cors` zápisu do Sheetu

**Súčasný stav:** webhook sa volá v režime `no-cors`, teda bez odpovede — nevie sa, či zápis prešiel. Kontrola z 23. 7. ukázala 100 riadkov oproti 102 z Facebooku, takže **zápis reálne netečie**. Oprava preto nie je havarijná, ale je nutná pre rezervácie: tam sa musí `Lead` páliť až po potvrdení.

**Prečo to tak vzniklo:** POST s `Content-Type: application/json` vyvolá preflight `OPTIONS`, ktorý Apps Script web app neobslúži. `no-cors` chybu obíde, ale zahodí odpoveď.

**Oprava** — poslať to ako *simple request*, ktorý preflight nevyvolá.

Klient:

```js
const res = await fetch(APPS_SCRIPT_URL, {
  method: "POST",
  // text/plain => simple request => žiadny preflight OPTIONS
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({ typ: "konzultacia", meno, telefon, termin, odpovede }),
});
const out = await res.json();
if (!out.ok) throw new Error(out.error || "zápis zlyhal");

// až teraz, keď je zápis potvrdený
fbq("trackSingle", "2221207801987418", "Lead");
```

Apps Script (`apps-script.gs`):

```js
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("leady");
    sheet.appendRow([
      new Date(),                       // timestamp - viď 4.2
      data.typ || "kviz",
      data.meno || "",
      data.telefon || "",
      data.email || "",
      data.termin || "",
      JSON.stringify(data.odpovede || {}),
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Po zmene **znovu nasadiť web app** (Deploy → Manage deployments → New version). Bez toho beží stará verzia.

Zachovať existujúci WhatsApp fallback pre prípad, že zápis zlyhá.

---

## 8. E-mailová sekvencia

Prvý e-mail musí odísť **automaticky do pár minút** po dokončení kvízu. Po 48 hodinách je lead studený.

| Kedy | Obsah |
|---|---|
| Hneď | Výsledok kvízu v e-maile + jedna konkrétna vec na dnes |
| Deň 2 | Mýtus z kvízu rozvedený, žiadny predaj |
| Deň 4 | Pozvánka na nezáväznú konzultáciu (len segmenty z 5.2) |
| Deň 7 | Aplikácia ako alternatíva pre tých, čo nechcú hovor |

**Segmentácia:** odpovede z kvízu patria do prvého e-mailu doslova. „Píšeš, že ti to vždy spadne po treťom týždni" konvertuje výrazne lepšie než všeobecný text.

Toto je pravdepodobne najväčší pomer výsledku k práci v celom dokumente — rieši dieru č. 2, je to jednorazová práca a funguje donekonečna.

---

## 9. Čo NErobiť

**Neprepínať kampaň na optimalizáciu na `Lead`, len čo tam rezervácie pribudnú.**

Presne to sa spravilo 13. 7. 2026 na predošlej kampani a stálo to **28,53 € za dve rezervácie (14,27 €/kus)**, oproti ~0,33 € koncom júna. Meta potrebuje rádovo 50 konverzií týždenne na ad set, aby sa mala na čom učiť; pri dvoch-troch rezerváciách týždenne kampaň vyhladuje.

**Nechať optimalizáciu na `CompleteRegistration`.** K `Lead` optimalizácii sa vrátiť až pri stabilných 10+ rezerváciách týždenne.

**Nemeniť kreatívu ani publikum nad rámec sekcie 3.** Tá časť funguje.

**Nezdvíhať rozpočet pred opravami** zo sekcií 3–5.

---

## 10. Hotovo, keď

**Reklama**
- [ ] Ad set má vek 45+ a iba feed umiestnenia

**Meranie**
- [ ] Kvíz páli `PageView`, `quiz_start`, `quiz_step`, `quiz_email_shown`
- [ ] Každý lead má v Sheete timestamp
- [ ] Segmenty majú jednotný formát
- [ ] Testovacie e-maily (`+test`) sú vyfiltrované zo štatistík

**Konzultácia**
- [ ] Blok s ponukou sa zobrazuje len segmentom `schudnut`, `navyky`, `potrebujem-podporu`
- [ ] Rezervácia sa zapíše do Sheetu so stĺpcom `typ = konzultacia`
- [ ] Klient dostane `{ ok: true }` a až potom sa páli `Lead`
- [ ] Event `Lead` je vidieť v Events Manageri na pixeli `2221207801987418`
- [ ] Testovacia rezervácia prejde celou cestou: formulár → Sheet → pixel → Ads Manager

**Nedotknuté**
- [ ] Kampaň **naďalej** optimalizuje na `CompleteRegistration`

---

## 11. Otvorené otázky

1. **Existuje e-mailová sekvencia?** Ak nie, sekcia 8 je priorita pred sekciami 5–7.
2. **Ako dlho trvá trial?** Bez toho sa nedá povedať, či je 1 platiaci z 9 trialov zlý výsledok alebo len predčasný.
3. **Kde presne v onboardingu ľudia zastanú?** Na to odpovedia tí dvaja, ktorí sa zaregistrovali a nedokončili onboarding (kontakty v Sheete). Ich odpovede zapísať; ak sa obaja zasekli na tom istom kroku, je to oprava pre všetkých ďalších.
4. **Cal.com alebo vlastný formulár?** Odporúčanie je Cal.com kvôli objemu, ale závisí od toho, či sa termíny majú riadiť ručne.
5. **Ide sekvencia cez Resend?** Ak áno, mala by ísť tou istou cestou ako zvyšok mailingu.

**Zodpovedané 23. 7.:** ~~Koľko riadkov je reálne v Sheete oproti FB?~~ → 100 vs. 102, zápis netečie.
