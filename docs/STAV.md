# STAV — kde sme skončili

**Aktualizované:** 30. 7. 2026 (večer)
**Jednou vetou:** všetko z frontu aj backendu je nasadené — kvíz bez úvodnej brány,
brzda pomenovaná pred e-mailovou stenou, **rezervácia telefónom priamo na výsledku
zapnutá** a **e-mailová séria prepísaná z trialu na hovor**; čaká už len to, čo Claude
spraviť nemôže (súhlas s podmienkami pre publiká, webhook z Cal.com, telefonáty leadom).

> Tento dokument je vstupný bod — **kde sme skončili**.
> [`PLAN-HOVORY.md`](PLAN-HOVORY.md) je **plán ďalšej etapy**: ako z lead magnetu robiť
> objednávky hovorov (aktuálne čísla z ad účtu, 5 krokov, rozhodovacie prahy).
> [`PLAN-7DNI.md`](PLAN-7DNI.md) je **návrh úplne nového lead magnetu** („7 dní bez
> diéty") — výzva namiesto testu, ponuka hovoru na dni 4.
> [`VYSLEDOK-A-PONUKA.md`](VYSLEDOK-A-PONUKA.md) vysvetľuje, **ako** veci fungujú;
> [`PLAN-LIEVIKA.md`](PLAN-LIEVIKA.md) má čísla z 23. 7. a je čiastočne prekonaný.

**Projekt je v dvoch repách:**

| Repo | Čo obsahuje |
|---|---|
| `vercel-veritas` (verejné) | kvíz, výsledková stránka, `apps-script.gs`, dokumentácia |
| `valyra` (privátne), vetva `supabase-migration` | `supabase/functions/quizLead/` — príjem leadu, e-maily, notifikácie |

---

## 1. Najprv si to over — netvor domnienky

Toto sú príkazy, ktorých výstup rozhoduje. Nasadenie sa nedá vyčítať z gitu.

### Beží na stránke správna verzia?

```bash
curl -s https://kviz.valyra.sk/sw.js | head -1
curl -s https://kviz.valyra.sk/app.js | grep -n "BOOKING_ENABLED\|SPOTS_PER_MONTH:"
```

Očakávané k 30. 7.: `pravda-kviz-v18`, `BOOKING_ENABLED: false`, `SPOTS_PER_MONTH: 5`.

### Beží nasadená NOVÁ Supabase funkcia?

Bezpečná sonda — nič nezapíše ani neodošle, lebo chýba meno aj e-mail:

```bash
curl -s -X POST "https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead" \
  -H "Content-Type: application/json" -d '{"typ":"konzultacia","phone":"123"}'
```

| Odpoveď | Znamená |
|---|---|
| `{"error":"Chýba meno alebo platný e-mail"}` | **STARÁ** verzia — nenasadené |
| `{"error":"Chýba platné telefónne číslo"}` | **NOVÁ** verzia — nasadené ✅ |

K 30. 7. vracia starú → funkcia **nie je nasadená**.

### Rozrobené veci

```bash
gh pr list --state open                    # vercel-veritas
gh pr list --state open --repo janELKOND/valyra
git log --oneline -5
```

---

## 2. Naživo a funguje (`kviz.valyra.sk`)

- **Kvíz:** 8 otázok o mýtoch + 3 o človeku (brzda · **história návratov** · pripravenosť)
- **Diagnóza namiesto skóre** — rozpor medzi tým, čo človek vie, a čo dosiahol
  (`gapDiagnosis`, 4 vetvy). Skóre uzatvára, diagnóza otvára.
- **Ponuka „Reštart plán"** — personalizovaný prvý bod podľa brzdy, garancia
  „ostávam s tebou, kým sa to nepohne", kapacita **5 ľudí/mesiac** (počet voľných
  miest vypnutý)
- **Tiering HOT/WARM/COLD** podľa správania (návraty), nie podľa vyhlásení
- **`noPressure`** — kto povedal „len informácie", nedostane scarcity ani urgenciu
- **Čestnosť:** intro priznáva 11 otázok a ~5 minút, e-mailová stena oznámená
  dopredu, GDPR súhlas kryje aj obchodné oslovenie, žiadny sľub, ktorý 15-minútový
  hovor nesplní
