# Kvíz, diagnóza a ponuka koučingu — ako to funguje

**Čo to je:** popis **mechaniky** výsledkovej stránky — diagnóza, tiering, ponuka, meranie.
**Napísané k:** 30. 7. 2026 (lievik **v3**, kvíz bol vtedy jediný magnet).
**Zosúladené so `STAV.md`:** 19. 8. 2026.

> ⚠️ **Toto NIE JE popis súčasného stavu.** Kde lievik stojí dnes, je v
> [`STAV.md`](STAV.md) — ten prepisuje čokoľvek tu.
>
> Odvtedy pribudlo: druhý magnet [`/analyza`](../analyza/) (dnes **hlavný** zdroj
> leadov, kvíz je vedľajší), verzie v4 a v5, písomná cesta kontaktu vedľa telefónu
> (3. 8.) a klikacie odpovede (17. 8.).
>
> **Ako to čítať:** sekcie 2–5 popisujú mechaniku, ktorá v jadre platí. Každé „dnes",
> číslo verzie a stav prepínača v tomto texte znamená **30. 7.** — miesta, kde to už
> nesedí, sú nižšie opravené priamo v texte.

> Repo je verejné. Žiadne kontakty leadov, ID Sheetu ani ID ad účtu tu nie sú.

---

## 1. Čo lievik robí

```
FB reklama → kvíz (8 otázok o mýtoch) → 3 otázky o človeku
           → e-mail (gate) → VÝSLEDOK: diagnóza + ponuka hovoru
           → Cal.com rezervácia → platené vedenie

           paralelne: e-mail Jánovi o leade povie, či človek chce konzultáciu
                      (funguje pri každom kvíze, aj bez rezervácie)
```

⚠️ **Posledný riadok už neplatí (oprava 19. 8.).** Cal.com nie je primárna cesta od
30. 7. a od 3. 8. sú cesty **dve**: formulár na telefón **alebo** písomná správa —
prepínač priamo na výsledku. Odkaz na kalendár (dnes `CAL_URL` = Google Kalendár)
zostal ako sekundárna možnosť. Dnešný tvar:

```
… → VÝSLEDOK: diagnóza + ponuka
           → 📞 nechá číslo  ALEBO  ✍️ napíše správu   → Ján sa ozve → platené vedenie
           → (sekundárne) odkaz na kalendár
```

**Realita k 18. 8.:** 15 z 18 kontaktov prišlo **písomne** a v kalendári nie je ani
jedna rezervácia. Skutočný ďalší krok človeka je odpoveď na e-mail, nie termín.

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

### ~~Ako sa hovor rezervuje — dnes Cal.com~~ OPRAVENÉ 19. 8.

⚠️ **Celá táto podsekcia bola k 30. 7. pravdivá a dnes už nie je.** Nechávam ju, lebo
vysvetľuje, prečo formulár vznikol — ale **nekonaj podľa nej**.

| Text nižšie tvrdí | Realita (overené v kóde 19. 8.) |
|---|---|
| formulár je uspaný za `BOOKING_ENABLED: false` | **`BOOKING_ENABLED: true`** — [`app.js:26`](../app.js) aj [`analyza/app.js:21`](../analyza/app.js), zapnuté **30. 7.** |
| živá cesta je odkaz na kalendár | živé sú **dve rovnocenné cesty** (telefón / správa) od **3. 8.**; kalendár je sekundárny |
| `Lead` sa nepáli | páli sa pri **oboch** cestách, rozlíšené `way=call\|message`, vždy až po potvrdenom zápise |
| „Cal.com" | `CAL_URL` je dnes **Google Kalendár** (`calendar.app.google/…`), Cal.com sa v kóde nevyskytuje |

**Živá cesta je formulár priamo na výsledku.** Tlačidlo v ponuke otvorí prepínač
`📞 Zavolaj mi` / `✍️ Radšej napíšem`, obe možnosti rovnako veľké. Prísľub súkromia je
**nad** poľom. Detaily a dôvody: [`STAV.md`](STAV.md), sekcia „Kontakt na výsledku —
DVE CESTY".

