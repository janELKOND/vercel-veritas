# Kvíz, diagnóza a ponuka koučingu — ako to funguje

**Stav:** nasadené na produkcii (`kviz.valyra.sk`)
**Posledná zmena:** 30. 7. 2026

Tento dokument popisuje **ako lievik funguje dnes**. Pre históriu rozhodnutí a čísla
z reklamy pozri [`PLAN-LIEVIKA.md`](PLAN-LIEVIKA.md) — pozor, ten je z 23. 7. a časť
jeho zámerov je už prekonaná (viď [Čo v pláne už neplatí](#čo-v-pláne-lievika-už-neplatí)).

> Repo je verejné. Žiadne kontakty leadov, ID Sheetu ani ID ad účtu tu nie sú.

---

## 1. Čo lievik robí

```
FB reklama → kvíz (8 otázok o mýtoch) → 3 otázky o človeku
           → e-mail (gate) → VÝSLEDOK: diagnóza + ponuka hovoru
           → nechá telefónne číslo → Ján zavolá → platené vedenie
```

Predáva sa **hovor**, nie koučing. Ponuka koučingu sa hovorí až na hovore. Valyra je
nástroj počas platenej spolupráce, nie samostatný cieľ výsledkovej stránky.

---

## 2. Tri otázky o človeku a čo každá riadi

Za ôsmimi vedomostnými otázkami idú tri nebodované. Každá má v kóde inú úlohu —
**žiadna nie je dekorácia**:

| Otázka | Konštanta | Riadi |
|---|---|---|
| „Čo ťa pri chudnutí brzdí najviac?" | `SEGMENT_Q` | text „Čo z toho vyplýva" (`SEGMENT_RESULTS`) + **prvý bod ponuky** (`SEGMENT_CALL_PROMISE`) |
| „Koľkokrát sa ti už zhodené kilá vrátili?" | `HISTORY_Q` | **diagnózu** (`gapDiagnosis`), **tiering**, mikro-vetu pod CTA (`HISTORY_NUDGE`) |
| „Ako to chceš tentokrát dotiahnuť?" | `READINESS_Q` | **tiering** a potlačenie tlaku (`noPressure`) |

Každá z nich má na obrazovke priznaný účel (`.step-note`). Kvalifikačná otázka bez
uvedeného dôvodu pôsobí ako skryté triedenie — a človek to cíti.

### Prečo história návratov a nie „nakoľko vážne to myslíš"

Pôvodne sa tu pýtalo *„Nakoľko vážne to teraz myslíš?"*. To je **sebadeklarácia** —
vážne to myslí takmer každý, kto dokliká kvíz, takže signál bol takmer nulový.

História návratov je **správanie**. Kto priznal opakované návraty, ten už dokázal, že
samoobsluha mu nestačí. Navyše je to druhé číslo, z ktorého sa skladá diagnóza.
Výmena bola **1:1** — počet otázok sa nezmenil, takže nepridala trenie v mieste,
kde ľudia odpadávajú.

---

## 3. Diagnóza namiesto skóre (`gapDiagnosis`)

**Problém, ktorý to rieši:** skóre je **uzavretie**. „5 z 8, poučil som sa, hotovo."
Uspokojený človek nemá dôvod nič meniť — zábavný kvíz si tak konkuruje s predajom
vedenia. Najhoršie to dopadalo na najlepšieho možného klienta: kto mal 8 z 8 a kilá
sa mu aj tak vracajú, dostal „Teóriu máš v malíčku" a odišiel s pocitom, že je v pohode.

**Riešenie:** postaviť vedľa seba dve čísla, ktoré človek sám dal — čo **vie** (skóre)
a čo **dosiahol** (história) — a nechať hovoriť rozdiel medzi nimi.

Štyri vetvy (`knows` = skóre ≥ 6, `clause` = priznaný návrat):

| skóre | história | titul | pointa |
|---|---|---|---|
| vysoké | návraty | „Vieš to — a aj tak sa to vracia" | informácie nie sú brzda → rozdiel medzi *vedieť* a *robiť* |
| nízke | návraty | „Časť odpovede je v tých mýtoch" | časť dôvodu v mýtoch, časť v tom, že v tom nikto nebol s ním |
| vysoké | bez návratov | „Teória nie je tvoja brzda" | otázka je, či to aj denne robí |
| nízke | bez návratov | „Začínaš so správnymi informáciami" | mýty už pozná, nebudú ho brzdiť |

**Nič sa nedomýšľa ani nepodsúva** — obe hodnoty sú jeho vlastné odpovede. Vysoké
skóre tým prestalo byť pochvala a stalo sa argumentom.

Vizuálne má diagnóza **amber** rámik, nie berry: nie je to pochvala ani chyba, je to
zistenie, pri ktorom sa treba zastaviť.

---

## 4. Tiering — HOT / WARM / COLD

```js
wantsGuidance   = readiness === 'podpora'
repeatedRelapse = history === 'viackrat' || history === 'jojo'

hot   = wantsGuidance || repeatedRelapse
cold  = !hot && readiness === 'informacie'
warm  = zvyšok
```

Tierujeme podľa toho, **čo človek chce** a **čo sa mu už reálne stalo** — nie podľa
toho, ako vážne to o sebe tvrdí.

| tier | CTA | scarcity + urgencia | text „ďalší krok" |
|---|---|---|---|
| HOT | primárne „📞 Chcem svoj Reštart plán" | áno* | podľa toho, či chce vedenie alebo má návraty |
| WARM | primárne | áno* | „chýba ti jasný plán" |
| COLD | sekundárne „Nechať číslo — bez záväzku" | nie | „pokojne si to nechaj uležať" |

### `noPressure` — vyslovené prianie prevažuje nad našim úsudkom

\* Výnimka: kto v poslednej otázke povedal **„zatiaľ si chcem len doplniť informácie"**,
nedostane nátlakové prvky (voľné miesta, výzva k akcii) **ani vtedy, keď ho história
zaradí do HOT**:

```js
const noPressure = cold || state.readiness === 'informacie';
```

Diagnózu aj ponuku vidí v plnej sile, potlačí sa **len tlak**. Bez tejto vetvy by
človek, ktorý výslovne povedal „nechcem tlak", dostal presne ten tlak — lebo si o jeho
potrebe myslíme niečo iné. **Túto vetvu nerušiť bez rozmyslu**, je tam zámerne.

---

## 5. Ponuka hovoru

Hovor má **meno a hmatateľný výstup**: nie „15-min hovor" (to je stretnutie), ale
**„Reštart plán"** (to je výsledok). Ľudia si rezervujú výsledok, nie stretnutie.

Tri body ponuky:

1. **Tvoju hlavnú brzdu pomenovanú nahlas** — text podľa segmentu (`SEGMENT_CALL_PROMISE`)
2. **Prvý konkrétny krok** — jedna vec na najbližší týždeň, ostáva mu aj bez spolupráce
3. **Jasno v tom, čo ďalej** — „ak budeš chcieť, poviem ti ako. Ak nie, rozlúčime sa v pohode."

Plus rámec spolupráce: *„ostávam s tebou, kým sa to nepohne. Neplatíš za počet
stretnutí, ale za to, že to konečne zaberie."*

### Čo sa v copy zámerne nerobí

- **Neopakuje sa „bez predaja čohokoľvek".** Nadmerné upokojovanie znižuje vnímanú
  hodnotu — keď trikrát povieš „bez predaja", človek počuje „toto je predajný hovor,
  ktorý predstieram, že ním nie je". Namiesto obrany je tam sebavedomé „ak budeš chcieť".
- **Nesľubuje sa nič, čo 15 minút nezvládne.** Pôvodne tam bol „napísaný prvý týždeň" —
  to sa v 15 minútach napísať nedá, tak sa to zmenšilo na pravdu.

### Ako sa hovor rezervuje — formulár, nie odskok na Cal.com

Pôvodne bolo CTA odkaz na **Cal.com**. To je najväčšie trenie na celom výsledku:
cudzia stránka s iným vzhľadom, výber dátumu, výber času a **opätovné písanie mena
a e-mailu**, ktoré už kvíz má. Človeka, ktorý práve dokončil kvíz, to vystraší.

Dnes tlačidlo **neodchádza zo stránky** — rozbalí formulár priamo pod ponukou:

- **jediné pole: telefónne číslo.** Meno a e-mail sa berú zo `state` (uložené pri
  odoslaní leadu), takže sa nepýtajú druhýkrát.
- **termín je nepovinný** — štyri predvyplnené okná (`CALL_WINDOWS`) namiesto kalendára
- **„Ozvem sa ti ja"** — bremeno plánovania je na Jánovi, nie na človeku
- Cal.com zostáva ako **sekundárny odkaz** („Radšej si termín vyberiem sám") pre tých,
  čo si radšej kliknú slot. Meria sa zvlášť eventom `ConsultCalendar` — ak túto cestu
  volí väčšina, formulár im neprekáža a dá sa uprednostniť kalendár.

Formát (`name`, `phone`, `preferredTime`) je zámerne rovnaký ako ten, ktorý už
`apps-script.gs` obsluhuje pre formio kalkulačku — je odskúšaný.

#### Toto zároveň zaplátalo dieru v meraní

`Lead` sa páli **až po potvrdenom zápise** (`response.ok`), nie pri kliku na tlačidlo.
Vďaka tomu sa skutočná rezervácia meria **bez Cal.com webhooku** — čo bola dosiaľ
najväčšia slepá škvrna. Pri zlyhaní zápisu sa `Lead` **nepáli**.

#### Kam číslo dorazí — `CONFIG.BOOKING_URL`

**Nie na Supabase.** Funkcia `quizLead` telefón neukladá a list `Leady` naň nemá ani
stĺpec — číslo by sa stratilo, `response.ok` by aj tak vrátilo úspech a človeku by sa
zobrazilo „ozvem sa ti". Sľúbený hovor, na ktorý nie je kam volať, je horší než trenie.

Rezervácia preto ide na **Apps Script web app** (`…/exec`), kde má v `apps-script.gs`
vlastnú vetvu `typ === 'konzultacia'` → `handleHovorZKvizu_()`:

- zápis do listu **„Hovory z kvízu"**: `Čas · Meno · Telefón · Kedy volať · E-mail ·
  Skóre · Segment · História · Pripravenosť · Tier · Zavolané?`
- **okamžitý e-mail Jánovi** s predmetom „📞 Rezervácia hovoru z kvízu" — v tele je
  všetko, čo treba vedieť pred vytočením čísla (brzda, história, čo chce), aby nemusel
  nič dohľadávať

Vlastný list, nie `Leady` — rezervácia je iná vec než dokončený kvíz.

#### Prečo `text/plain` a nie `application/json`

Apps Script web app **neobsluhuje preflight `OPTIONS`**, ktorý by `application/json`
vyvolal — request by zlyhal ešte pred odoslaním. `text/plain` je *simple request*,
preflight nespustí, a `e.postData.contents` v Apps Scripte aj tak obsahuje JSON string.
**Nemeniť na `application/json`**, aj keď to vyzerá „správnejšie".

#### Poistka, kým URL nie je doplnená

Ak je `BOOKING_URL` prázdna, **formulár sa vôbec nevykreslí** a ponuka vedie na Cal.com
ako predtým. Radšej trenie než stratené číslo.

#### Keď zápis zlyhá

Pri chybe sa zobrazí odkaz na Cal.com **aj** mailto, číslo zostane vyplnené, tlačidlo
sa prepne na „Skúsiť znova" a `Lead` sa **nepáli**.

**Prvá reálna rezervácia sa musí otestovať naostro** — nechať prejsť jednu a overiť,
že prišiel e-mail a pribudol riadok v liste. Apps Script po zmene skriptu treba
**znovu nasadiť** (Deploy → Manage deployments → New version), inak beží stará verzia.

### Kapacita (`CONFIG.OFFER`) — musí zostať pravdivá

```js
SPOTS_PER_MONTH: 5,   // koľko ľudí za mesiac naozaj vezmeš (trvalý limit)
SPOTS_LEFT: null,     // koľko je voľných PRÁVE TERAZ; null = počet neuvádzaj
```

Kapacita sa zobrazuje **vždy** (je to pravdivý limit sólo kouča), počet voľných miest
**len keď je `SPOTS_LEFT` číslo**. Toto rozdelenie je zámerné: mesačný limit je trvalý
fakt, počet voľných miest sa mení.

**`SPOTS_LEFT` vypĺňaj len vtedy, keď to budeš reálne každý mesiac prepisovať.**
Odpočet, ktorý mesiace stojí na tom istom čísle, ľudia odhalia a stojí to viac dôvery,
než by scarcity priniesla. `0` sa tiež nezobrazí. Skloňovanie rieši `spotsPhrase()`
(1 miesto · 2–4 miesta · 5+ miest).

---

## 6. Meranie

### Eventy

| Event | Kedy | Metóda | Pixel |
|---|---|---|---|
| `PageView` | načítanie stránky (`index.html`) | `track` | oba |
| `QuizStart` | klik na „Poďme na to" | `trackCustom` | oba |
| `QuizComplete` | zobrazenie e-mailového formulára | `trackCustom` | oba |
| `CompleteRegistration` | **potvrdený** zápis leadu | `track` | oba |
| `ConsultView` | zobrazenie ponuky na výsledku | `trackSingleCustom` | **len ad účet** |
| `ConsultClick` | klik na CTA (rozbalenie formulára) | `trackSingleCustom` | **len ad účet** |
| `ConsultCalendar` | klik na „vyberiem si termín sám" (Cal.com) | `trackSingleCustom` | **len ad účet** |
| `Lead` | **potvrdená** rezervácia hovoru | `trackSingle` | **len ad účet** |
| `InstagramClick` | klik na IG odkaz | `trackCustom` | oba |

### Prečo `trackAd()` a `trackSingleCustom`

Stránka inicializuje **dva pixely** a ad účet k druhému (Valyra) **nemá prístup**.
Signály o záujme o hovor preto idú adresne cez `trackAd()`, inak by sa v Ads Manageri
stratili. Vlastné eventy musia ísť cez `trackSingleCustom` — `trackSingle` je len pre
štandardné eventy (zoznam v `FB_STANDARD_EVENTS`) a pri zámene pixel event **zahodí**.

`CompleteRegistration` je zámerne ponechané na `fbq('track')` — kampaň na ňom má
learning history a neoplatí sa do toho zasahovať.

### `ConsultView` vs. `ConsultClick`

Pomer týchto dvoch je **jediné číslo, ktoré povie, či copy ponuky funguje**. Bez
`ConsultView` sa nedá rozlíšiť, či ľudia ponuku odmietajú, alebo sa k nej vôbec
nedostanú — to sú dve úplne odlišné opravy. Oba nesú `tier`, `segment`, `history`,
`readiness`, `band`.

### Čo meranie zatiaľ NEVIE

**`ConsultClick` nie je rezervácia** — je to len rozbalenie formulára. Rezerváciou je
až event **`Lead`**, ktorý sa páli po potvrdenom zápise. Ten už funguje, takže
konverzia na hovor **prestala byť odhad**.

Čo sa stále nemeria: rezervácie spravené **cez Cal.com** (sekundárna cesta). Tie by
potrebovali Cal.com webhook — vidno len klik `ConsultCalendar`, nie dokončenú rezerváciu.

---

## 7. Dáta odosielané do backendu

`POST` na Supabase funkciu `quizLead`, `mode: 'cors'`, `Content-Type: application/json`.
Odpoveď sa **kontroluje** (`response.ok`), timeout 12 s cez `AbortController`.
Pri chybe sa zobrazí chybová správa a tlačidlo „Skúsiť odoslať znova" — lead sa
nestratí naslepo.

Payload:

| Pole | Poznámka |
|---|---|
| `name`, `email`, `gender` | z formulára |
| `score`, `maxScore`, `band`, `bandName` | vyhodnotenie |
| `baseSegment` | brzda (`co-jest`, `vecerne-chute`, …) |
| `history` | **nové od v3** — `prvykrat` / `raz-dva` / `viackrat` / `jojo` |
| `readiness` | `podpora` / `plan` / `informacie` |
| `segment` | zložený: `baseSegment\|history\|readiness` |
| `wrong` | otázky, v ktorých sa mýlil (pre personalizáciu e-mailu) |
| `ts`, `source` | timestamp, zdroj |
| `quizVersion` | **`3`** |

### `quizVersion` — prečo naň dávať pozor pri analýze

Zložený `segment` mal počas života kvízu **tri rôzne významy**:

| verzia | formát `segment` |
|---|---|
| v1 | len `baseSegment` |
| v2 | `baseSegment\|urgencia\|readiness` |
| **v3** | `baseSegment\|história\|readiness` |

**Riadky z rôznych verzií sa nesmú porovnávať naslepo** — prostredný diel znamená
niečo iné. `quizVersion` je jediné, čo ich rozlíši. Staré riadky ho nemajú.

---

## 8. Čo sa menilo a prečo (chronologicky)

### PR #3 — Neodolateľná ponuka koučingu

Výsledok dosiaľ ponúkal *„15 minút, nezáväzne — bez tlaku, bez karty, bez predaja
čohokoľvek"*. Tri problémy: nadmerné upokojovanie znižovalo vnímanú hodnotu, hovor
nemal menovateľný výstup, a nebol žiadny dôvod konať teraz.

- hovor dostal meno a výstup („Reštart plán")
- prvý bod ponuky personalizovaný podľa segmentu
- garancia rámca spolupráce
- pravdivá scarcity z `CONFIG.OFFER`
- COLD dostáva menší tlak; Instagram odkaz prestal konkurovať CTA
- **nové meranie:** `ConsultView`, helper `trackAd()`

### PR #4 — Kvíz plní to, čo sľubuje

Vzniklo z otázky *„nie je to zavádzajúce?"*. Ponuka na konci zavádzajúca nebola —
hodnota sa doručí skôr, než príde ponuka, a v introi je priznané, že kvíz napísal
tréner. Zavádzajúce boli iné veci:

- intro sľúbilo **8 otázok**, kvíz dal **11** → priznaný rozsah aj čas
- obrazovka so segmentom mala nadpis **„Posledná otázka"** a nasledovali ďalšie dve
- kvalifikačné otázky bez uvedeného účelu → doplnené `.step-note`
- **súhlas GDPR** kryl len „vyhodnotenie a tipy", hoci sekvencia má na 4. deň pozvánku
  na konzultáciu → rozšírený o „občasné informácie o mojich službách a spolupráci"
- e-mailová stena **oznámená dopredu** v introi (kto ju nechce, neinvestuje 5 minút
  zbytočne; kto kvíz dokončí, na konci neodpadne na prekvapení)
- „Napísaný prvý týždeň" → „Prvý konkrétny krok" (zmenšenie sľubu na pravdu)

### PR #5 — Diagnóza namiesto skóre

Riešilo nesúlad medzi tým, koho kvíz priťahuje (zvedavcov), a tým, čo sa predáva
(platené vedenie). Detaily v sekciách 2–4 tohto dokumentu.

- otázka na urgenciu → otázka na históriu návratov (1:1, bez pridaného trenia)
- nový blok diagnózy so 4 vetvami
- tiering podľa správania
- texty pásiem prestali posielať vysoké skóre do nečinnosti
- `noPressure` — rešpekt k vyslovenému prianiu
- `quizVersion: 3` v payloade

---

## 9. Čo v pláne lievika už neplatí

[`PLAN-LIEVIKA.md`](PLAN-LIEVIKA.md) je z 23. 7. 2026 a **kód je odvtedy ďalej**.
Stále platia jeho čísla z reklamy a poradie priorít, ale:

| Plán tvrdí | Realita dnes |
|---|---|
| Zápis ide do Google Sheetu cez Apps Script v `no-cors` | Ide na **Supabase funkciu** `quizLead` s `mode: 'cors'` a kontrolou `response.ok` |
| Rezervácia konzultácie „sa zatiaľ nezbiera" | Ponuka hovoru **je** na výsledku, Cal.com odkaz je živý |
| Ponuku zobraziť len segmentom `schudnut`, `navyky`, `potrebujem-podporu` | Tiering ide podľa **histórie a pripravenosti**, nie podľa segmentu brzdy |
| Valyra je cieľ lievika | Valyra je **nástroj počas platenej spolupráce** |
| Chýba `quiz_start`, `quiz_step` | `QuizStart` a `QuizComplete` sú nasadené; `quiz_step` po jednotlivých otázkach stále chýba |

**Naďalej platí a je nespravené:**

- [ ] Zacielenie **45+ a iba feed** v Ads Manageri (5 minút, polovičná cena za lead)
- [ ] **E-mailová sekvencia** — najväčšia diera lievika (11 % lead → registrácia)
- [ ] `Lead` z **Cal.com webhooku** — už len pre sekundárnu cestu; formulár na stránke
      pálí `Lead` sám
- [ ] Kampaň **naďalej** optimalizuje na `CompleteRegistration` — na `Lead` neprepínať,
      kým nebude stabilne 10+ rezervácií týždenne (13. 7. to stálo 28,53 € za dve)

---

## 10. Pravidlá pre ďalšie zmeny

1. **Pri zmene kvízu bumpni `CACHE` v `sw.js`.** Bez toho ľudia uvidia starú verziu.
   (Aktuálne `pravda-kviz-v16`.)
2. **Nesľubuj na výsledku nič, čo 15-minútový hovor nesplní.** Ak sa zmení, čo sa na
   hovore reálne dáva, musí sa zmeniť aj druhý bod ponuky.
3. **`SPOTS_LEFT` drž pravdivé alebo `null`.**
4. **Nemeň počet otázok bez úpravy intra.** Intro uvádza „8 otázok o mýtoch + 3 krátke
   o tebe · asi 5 minút" — a musí to platiť.
5. **Nerušte `noPressure`** bez toho, aby si vedel, čo tým zapínaš.
6. **Konverzné signály o hovore posielaj cez `trackAd()`**, nie `fbq('trackCustom')`.
7. **Pri zmene významu polí zvýš `quizVersion`.** Inak sa dáta v Sheete nedajú
   férovo porovnať — a už raz sa to stalo dvakrát.
8. **`Lead` páľ len po potvrdenom zápise**, nikdy pri kliku na tlačidlo. Inak sa
   kampaň učí na signále, ktorý neznamená rezerváciu.
9. **Testuj bez odosielania.** Pri klikaní naostro nahraď `fbq` prázdnou funkciou
   a `fetch` stubom, inak si do Ads Managera a Supabase natlačíš falošné dáta.
