# STAV — kde sme skončili

**Aktualizované:** 30. 7. 2026
**Jednou vetou:** kvíz aj celá výsledková stránka sú nasadené a fungujú; **čaká len
nasadenie Supabase funkcie `quizLead`**, aby mail o leade hovoril, či človek chce
konzultáciu.

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

## 3. Zmergované, ale NENASADENÉ 🔴

**Mail o novom leade má hovoriť, či človek chce konzultáciu.**
Kód je v `valyra`, vetva `supabase-migration`, zmergovaný (PR #4, #5, #6).

Po nasadení bude predmet mailu:

```
🔥 CHCE KONZULTÁCIU — nový lead: Zuzana
🎯 Nový lead (chce plán): Zuzana
📘 Nový lead (len informácie): Zuzana
```

…a v tele dôvod („kilá sa mu opakovane vrátili — samoobsluha preukázateľne
nefunguje"), kontakt a kvalifikácia v ľudskej reči. Funguje pri **každom** kvíze,
aj bez telefónneho čísla.

**Dnes chodí starý mail** so strojovým `vecerne-chute|viackrat|podpora`.

## 4. Uspané — zámerne, nechať tak

Formulár na telefónne číslo priamo na výsledku. Napísaný a otestovaný, ale
**vypnutý** (`BOOKING_ENABLED: false`), v HTML vôbec nie je. Migrácia
`003_quiz_calls.sql` **nie je spustená**. Nič nekomplikuje.

Zapnutie = migrácia + nasadiť funkciu + prepnúť prepínač. Postup:
[`SUPABASE-REZERVACIA.md`](SUPABASE-REZERVACIA.md).

Rozhodnutie z 30. 7.: **necháme tak**, prevádzkovo stačí mail o leade.

---

## 5. Čo treba — v poradí

### Blokujúce (musí spraviť Ján, Claude na to nemá prístup)

**1. Nasadiť Supabase funkciu.** Bez toho je celá zmena mailu neviditeľná.

```bash
supabase functions deploy quizLead --project-ref ztuudcgmzbkkbldnkqay
```

Migráciu netreba — mení sa iba obsah notifikácie, nič v DB.

⚠️ Deploy pustí stav vetvy `supabase-migration`. Najprv `git pull` a mrkni do
`MIGRATION.md`, či je tam len to, čo chceš v produkcii (na druhom PC môže byť
novší stav).

**2. Overiť** sondou zo sekcie 1 a jedným kvízom naostro — mail musí prísť
s novým predmetom.

*Claude nemá: Supabase CLI, access token, ani CI v repe. Overené, nie odhadnuté.*

> **Poradie ďalšej etapy je v [`PLAN-HOVORY.md`](PLAN-HOVORY.md).** Zhrnutie: kvíz
> dnes vyrába leady za 0,33 € (151 za 14 dní), ale **nula rezervovaných hovorov** —
> obmedzenie už nie je v kóde. Prvý krok je retargeting na ľudí, ktorí kvíz dokončili.

### Mimo kódu — najväčší dopad na peniaze

**3. Zacielenie v Ads Manageri: vek 45+ a iba feed.** 5 minút bez kódu.
Dáta z 23. 7.: 45–54 dáva lead za 0,20 €, 65+ za 0,14 €, ale 56 % rozpočtu ide na
25–44 za dvojnásobok. Feed 0,26 € vs. Reels 0,48 €.

**4. Ozvať sa leadom, ktorí sa nezaregistrovali.** Kontakty v Sheete/Supabase.
Desať rozhovorov povie o produkte viac než ďalšia zmena na stránke. Máš **1
platiaceho zákazníka** — to je anekdota, nie miera.

**5. Prvá klientska referencia nad tlačidlo.** Pravdepodobne najväčší jednotlivý
skok v konverzii, aký na tej stránke ešte zostáva. Dôkaz dnes stojí len na Jánovom
príbehu (45 kg, 8 rokov).

### Ďalšie v poradí

**6. Skontrolovať `bridgeTemplates.ts`** (repo `valyra`) — či e-maily série ešte
netlačia Valyra appku namiesto hovoru. Séria bola písaná pre starý lievik; ak áno,
je to nesúlad medzi tým, čo hovorí stránka, a čo hovoria e-maily. **Neoverené.**

**7. `Lead` z Cal.com webhooku** — dnes sa nevie, koľko klikov skončí rezervovaným
termínom. Prevádzkovo to slepé nie je (mail o leade), chýba len číslo do Ads
Managera.

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