<details>
<summary>Pôvodné znenie z 30. 7. (historické)</summary>

**Živá cesta je rezervačná stránka Google Kalendára.** Tlačidlo v ponuke je odkaz na `CAL_URL`.

Existuje aj hotový formulár na telefónne číslo, ale je **uspaný za prepínačom**
`CONFIG.BOOKING_ENABLED: false` — nevykreslí sa a v HTML vôbec nie je. Prečo je
vypnutý a čo treba na jeho zapnutie: [`SUPABASE-REZERVACIA.md`](SUPABASE-REZERVACIA.md).

</details>

#### Ako sa Ján dozvie, že niekto chce konzultáciu

**Z e-mailu o novom leade** — nie z rezervácie. Toto je dnes hlavný prevádzkový
signál a funguje pri **každom** dokončenom kvíze, bez toho, aby človek musel
nechať telefónne číslo.

Kvíz sa na záujem pýta dvoma otázkami (história návratov + pripravenosť), takže
odpoveď je známa už pri leade. Funkcia `quizLead` z nich počíta `qualifyLead()`
podľa **rovnakého pravidla ako tiering** na výsledkovej stránke — chce vedenie
ALEBO opakované návraty ⇒ má zmysel ozvať sa — a výsledok dá do **predmetu**:

```
🔥 CHCE KONZULTÁCIU — nový lead: Zuzana
🎯 Nový lead (chce plán): Zuzana
📘 Nový lead (len informácie): Zuzana
```