- **Ponuka vedie na Cal.com** (`CAL_URL`)
- **Meranie:** `QuizStart`, **`QuizStep` (všetkých 11 obrazoviek)**, `QuizComplete`,
  `CompleteRegistration`, `ConsultView`, `ConsultClick` — signály o hovore a kroky idú
  adresne na pixel ad účtu cez `trackAd()`. `QuizStep` konečne ukáže, na ktorej
  obrazovke ľudia odpadávajú (posledná chýbajúca položka merania z plánu, sekcia 4.1).
- **E-mailová séria existuje a beží:** `bridge_0` (vyhodnotenie + 3 tipy) ide hneď
  po kvíze, cron `quizBridge` posiela deň 1/3/5/7

**Prvé dáta z v3 (kontrola 30. 7. popoludní).** Reklama beží (`delivery: active`,
účtový limit zrušený 29. 7.). Za 30. 7. je v `quiz_leads` **6 leadov**, z toho **4
už z novej verzie** (prostredný diel = história: všetci `raz-dva`). Pixel hlási
9 `CompleteRegistration` — rozdiel oproti DB (6) je bežná atribúcia, ale ak by
rástol, treba ho preveriť. **Zatiaľ ani jeden lead `viackrat`/`jojo`**, takže
`qualifyLead` nikoho neoznačil ako „chce konzultáciu" — na 4 leadoch sa z toho
nedá nič uzatvárať, ale je to prvá vec, ktorú sledovať po ~30 leadoch: ak sa
opakované návraty nebudú objavovať, tiering nemá z čoho vyberať a treba prehodnotiť
znenie odpovedí, nie tlačidlá.

## 2b. Zmeny z 30. 7. večer (všetky NAŽIVO, overené)

- **Úvodná brána zrušená** — prvá otázka je rovno vstupná obrazovka, hook z reklamy
  ostáva nad ňou. Dôvod: 1 063 načítaní → 586 štartov. `QuizStart` sa odteraz páli
  **pri prvej odpovedi**, nie pri kliku na tlačidlo (prísnejší prah, čísla pred/po
  nie sú priamo porovnateľné).
- **Brzda pomenovaná pred e-mailovou stenou** — nad formulárom je „Tvoja hlavná
  brzda: …" + prvá veta segmentovej správy; e-mail sa pýta až za zvyšok. Dôvod:
  389 dokončených otázok → 163 e-mailov.
- **Rezervácia telefónom zapnutá** (`BOOKING_ENABLED: true`, cache v20). Migrácia
  `003_quiz_calls.sql` spustená, endpoint otestovaný ostrým POSTom (`kind:'call'`,
  riadok overený a testovací zmazaný). Cal.com ostáva ako záloha pri chybe zápisu.
  `Lead` sa páli až po potvrdenom zápise.
- **E-mailová séria prepísaná z trialu na hovor** (repo `valyra`, nasadené).
  Všetkých 5 CTA vedie na Cal.com, sľuby zosúladené s ponukou na stránke (15 minút,
  zadarmo, bez karty, 5 ľudí mesačne). Zmizlo „7 dní zadarmo", „max 10 klientov"
  a „30-dňová garancia" — to patrilo starej ponuke CORE 49 €.
  **Fix pri tom:** `quizBridge` vôbec neposielal `segment` do šablón, takže e-maily
  deň 1–7 nevedeli, koho oslovujú.
- **Mail o novom leade** (`quizLead`) nasadený — viď nižšie.

## 2c. Druhý lead magnet — `/analyza` (naživo, BEZ REKLAMY)

**Osobná analýza chudnutia** na `kviz.valyra.sk/analyza`. Postavená 30. 7. večer,
nasadená, ale **nechodí na ňu ani jeden klik** — vlastný ad set sa spúšťa až na
Jánov pokyn (dohoda: 50/50 rozpočtu proti kvízu, aby sa dalo porovnať).

Dôvod: kvíz sľubuje TEST → priťahuje zvedavosť. Kalkulačka mala 72 % dokončení
z načítania oproti 15 % pri kvíze. Analýza sľubuje ČÍSLO, ktoré sa dá použiť.

- 8 ťukov: pohlavie, vek, výška, váha, cieľová váha, aktivita, problém, história.
  **Hodnoty problému a histórie sú zhodné s kvízom** — na nich stojí personalizácia
  e-mailov aj tiering, pri zmene by sa ticho rozbili.
- Výpočet: Mifflin–St Jeor × aktivita, deficit 500 kcal, dno 1 200/1 500 kcal,
  strop deficitu 28 % výdaja. Bielkoviny 1,8 g/kg **cieľovej** váhy.
