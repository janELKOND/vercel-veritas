# STAV — kde sme skončili

## 🆕 10. 8. 2026 — `/analyza` sa pýta na pripravenosť a rozvetvuje výsledok

**NASADENÉ 10. 8. 2026** na `kviz.valyra.sk` (overené: `analyza/app.js?v=6`, `sw` v25).

**Prečo:** za týždeň 259 leadov, ~4 žiadosti o kontakt, 3 hovory, **0 predajov**. Lievik
mal jediné dvere („objednaj si hovor") a tie sú pre väčšinu zavreté. Namiesto hádania,
čo ľudia chcú, sa ich na to teraz pýtame.

**Nová otázka** je v e-mailovej bráne — **pod ukážkou vypočítaného výdaja a nad menom
a e-mailom**. Tri klikacie karty, **nič nie je predvolené**, bez výberu sa nedá odoslať.

| Voľba | Čo uvidí na výsledku |
|---|---|
| `plan` | ponuka Valyry (dynamicky jej kcal a bielkoviny), CTA na appku. Písomná cesta schovaná za „Mám ešte otázku pre Jána". **Žiadny telefonát.** |
| `podpora` | textarea **rovno viditeľná**, placeholder podľa jej brzdy, CTA „Chcem Jánovu osobnú odpoveď". Telefón až po vedomom kliknutí. |
| `informacie` | celý výsledok, prvý krok, disclaimer — a **nič viac**. Žiadna ponuka, scarcity ani telefón. Len jemný odkaz na Valyru v poznámke pod čiarou. |

**Tier NEPREPISUJE voľbu.** Žena s jojo efektom je interne `hot`, ale ak si vybrala
„len výsledok", ponuku nedostane. Tier ostáva len pre notifikáciu Jánovi.

**`funnelVersion` (posiela sa ako `quizVersion`) je 4.** Leady v3 a nižšie readiness
nemajú vôbec — miešať ich s v4 znamená falošne nízky podiel „chcem plán".

**Zrušené:** univerzálny blok „Reštart plán", tlačidlo „Chcem svoj Reštart plán",
prepínač `📞 Zavolaj mi / ✍️ Radšej napíšem`. Dve konkurenčné kontaktné sekcie už nie sú.

**Nové eventy:** `ReadinessSelected`, `ValyraOfferView` (až keď je ponuka reálne
v zornom poli, threshold 0.5), `ValyraCheckoutStart`, `ValyraOfferClick`,
`ConversationView`, `MessageStart`, `MessageSent`, `CallOpen`, `CallRequested`.
Všetky jednorazové. `Lead` nesie `way`, `readiness` aj `funnelVersion`.
**`ConsultView` = „dosiahol výsledok", nie „videl ponuku"** — páli sa vo všetkých troch
vetvách zámerne, aby sa dalo porovnať v3 vs v4.

**⚠️ Čo NIE JE spravené (fáza 2):** CTA vo vetve `plan` vedie na `valyra.sk/Onboarding`
a **údaje sa neprenášajú** — človek si ich zadá znova. Checkout za 9 € **neexistuje**
(v repe `valyra` nie je ani riadok Stripe okrem knižníc a políčka v admine).
Preto je `CONFIG.VALYRA.PRICE_LABEL` zámerne `null` a nikde nie je napísané „9 €" ani
„predvyplnené" — tlačidlo, ktoré predstiera funkčný nákup, by bolo klamstvo.

**Otestované** (localhost, stubnuté `fbq` aj `fetch`, 375 px): všetky tri vetvy, ženské
aj mužské skloňovanie, blokovanie odoslania bez výberu, dvojklik na kartu neduplikuje
event, prázdna správa hlási chybu, dvojklik na odoslanie pošle jeden `Lead`, segment
vychádza `problem|history|readiness`.

**Cache:** `sw.js` v25, `analyza/app.js?v=6`, `analyza/analyza.css?v=3`.

### Fáza 2a — predvyplnenie Valyry (NASADENÉ 10. 8. 2026)

**Zistenie, ktoré to celé zmenilo:** `/analyza` od 30. 7. posielala objekt `analysis`
(vek, výška, váha, cieľ, kalórie) a **`quizLead` ho celý ignoroval** — slovo `analysis`
sa v tej funkcii nevyskytovalo ani raz. Čísla sa teda nikdy neukladali. Z každej ženy
zostal len text v `band_name`. Predvyplniť sa preto nedalo z čoho.

**⚠️ Platí len pre NOVÉ leady.** Čísla žien, ktoré analýzu spravili do 10. 8., neexistujú
a nedajú sa dopočítať.

Zmeny v repe `valyra` (vetva `supabase-migration`):

| Súbor | Čo |
|---|---|
| `migrations/007_quiz_leads_analysis.sql` | 8 stĺpcov `a_*` (vek, výška, váha, cieľ, aktivita, tdee, kcal, bielkoviny). **Spustená 10. 8.** |
| `functions/quizLead/index.ts` | ukladá `analysis` s kontrolou rozsahov; vracia `leadId` (uuid riadku) |
| `functions/analysisPrefill/index.ts` | **nová** — vymení uuid za čísla |
| `src/pages/Onboarding.jsx` | prečíta `?a=`, predvyplní formulár |

Zmena v `vercel-veritas`: `analyza/app.js` pripne k odkazu na Valyru `?a=<uuid>` + UTM.

**Bezpečnosť predvyplnenia:** vracia **len čísla**, nikdy meno ani e-mail. Platí
**72 hodín** od vzniku leadu. Hľadá výhradne podľa uuid — podľa e-mailu sa to nedá,
inak by stačilo skúšať adresy. Neplatné, staré aj neexistujúce uuid vracajú rovnaké
`{found:false}`, takže sa nedá zistiť, či záznam existuje. V URL nie je žiadny osobný
ani zdravotný údaj — overené: odkaz obsahuje len uuid a UTM.

**Prihlásenie sa NEMENÍ.** Žena stále zadá e-mail a kód ako doteraz; ušetrí len
prepisovanie piatich políčok. Automatické prihlásenie (fáza 2b) spravené nie je.

**Dve pasce, ktoré nás pri nasadzovaní chytili — prečítaj pred ďalším deployom:**

1. **Supabase nemal evidenciu žiadnej migrácie** (všetkých 6 malo `remote` prázdne, hoci
   dávno bežia — spúšťali sa ručne cez web). `db push` by preto pustil aj
   `001_initial_schema` s 578 riadkami a `create policy` bez poistky proti duplicite →
   pád alebo rozbité prihlásenie živým klientom. Riešenie:
   `supabase migration repair --status applied 001 002 003 004 005 006 --linked`
   (len opraví evidenciu, nespúšťa SQL), potom `db push` pustí naozaj len 007.
2. **Brána Supabase vyžaduje `Authorization`, nie len `apikey`.** Prvá verzia
   `Onboarding.jsx` posielala iba `apikey` → 401 ešte pred spustením funkcie a
   predvyplnenie by ticho nikdy nefungovalo. Cez `curl` to prešlo, lebo tam boli obe
   hlavičky. Chytilo sa to až testom na živej stránke.

**Overené naživo:** analýza v6 beží; payload nesie `readiness`, trojdielny segment aj
čísla; odkaz na Valyru má uuid + UTM a **žiadny osobný ani zdravotný údaj**;
`analysisPrefill` vracia 200 a `{found:false}` na neznáme aj nezmyselné uuid;
`quizLead` naďalej správne odmieta neúplné dáta.

**⚠️ NEOVERENÉ — samotné predvyplnenie s reálnym riadkom.** Vyžadovalo by to zapísať
ostrý lead (a s ním e-mail leadovi, notifikáciu Jánovi a riadok v Sheete). Prvá skutočná
žena to odskúša za nás — ak sa jej formulár nepredvyplní, hľadaj príčinu tu.

---

**Aktualizované:** 6. 8. 2026
**Jednou vetou:** písomná cesta prah nesplnila, ale **nedostala férový test** — sedela
za tlačidlom `📞 Chcem svoj Reštart plán`, ktoré samo vyzeralo ako súhlas s telefonátom,
a doklikalo sa k nej len 4,9 % ľudí. Preto je od 6. 8. **gate bez slúchadla**.

## ⚡⚡ Vyhodnotenie prahu (6. 8. 2026) — prah NESPLNENÝ, ale test nebol férový

Prah zo 3. 8. znel: *„ak z ďalších ~100 leadov prídu aspoň 2–3 správy, hypotéza sedela."*
Pixel `2221207801987418`, od 3. 8. do 6. 8. (144 leadov, teda za prahom):

| Krok | Počet | Podiel |
|---|---|---|
| `ConsultView` / `CompleteRegistration` | 144 | — |
| `ConsultClick` (klik na ponuku) | **7** | **4,9 %** |
| `ConsultWayWrite` (zvolili písanie) | **1** | 14 % z klikov |
| `Lead` | **1** | — |

**Prečo to NEznamená „mení sa ponuka" (ako hovorilo pravidlo zo 3. 8.):**
pravidlo predpokladalo, že písomnú cestu ľudia aspoň uvidia. Neuvideli.
`ConsultClick` medzitým **klesol z 9 % na 4,9 %** — úzke miesto sa nepresunulo
do formulára, ono celý čas sedelo **nad ním**, na tlačidle. Zo 144 ľudí sa
k voľbe „telefón / správa" vôbec nedostalo 137.

**Zmena zo 6. 8. (jedna vec, obe stránky):** gate prestal sľubovať telefonát.
- `📞 Chcem svoj Reštart plán` → `Chcem svoj Reštart plán` (COLD vetva: „Nechať
  číslo" → „Nechať kontakt")
- `offer-meta`: „15 minút po telefóne" → „**15 minút po telefóne alebo písomne**"
- `offer-lead`: „S čím z toho **hovoru** odídeš" → „S čím z toho odídeš"
- po otvorení formulára sa **už nefokusuje `phone`** — na mobile vyťahoval numerickú
  klávesnicu skôr, než si človek všimol záložku „✍️ Radšej napíšem". Fokus nastaví
  až `setMode`, keď si cestu vyberie.

**Čo sledovať a ďalší prah:** `ConsultClick` (má sa vrátiť aspoň na 9 %) a potom
`ConsultWayWrite`. Ak `ConsultClick` stúpne, ale správy aj hovory ostanú na nule,
**až vtedy** je na rade ponuka — a platí sekcia 5, bod 5 (referencia priamo pri formulári).

## Predošlé meranie (3. 8. 2026) — už vyhodnotené vyššie

Od zapnutia formulára (30. 7. večer) do 3. 8., pixel `2221207801987418`:

| Krok | Počet |
|---|---|
| Dokončený kvíz/analýza → výsledok (`ConsultView`) | 122 |
| Klik na ponuku (`ConsultClick`) | **11** (9 %) |
| Zadané telefónne číslo (`Lead`) | **1 — a to je Jánov vlastný test** |
| Klik na Cal.com (`ConsultCalendar` / `CalendarClick`) | **0 za celých 28 dní** |

**Čo z toho vyplýva a čo NIE:**

- **Nie je to technická chyba.** Overené ostrým odoslaním cez prehliadač na živej
  stránke (kvíz aj analýza): formulár sa vykreslí, rozbalí, odošle, riadok pristane
  v `quiz_calls`, `Lead` sa páli až po potvrdenom zápise. Testovacie riadky zmazané.
- **Nie je to tým, že ponuku nevidia.** 9 % klikne. Ponuka síce sedí až na ~3. obrazovke
  zo 4,6 (mobil, 375 px), ale klikajú.
- **Padá to na telefónnom čísle.** 11 ľudí otvorilo formulár, 0 vyplnilo. Externý výskum
  hovorí to isté (telefón ako povinné pole zdvíha opustenie formulára násobne), a sedí
  s vlastnými dátami: 8 ťukov v analýze o vlastnej váhe dokončí 96 %, jedno telefónne
  číslo nedá nikto.
- **Cal.com je mŕtvy.** Odkaz je na oboch stránkach, za mesiac naň neklikol nikto.
  Pridávať ďalší externý kalendár (Google) je tá istá trieda trenia — zamietnuté 3. 8.

**Výhrada, ktorú netreba prehliadnuť:** 11 klikov je tenká vzorka. 0 z 11 je podozrivé
(pri bežných ~30 % by sme čakali ~3), ale nie je to dôkaz. Preto sa menila JEDNA vec —
spôsob kontaktu — a nie zároveň ponuka a referencia. Inak by sa nedalo povedať, čo zabralo.

**Čo sledovať teraz:** `ConsultWayWrite` (koľkí zvolia písanie) a `Lead` s `way=message`.
Prah: ak z ďalších ~100 leadov prídu aspoň 2–3 správy, hypotéza sedela a ide sa ďalej
(zarovnať sľub tlačidla, referencia). **Ak bude znovu nula, prekážka nie je spôsob
kontaktu, ale samotná ponuka** — a vtedy má zmysel meniť ju, nie formulár.

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
curl -s https://kviz.valyra.sk/app.js | grep -c "wayWrite"
curl -sL https://kviz.valyra.sk/analyza | grep -oE '(analyza/app\.js|style\.css)\?v=[0-9]+'
```

Očakávané k 6. 8.: `pravda-kviz-v24`, `wayWrite` **7×** v `app.js` (= písomná cesta
je vonku), `app.js?v=23`, `analyza/app.js?v=5` a `style.css?v=12`.
Rýchla kontrola gate zo 6. 8. — obe musia vrátiť `0`:
`curl -s https://kviz.valyra.sk/app.js | grep -c "📞 Chcem svoj"` a to isté pre
`/analyza/app.js`.
Pozn.: `/analyza` bez lomky vracia 308 — použi `curl -L`, inak dostaneš prázdno.

### Beží nasadená NOVÁ Supabase funkcia?

Bezpečné sondy — nič nezapíšu ani neodošlú, lebo chýba kontakt:

```bash
curl -s -X POST "https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead" \
  -H "Content-Type: application/json" -d '{"typ":"konzultacia","phone":"123"}'
curl -s -X POST "https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead" \
  -H "Content-Type: application/json" -d '{"typ":"konzultacia","message":"skusam"}'
```

| Odpoveď | Znamená |
|---|---|
| `{"error":"Chýba meno alebo platný e-mail"}` | verzia spred 30. 7. — dávno nenasadené |
| `{"error":"Chýba platné telefónne číslo"}` | rezervácia telefónom beží |
| `{"error":"K správe chýba e-mail, na ktorý sa dá odpovedať"}` | **písomná cesta beží** ✅ |

K 3. 8. vracajú obe posledné hlášky → nasadené.

### Ako otestovať formulár BEZ znečistenia dát

Overené 3. 8., funguje: v konzole stránky prepísať `window.fbq` na prázdnu funkciu
(inak si natlačíš falošnú konverziu do Ads Managera) a `window.fetch` na stub, kým
prechádzaš kvíz. Stub vypnúť až tesne pred odoslaním formulára, ak chceš otestovať
ostrý zápis — potom riadok zmazať:
`delete from quiz_calls where email='...'`. **Screenshot v paneli padá na timeout,
overuj cez DOM.** Pozor: ostrý test zapíše riadok aj do Google Sheetu („Hovory
z kvízu") a ten sa musí zmazať ručne.

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

**~~Prvé dáta z v3 (30. 7.): ani jeden lead `viackrat`/`jojo`, tiering nemá z čoho
vyberať.~~ VYVRÁTENÉ 3. 8. — bola to len malá vzorka (4 leady).** Za 1.–3. 8. pribudlo
74 leadov a **57 % z nich je `hot`** (42), takmer výhradne cez opakované návraty.
Tiering funguje a má z čoho vyberať; znenie odpovedí meniť netreba.

**Rozdiel pixel vs. DB pretrváva a je normálny** — pixel počíta `CompleteRegistration`
po prehliadačoch a atribúcii, DB reálne uložené leady. Nepoužívať ich zameniteľne.

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

## 2c. Druhý lead magnet — `/analyza` (BEŽÍ NA ŇU REKLAMA od 31. 7.)

**Osobná analýza chudnutia** na `kviz.valyra.sk/analyza`. Postavená 30. 7. večer.
**Ján spustil vlastnú kampaň 31. 7. 17:54** — „Analýza – CompleteRegistration",
ženy **30–50** (kvíz cieli 45–65), iba Feed, `advantage_audience: 0`.

**Predpoklad sa POTVRDIL a analýza už ťahá objem:**

| | dokončenie | podiel na leadoch 1.–3. 8. |
|---|---|---|
| `/analyza` (sľubuje ČÍSLO) | **96 %** (134 štartov → 129) | **60 zo 74** |
| kvíz (sľubuje TEST) | 61 % (176 → 108) | 14 zo 74 |

Nástroj, ktorý *počíta*, poráža ten, ktorý *skúša* — presne ako naznačovala kalkulačka
(72 % vs 15 %). **Analýza je dnes hlavný zdroj leadov, nie kvíz.** Čokoľvek sa mení na
výsledku kvízu, patrí aj sem (3. 8. sa na to takmer zabudlo).

- 8 ťukov: pohlavie, vek, výška, váha, cieľová váha, aktivita, problém, história.
  **Hodnoty problému a histórie sú zhodné s kvízom** — na nich stojí personalizácia
  e-mailov aj tiering, pri zmene by sa ticho rozbili.
- Výpočet: Mifflin–St Jeor × aktivita, deficit 500 kcal, dno 1 200/1 500 kcal,
  strop deficitu 28 % výdaja. Bielkoviny 1,8 g/kg **cieľovej** váhy.
- Čas do cieľa vždy ako **rozsah** (22–28 týždňov), nikdy jedno číslo.
- Pri veľmi nízkom výdaji nepredstiera, že to pôjde jedlom — prizná, že bez pohybu
  to nejde (inak by vyšlo „0 kg/týždeň, cieľ za 2 týždne").
- Zdieľa backend s kvízom: `quizLead` (`source: 'osobna-analyza'`), notifikácia,
  e-mailová séria, formulár na kontakt (od 3. 8. telefón **aj** správa), Cal.com, fotky.
- Backend preto vetví podľa toho, či lead má skóre — bez toho by analytickému
  leadu prišlo „TVOJE SKÓRE: 0 z 0".
- **Deň-1 e-mail má vlastnú podobu** (od 3. 8., repo `valyra`,
  `_shared/bridgeTemplates.ts`): namiesto Jánovho príbehu dostane **jedálniček na
  7 dní + pohyb**, postavený na jej vlastných číslach. Tri varianty podľa pásma
  (<1400 / 1400–1800 / 1800+ kcal), 5 jedál denne, desiata rotuje mliečnu bielkovinu.
  Čísla sa parsujú z `band_name` (napr. „1550 kcal · 125 g bielkovín · do cieľa −12 kg"),
  takže **zmena formátu `band_name` v `analyza/app.js` ticho rozbije e-mail** —
  `parseAnalyzaBand` prestane trafiť a pošle sa štandardný bridge_1.
  Pohyb: 10–12 tis. krokov denne + cez víkend 90 min aktivita (Jánovo číslo, nie moje).
- Kvíz sa na pripravenosť pýta, analýza **nie** → `readiness` je pri analytických
  leadoch vždy prázdne. Tiering preto stojí len na histórii návratov. Nepliesť si to
  s „nikto nechce vedenie".

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

## 4. Kontakt na výsledku — DVE CESTY od 3. 8. ✅

Formulár na výsledku **beží** (`BOOKING_ENABLED: true`) a od 3. 8. ponúka **dve
rovnocenné cesty**: telefón alebo správa. Na kvíze aj v `/analyza`.

- Prepínač `📞 Zavolaj mi` / `✍️ Radšej napíšem`, obe tlačidlá rovnako veľké.
  Keby bola písomná cesta menšia alebo schovaná ako odkaz, ostala by to znova
  ponuka „telefón, alebo nič" — a presne na tej sa meranie zastavilo na nule.
- Prísľub súkromia je **nad** poľom. Pod tlačidlom ho čítal len ten, kto číslo
  už dal, teda presne ten, koho netreba presviedčať.
- `Lead` sa páli pri OBOCH cestách (rozlíšené `way=call|message`), vždy až po
  potvrdenom zápise. `ConsultWayWrite` meria, koľkí zvolili písanie.

**Backend** (repo `valyra`, nasadené): migrácia `004_quiz_calls_message.sql` —
`phone` už nie je povinný, pribudol `message`, a CHECK stráži, že riadok vždy má
kontakt: buď číslo, alebo správu **s e-mailom** (správa bez e-mailu je slepá
ulička — nie je kam odpovedať). `quizLead` vracia `kind: 'call' | 'message'`,
notifikácia rozlišuje `📞 Rezervácia hovoru` a `✉️ Správa z kvízu`, text od
človeka sa pred vložením do HTML e-mailu escapuje.

⚠️ **Pri ďalšej zmene klienta:** kontrola odpovede musí prijať `call` AJ `message`.
V `analyza/app.js` bola pôvodne len `kind !== 'call'` — po zmene backendu by
správa spadla na chybu, hoci zápis prebehol. Opravené 3. 8., ľahko sa to vráti.

**Čo sledovať:** `select * from quiz_calls where called = false` — teraz tam môžu
byť aj riadky **bez čísla a so správou**. Tie sa vybavujú odpoveďou na e-mail.

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

**3. Ozvať sa 42 hot leadom z 1.–3. 8.** Za dva dni pribudlo 74 leadov, z toho 42
spadá do `hot` (kritérium `qualifyLead`: opakovaný návrat `viackrat`/`jojo`, alebo
výslovné „chcem vedenie"). **Ani jeden z nich nebol oslovený.** Písomná cesta pomôže
až budúcim leadom — týchto 42 ňou nezastihneš. Pri súčasnom objeme je osobné
oslovenie stále najväčšia páka; predošlé vlny (24. 7., 29. 7., 30. 7.) sú v
`email_logs` pod kľúčmi `manual_outreach_2026_07_24`, `hot_call_2026_07_29`,
`hot_call_2026_07_30` — **každú novú vlnu najprv preveriť proti nim**, aby nikto
nedostal dva maily (29. 7. sa to už raz stalo piatim ľuďom).

**Pozor na slovník:** „hot" ≠ „chce konzultáciu". Za celý čas kampane napísalo
výslovne „chcem, aby ma niekto viedol" **10 reálnych ľudí** (13 riadkov mínus 3 testy),
z toho 2 sa odhlásili. Zvyšok „hot" je odvodený zo správania. `quizLead` to rozlišuje
v predmete notifikácie zámerne — nepomiešať to ani v oslovení.

### Mimo kódu — najväčší dopad na peniaze

**3. ~~Zacielenie v Ads Manageri: vek 45+ a iba feed.~~ HOTOVÉ** — overené 30. 7.
priamo na ad sete `Kviz – CompleteRegistration`: `age_min 45`, `age_max 65`, iba
`facebook: feed` + `instagram: stream`, `advantage_audience: 0`. Nastavené už
23. 7., handoff to viedol ako nesplnené. Čísla po znovuspustení (30. 7. do obeda):
**2,13 € → 9 registrácií = 0,24 €**, CTR 17,8 %, CPC 0,03 €.

**4. Ozvať sa leadom, ktorí sa nezaregistrovali.** Kontakty v Sheete/Supabase.
Desať rozhovorov povie o produkte viac než ďalšia zmena na stránke. Máš **1
platiaceho zákazníka** — to je anekdota, nie miera.

**5. Prvá klientska referencia — a to PRIAMO K FORMULÁRU, nie vyššie na stránku.**
Dôvera chýba presne v momente, keď má človek nechať kontakt, nie o tri obrazovky
vyššie. Dôkaz dnes stojí len na Jánovom príbehu (45 kg, 8 rokov).
**Zámerne odložené za písomnú cestu** — keby sa zmenili dve veci naraz, nedá sa
povedať, ktorá zabrala. Nasadiť až po vyhodnotení prahu zo sekcie „Posledné meranie".

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
  A **bumpni aj `?v=` v `index.html`** — kvíz aj `/analyza/index.html` majú vlastné
  odkazy na `style.css` a `app.js`; analýza si ich verzuje samostatne a ľahko sa
  na ňu zabudne (k 3. 8.: `style.css?v=12`, `app.js?v=22`, `analyza/app.js?v=4`).
- **Zmena na výsledku kvízu patrí SPRAVIDLA aj do `/analyza`.** Sú to dva samostatné
  súbory s vlastnou kópiou formulára aj `submitCallback`. Analýza je dnes väčší zdroj
  leadov, takže zmena len v kvíze zasiahne menšinu ľudí.
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
| `app.js` | `CONFIG` (prepínače, kapacita) · otázky · `gapDiagnosis` · `showResult` (ponuka, tiering) · `submitLead` · `submitCallback` (telefón **aj** správa) · `trackAd` |
| `analyza/app.js` | vlastná kópia výsledku a `submitCallback` — **meniť súbežne s `app.js`** |
| `style.css` | `.diagnosis` · `.offer` · `.callback` · `.way-tab` (voľba cesty) — zdieľaný oboma stránkami |
| `sw.js` | cache verzia — **bumpnúť pri každej zmene** |
| `apps-script.gs` | zápis do Sheetu, vetva `typ === 'konzultacia'` (záložná cesta) |
| `docs/VYSLEDOK-A-PONUKA.md` | ako to funguje — mechanika, meranie, pravidlá |
| `docs/SUPABASE-REZERVACIA.md` | ako zapnúť formulár na telefón |
| `docs/PLAN-LIEVIKA.md` | čísla z reklamy (23. 7.), čiastočne prekonané |
| `valyra` → `supabase/functions/quizLead/index.ts` | lead, `qualifyLead`, notifikácia, `handleCallBooking` (telefón aj správa) |
| `valyra` → `supabase/migrations/003_quiz_calls.sql` | tabuľka rezervácií (spustená 30. 7.) |
| `valyra` → `supabase/migrations/004_quiz_calls_message.sql` | písomná cesta — `phone` nepovinný, `message`, CHECK na kontakt (spustená 3. 8.) |
| `valyra` → `_shared/bridgeTemplates.ts` | mostové e-maily; `bridge_1` má vetvu s jedálničkom pre `osobna-analyza` |