V tele je odpoveď na prvom mieste vrátane **dôvodu** („kilá sa mu opakovane
vrátili — samoobsluha preukázateľne nefunguje"), potom kontakt a kvalifikácia
preložená do ľudskej reči. Skóre a chybné otázky sú až podklad pod tým.

Kód je v repe `valyra`, `supabase/functions/quizLead/index.ts`.

#### ~~Uspaný formulár — čo je hotové~~ ZAPNUTÝ 30. 7. 2026

⚠️ Formulár **beží**. Zoznam nižšie popisuje, ako je postavený — nie čo ešte čaká.
Od 3. 8. má navyše druhú cestu (písomná správa) a `phone` už nie je povinný
(migrácia `004_quiz_calls_message.sql`).

- **jediné pole: telefónne číslo.** Meno a e-mail sa berú zo `state` (uložené pri
  odoslaní leadu), takže sa nepýtajú druhýkrát.
- **termín nepovinný** — štyri predvyplnené okná (`CALL_WINDOWS`) namiesto kalendára
- **„Ozvem sa ti ja"** — bremeno plánovania je na Jánovi, nie na človeku
- Cal.com by zostal ako sekundárny odkaz, meraný eventom `ConsultCalendar`
- `Lead` by sa pálil **až po potvrdenom zápise** (`response.ok` **a** `kind: 'call'`
  v odpovedi) — tým by sa skutočná rezervácia merala bez Cal.com webhooku

##### Prečo `response.ok` nestačí

Funkcia, ktorá o `typ: 'konzultacia'` nevie, request **prijme a neznáme polia tichu
zahodí**. Dostali by sme `200`, odpálili konverziu `Lead` a človeku napísali „ozvem sa
ti na 0900…" — pričom číslo by nikde nebolo. Sľúbený hovor, na ktorý nie je kam volať,
je horší než trenie Cal.comu. Preto sa vyžaduje explicitné `kind: 'call'`.

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
| `QuizStep` | **zobrazenie každej z 11 obrazoviek** (`step`, `screen`, `total`) | `trackSingleCustom` | **len ad účet** |
| `QuizComplete` | zobrazenie e-mailového formulára | `trackCustom` | oba |
| `CompleteRegistration` | **potvrdený** zápis leadu | `track` | oba |
| `ConsultView` | zobrazenie ponuky na výsledku | `trackSingleCustom` | **len ad účet** |
| `ConsultClick` | klik na CTA (~~odchod na Cal.com~~ **otvorenie formulára**) | `trackSingleCustom` | **len ad účet** |
| `ConsultCalendar` | klik na „vyberiem si termín sám" (sekundárny odkaz na kalendár) | `trackSingleCustom` | **len ad účet** |
| `Lead` | ~~potvrdená rezervácia — **dnes sa nepáli** (formulár vypnutý)~~ **páli sa od 30. 7.** pri oboch cestách (`way=call\|message`), vždy až po potvrdenom zápise | `trackSingle` | **len ad účet** |
| `ConsultWayWrite` | zvolená písomná cesta (od 3. 8.) | `trackSingleCustom` | **len ad účet** |
| `InstagramClick` | klik na IG odkaz | `trackCustom` | oba |

### Prečo `trackAd()` a `trackSingleCustom`

Stránka inicializuje **dva pixely** a ad účet k druhému (Valyra) **nemá prístup**.
Signály o záujme o hovor preto idú adresne cez `trackAd()`, inak by sa v Ads Manageri
stratili. Vlastné eventy musia ísť cez `trackSingleCustom` — `trackSingle` je len pre
štandardné eventy (zoznam v `FB_STANDARD_EVENTS`) a pri zámene pixel event **zahodí**.

`CompleteRegistration` je zámerne ponechané na `fbq('track')` — kampaň na ňom má
learning history a neoplatí sa do toho zasahovať.

### `QuizStep` — kde presne ľudia odpadávajú

Hlási sa **zobrazenie** obrazovky, nie odpoveď, takže „krok N" znamená *toľkí sa naň
dostali*. V Events Manageri z toho vznikne rebríček, ktorý ukáže presnú obrazovku,
na ktorej ľudia zatvárajú okno:

```
QuizStart      100
QuizStep 1      92   otazka-1
…
QuizStep 9      55   brzda
QuizStep 10     48   historia
QuizStep 11     44   pripravenost
QuizComplete    12   ← e-mailový formulár
```

Bez toho sa vedel len počet začatých a dokončených kvízov a diera medzi nimi bola
slepá — pritom „padajú na 3. otázke", „padajú na kvalifikácii" a „padajú na
e-mailovej stene" sú tri úplne odlišné opravy.

**Jeden krok = najviac jeden event na načítanie stránky** (`state.stepsTracked`).
Sada sa zámerne **neresetuje** pri „Skúsiť kvíz znova" — inak by opakovaný pokus
nafúkol prvé kroky a odpadávanie by vyzeralo miernejšie, než je.

Ide len na pixel ad účtu: analyzuje sa platená premávka a druhý pixel by sa zaplnil
jedenástimi eventmi na návštevníka bez úžitku.

### `ConsultView` vs. `ConsultClick`

Pomer týchto dvoch je **jediné číslo, ktoré povie, či copy ponuky funguje**. Bez
`ConsultView` sa nedá rozlíšiť, či ľudia ponuku odmietajú, alebo sa k nej vôbec
nedostanú — to sú dve úplne odlišné opravy. Oba nesú `tier`, `segment`, `history`,
`readiness`, `band`.

### Čo meranie zatiaľ NEVIE

**`ConsultClick` nie je rezervácia** — je to len klik. Hlavná diera z 30. 7. je ale
**zavretá**: `Lead` sa od 30. 7. páli po potvrdenom zápise (od 3. 8. pri oboch cestách),
takže žiadosť o kontakt sa meria priamo.

⚠️ **Nemerané zostáva len to, čo sa deje na cudzom kalendári** — koľko klikov na
`CAL_URL` skončí termínom. Vyžadovalo by to webhook z rezervačnej stránky.
**Priorita je dnes nízka:** za celé obdobie kampane je v kalendári **0 rezervácií**
a 15 z 18 kontaktov prišlo písomne. Ten webhook by meral cestu s dokázanou nulou.

⚠️ **Čo je naozaj slepé (nález 18. 8.):**

- `selected_path = 'written_consult'` sa zapíše už pri **ťuknutí** na odpoveď, nie pri
  odoslaní. Z 25 ľudí, čo ťukli, reálne odoslalo **13 (52 %)**.
- `breakPoint` (ktorú zo štyroch odpovedí človek ťukol) ide **len na pixel**, do DB nie —
  per osobu sa nedá dohľadať.
- **Sledovanie otvorení e-mailov je vypnuté** — `email_events` nemá `email.opened` ani raz.
- **Správy odoslané ručne z Gmailu sa nikde nezaznamenávajú.** `email_logs` vidí len to,
  čo ide cez Resend.

Prevádzkovo slepé to nie je: o každom človeku, ktorý chce konzultáciu, sa Ján dozvie
z **e-mailu o leade** (viď sekcia 5) — a to funguje pri každom dokončenom kvíze.

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
| `quizVersion` | ~~**`3`**~~ → **`5`** od 13. 8. 2026 (viď tabuľka nižšie) |

### `quizVersion` — prečo naň dávať pozor pri analýze

Zložený `segment` a jeho okolie menili význam **opakovane**:

| verzia | kedy | formát `segment` / čo sa zmenilo |
|---|---|---|
| v1 | — | len `baseSegment` |
| v2 | — | `baseSegment\|urgencia\|readiness` |
| v3 | — | `baseSegment\|história\|readiness` |
| **v4** | 10. 8. | pribudla otázka na pripravenosť s hodnotou `informacie` a routing na tri vetvy |
| **v5** | 13. 8. | otázka na pripravenosť **zrušená** — `readiness` je prázdne, zato pribudol `selected_path` |

**Riadky z rôznych verzií sa nesmú porovnávať naslepo.** `quizVersion` je jediné, čo ich
rozlíši — a **staré riadky ho nemajú**, takže časť histórie sa férovo porovnať nedá.
Pri kohortách preto platí pravidlo zo [`STAV.md`](STAV.md): primárne podľa
`quiz_version`, dátum až ako záloha.

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
~~Stále platia jeho čísla z reklamy a poradie priorít~~ — **platia už len jeho čísla
z reklamy** (poradie priorít je celé vybavené, viď hlavička toho dokumentu):

*Stĺpec „Realita" prepočítaný 19. 8. 2026.*

| Plán tvrdí | Realita |
|---|---|
| Zápis ide do Google Sheetu cez Apps Script v `no-cors` | Ide na **Supabase funkciu** `quizLead` s `mode: 'cors'` a kontrolou `response.ok` |
| Rezervácia konzultácie „sa zatiaľ nezbiera" | **Zbiera sa** — formulár na výsledku (30. 7.), dve cesty telefón/správa (3. 8.), `Lead` po potvrdenom zápise. ~~Cal.com odkaz je živý~~ → `CAL_URL` je dnes Google Kalendár a je sekundárny |
| Ponuku zobraziť len segmentom `schudnut`, `navyky`, `potrebujem-podporu` | Tiering ide podľa **histórie a pripravenosti**, nie podľa segmentu brzdy |
| Valyra je cieľ lievika | Valyra je **nástroj počas platenej spolupráce** — potvrdené pivotom 24. 7. |
| Chýba `quiz_start`, `quiz_step` | ~~`quiz_step` stále chýba~~ → **`QuizStep` je nasadený od 30. 7.** pre všetkých 11 obrazoviek |
| Cieľom je registrácia → trial → platiaci | **Opustený model.** Cieľ je hovor alebo písomná konzultácia; za celý čas kampane je **0 € tržieb** a `client_accesses` nie je miera lievika |

**~~Naďalej platí a je nespravené~~ — PREPOČÍTANÉ 19. 8. 2026**

⚠️ **Tento zoznam bol zdroj dvoch falošných nálezov** („cielenie nie je nastavené",
„e-mailová sekvencia chýba"). Odškrtnuté podľa [`STAV.md`](STAV.md) a kódu:

- [x] **Zacielenie 45+ a iba feed** — **HOTOVÉ**, nastavené 23. 7., overené 30. 7.
      priamo na ad sete: `age_min 45`, `age_max 65`, iba `facebook: feed` +
      `instagram: stream`, `advantage_audience: 0`.
- [x] **E-mailová sekvencia** — **EXISTUJE A BEŽÍ.** `bridge_0` ide hneď po kvíze,
      cron `quizBridge` posiela deň 1/3/5/7 (+ `bridge_10`, `bridge_14`). Prepísaná
      30. 7. (z trialu na hovor) a 17. 8. (prestala sľubovať telefonát).
      ⚠️ Metrika „11 % lead → registrácia" **je z opusteného self-serve modelu** —
      registrácia do appky dnes nie je cieľ lievika, Valyra je nástroj v platenej
      spolupráci. Optimalizovať ju by znamenalo optimalizovať cestu, ktorá nikam
      nevedie. ⚠️ Skutočné číslo o sérii: **63 % všetkých klikov v e-mailoch je
      odhlásenie** (38 zo 60 klikov z 3 374 odoslaných).
- [ ] `Lead` z webhooku rezervačnej stránky — **stále nespravené, ale zámerne
      odložené**: 0 rezervácií v kalendári za celé obdobie, 15 z 18 kontaktov je
      písomných. Meralo by cestu s dokázanou nulou.
- [x] Kampaň **naďalej** optimalizuje na `CompleteRegistration` — platí, na `Lead`
      neprepínať, kým nebude stabilne 10+ rezervácií týždenne (13. 7. to stálo
      28,53 € za dve). ⚠️ Rozpočet je od 13. 8. zámerne stlmený na **1 €/deň**.

**Skutočné otvorené diery k 19. 8.** (zdroj: [`STAV.md`](STAV.md)):

- [ ] **48 % ľudí ťukne na odpoveď a neodošle** (12 z 25) — oprava nasadená 18. 8.,
      v dátach ešte neoverená
- [ ] **19 ľudí kliklo na Valyru a nemá kam dôjsť** — appka nemá platobnú cestu
- [ ] **8 nadviazaní z 11. 8. je napísaných a neodoslaných**

---

## 10. Pravidlá pre ďalšie zmeny

1. **Pri zmene kvízu bumpni `CACHE` v `sw.js`.** Bez toho ľudia uvidia starú verziu.
   (~~`pravda-kviz-v16`~~ → **`pravda-kviz-v31`** k 18. 8. 2026.) Bumpni **aj `?v=`
   v `index.html`** — kvíz aj `/analyza/index.html` majú vlastné odkazy na `style.css`
   a `app.js` a analýza sa ľahko zabudne.
2. **Nesľubuj na výsledku nič, čo 15-minútový hovor nesplní.** Ak sa zmení, čo sa na
   hovore reálne dáva, musí sa zmeniť aj druhý bod ponuky.
3. **`SPOTS_LEFT` drž pravdivé alebo `null`.**
4. **Nemeň počet otázok bez úpravy intra.** Intro uvádza „8 otázok o mýtoch + 3 krátke
   o tebe · asi 5 minút" — a musí to platiť.
5. **Nerušte `noPressure`** bez toho, aby si vedel, čo tým zapínaš.
6. **Konverzné signály o hovore posielaj cez `trackAd()`**, nie `fbq('trackCustom')`.
7. **Pri zmene významu polí zvýš `quizVersion`.** Inak sa dáta nedajú férovo porovnať —
   a stalo sa to už **štyrikrát** (v2, v3, v4, v5). Dáta sú dnes v **Supabase**, nie
   v Sheete.
8. **`Lead` páľ len po potvrdenom zápise**, nikdy pri kliku na tlačidlo. Inak sa
   kampaň učí na signále, ktorý neznamená rezerváciu.
9. **Testuj bez odosielania.** Pri klikaní naostro nahraď `fbq` prázdnou funkciou
   a `fetch` stubom, inak si do Ads Managera a Supabase natlačíš falošné dáta.