- Čas do cieľa vždy ako **rozsah** (22–28 týždňov), nikdy jedno číslo.
- Pri veľmi nízkom výdaji nepredstiera, že to pôjde jedlom — prizná, že bez pohybu
  to nejde (inak by vyšlo „0 kg/týždeň, cieľ za 2 týždne").
- Zdieľa backend s kvízom: `quizLead` (`source: 'osobna-analyza'`), notifikácia,
  e-mailová séria, formulár na telefón, Cal.com, fotky.
- Backend preto vetví podľa toho, či lead má skóre — bez toho by analytickému
  leadu prišlo „TVOJE SKÓRE: 0 z 0".

**Čo chýba pred spustením:** reklamná kreatíva pre nový sľub („zisti, koľko máš
jesť") — text pripraví Claude, vizuál musí dodať Ján.

## 3. ~~Zmergované, ale NENASADENÉ~~ NASADENÉ 30. 7. ✅

**Mail o novom leade hovorí, či človek chce konzultáciu.**
Kód bol v `valyra`, vetva `supabase-migration` (PR #4, #5, #6); **nasadené 30. 7.**,
sonda vracia `Chýba platné telefónne číslo` = nová verzia. Predmet mailu:

```
🔥 CHCE KONZULTÁCIU — nový lead: Zuzana
🎯 Nový lead (chce plán): Zuzana
📘 Nový lead (len informácie): Zuzana
```

…a v tele dôvod („kilá sa mu opakovane vrátili — samoobsluha preukázateľne
nefunguje"), kontakt a kvalifikácia v ľudskej reči. Funguje pri **každom** kvíze,
aj bez telefónneho čísla.

## 4. ~~Uspané~~ ZAPNUTÉ 30. 7. ✅

Formulár na telefónne číslo priamo na výsledku **beží** (`BOOKING_ENABLED: true`).
Migrácia `003_quiz_calls.sql` spustená (tabuľka `quiz_calls`, RLS bez policies =
prístup len service role, telefón sa nedá vytiahnuť z prehliadača). Rezervácie
chodia Jánovi mailom `📞 Rezervácia hovoru: …` a do Sheetu. Postup a detaily:
[`SUPABASE-REZERVACIA.md`](SUPABASE-REZERVACIA.md).

Pôvodné rozhodnutie „necháme tak" padlo, keď sa ukázalo, že odskok na Cal.com je
posledné veľké trenie: 7 klikov na ponuku a 0 rezervácií za celý čas.

**Čo sledovať:** prvá reálna rezervácia. Kým nepríde, nevieme, či problém bol
v trení alebo v ponuke. Tabuľka: `select * from quiz_calls where called = false`.

---

## 5. Čo treba — v poradí

### Blokujúce (musí spraviť Ján — Claude na to nemá prístup)

**1. Odsúhlasiť podmienky pre vlastné publiká.** Bez toho sa nedá vytvoriť
retargetingové publikum (API vráti `Terms of service has not been accepted`):

https://www.facebook.com/customaudiences/app/tos/?act=1183460279376761

Je to súhlas s podmienkami, teda vec majiteľa účtu — Claude ho odklikať nesmie.
Keď to Ján potvrdí, publiká vytvorí Claude (dokončili kvíz / navštívili a nedokončili).

**2. Webhook z Cal.com → event `Lead`.** Dnes sa nevie, koľko klikov na kalendár
skončí termínom. Rezervácie cez formulár na telefón sa už merajú (`Lead` po
potvrdenom zápise), cesta cez Cal.com nie. Potrebný prístup do nastavení Cal.com.

> **Poradie ďalšej etapy je v [`PLAN-HOVORY.md`](PLAN-HOVORY.md).** Zhrnutie: kvíz
> dnes vyrába leady za 0,33 € (151 za 14 dní), ale **nula rezervovaných hovorov** —
> obmedzenie už nie je v kóde. Prvý krok je retargeting na ľudí, ktorí kvíz dokončili.

### Mimo kódu — najväčší dopad na peniaze

**3. ~~Zacielenie v Ads Manageri: vek 45+ a iba feed.~~ HOTOVÉ** — overené 30. 7.
priamo na ad sete `Kviz – CompleteRegistration`: `age_min 45`, `age_max 65`, iba
`facebook: feed` + `instagram: stream`, `advantage_audience: 0`. Nastavené už
23. 7., handoff to viedol ako nesplnené. Čísla po znovuspustení (30. 7. do obeda):
**2,13 € → 9 registrácií = 0,24 €**, CTR 17,8 %, CPC 0,03 €.

**4. Ozvať sa leadom, ktorí sa nezaregistrovali.** Kontakty v Sheete/Supabase.
Desať rozhovorov povie o produkte viac než ďalšia zmena na stránke. Máš **1
platiaceho zákazníka** — to je anekdota, nie miera.

**5. Prvá klientska referencia nad tlačidlo.** Pravdepodobne najväčší jednotlivý
skok v konverzii, aký na tej stránke ešte zostáva. Dôkaz dnes stojí len na Jánovom
príbehu (45 kg, 8 rokov).

### Ďalšie v poradí

**6. ~~Skontrolovať `bridgeTemplates.ts`~~ OVERENÉ A OPRAVENÉ 30. 7.** — séria
naozaj tlačila „Vyskúšať Valyru — 7 dní zadarmo" vo všetkých piatich e-mailoch,
kým stránka predávala hovor. Prepísané a nasadené (viď sekcia 2b). Prvý beh cronu
`quizBridge` s novými textami: nasledujúce ráno 7:30 UTC.

**7. Sledovať prvé rezervácie.** Po zapnutí formulára a prepísaní e-mailov je toto
jediné číslo, ktoré rozhodne. Ak po ~100 leadoch cez novú verziu nepríde ani jedna
rezervácia, problém nie je v trení ani v kóde — vtedy má zmysel meniť ponuku alebo
lead magnet ([`PLAN-7DNI.md`](PLAN-7DNI.md)), nie skôr.

---

## 6. Pasti — prečítať pred zmenami

- **Kampaň optimalizuje na `CompleteRegistration`. Neprepínať na `Lead`**, kým
  nebude stabilne 10+ rezervácií týždenne. 13. 7. to stálo 28,53 € za dve.
- **Pri zmene kvízu bumpni `CACHE` v `sw.js`** — inak ľudia uvidia starú verziu.
- **Dva pixely.** Ad účet nemá prístup k druhému (Valyra). Konverzné signály o
  hovore posielaj cez `trackAd()`; vlastné eventy musia ísť `trackSingleCustom`.
- **`quizVersion`.** Zložený `segment` už dvakrát zmenil význam (prostredný diel
  bol urgencia, od v3 je história). Riadky z rôznych verzií neporovnávaj naslepo.
- **`noPressure` nerušiť** — kto povedal „len informácie", nemá dostať tlak.
- **`SPOTS_LEFT` drž pravdivé alebo `null`.** Odpočet, ktorý sa mesiace nemení,
  ľudia odhalia.
- **Nesľubuj na výsledku nič, čo 15-minútový hovor nesplní.**
- **`Lead` páľ len po potvrdenom zápise**, nikdy pri kliku.
- **Repo `vercel-veritas` je verejné** — žiadne kontakty leadov, ID Sheetu ani ad účtu.
- **Testuj bez odosielania** — stubni `fbq` aj `fetch`, inak si natlačíš falošné
  dáta do Ads Managera a Supabase.

---

## 7. Kde je čo

| Súbor | Čo v ňom je |
|---|---|
| `app.js` | `CONFIG` (prepínače, kapacita) · otázky · `gapDiagnosis` · `showResult` (ponuka, tiering) · `submitLead` · `submitCallback` (uspané) · `trackAd` |
| `style.css` | `.diagnosis` · `.offer` · `.callback` (uspané) |
| `sw.js` | cache verzia — **bumpnúť pri každej zmene** |
| `apps-script.gs` | zápis do Sheetu, vetva `typ === 'konzultacia'` (záložná cesta) |
| `docs/VYSLEDOK-A-PONUKA.md` | ako to funguje — mechanika, meranie, pravidlá |
| `docs/SUPABASE-REZERVACIA.md` | ako zapnúť formulár na telefón |
| `docs/PLAN-LIEVIKA.md` | čísla z reklamy (23. 7.), čiastočne prekonané |
| `valyra` → `supabase/functions/quizLead/index.ts` | lead, `qualifyLead`, notifikácia, `handleCallBooking` |
| `valyra` → `supabase/migrations/003_quiz_calls.sql` | tabuľka rezervácií (nespustená) |
