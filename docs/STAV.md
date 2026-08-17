# STAV — kde sme skončili

## 🆕 17. 8. 2026 — čo pribudlo za 15.–17. 8. (zhrnutie)

| Vec | Stav |
|---|---|
| Klikacie odpovede na výsledku | **NASADENÉ 17. 8.** (`sw` v30, `app.js?v=8`) |
| E-mailový most: preč od telefónu ku Google Kalendáru | **NASADENÉ** (`quizLead` v38, `quizBridge` v31) |
| `quizBridge` — poistky proti odoslaniu registrovaným | **NASADENÉ** (v31) |
| `sendOneReply` — pätička a zápis do `email_logs` | **NASADENÉ** (v2) |
| Migrácia 009 — stavy vybavovania žiadostí | **SPUSTENÁ** |
| Odpovede 5 ženám (v5 kontakty) | **ODOSLANÉ 17. 8. ~16:09 a 16:39** (ručne, mimo systému) |
| 8 nadviazaní na ženy z 11. 8. | ⚠️ **NAPÍSANÉ, NEODOSLANÉ** |
| Test písomného dvojkroku | **BEŽÍ** — menovateľ 5, dozreje 20. 8. (sekcia nižšie) |

**Ako to overiť:** `curl -s https://kviz.valyra.sk/sw.js | head -1` → `v30`;
`npx supabase migration list --linked` → 009 má vyplnené `remote`;
`npx supabase functions list` → quizBridge v31, quizLead v38, sendOneReply v2.

**⚠️ Najdôležitejšie číslo:** za celý čas kampane je **0 € tržieb**.

⚠️ **OPRAVA 17. 8.:** doteraz sa to tu rámovalo cez `client_accesses` (16 riadkov,
všetky trial, `paid_started_at` prázdne). **Tak sa to merať nemá.** Zámer je predať
8-týždňový program cez telefonát alebo správu; **Valyra je nástroj v platenej
spolupráci, nie samostatný produkt**. Appka nemá funkčný checkout, takže nula
v `client_accesses` je **očakávaný stav, nie zlyhanie lievika**.

Skutočná miera úspechu je **kontakt → uzavretá platená spolupráca**, a tá je
**0 zo 17** reálnych kontaktov (18 riadkov mínus 1 vlastný test).

---

## 🧪 17. 8. 2026 — TEST: písomný dvojkrok po žiadosti o kontakt

**Prečo:** 15 z 18 kontaktov je písomných, v kalendári nie je ani jedna rezervácia.
Skutočný ďalší krok človeka teda nie je rezervácia termínu, ale **odpoveď na e-mail**.
Doteraz sa kontakt vybavoval jednorazovou odpoveďou; odteraz je to **rozhovor na dva
kroky** — prvá správa nemá predávať, má len rozhovoriť.

### Ako má vyzerať prvá odpoveď

| Musí obsahovať | Nesmie obsahovať |
|---|---|
| jeden **konkrétny pravdivý detail** z jej analýzy alebo zvolenej odpovede | sľub termínu odpovede („ozvem sa do 24 h") |
| jednu **otázku zodpovedateľnú jedným slovom** | tvrdenie, že to nie je automat / že píšem osobne |
| možnosť **„alebo je to inak"** | ponuku hovoru, kalendára ani Valyry |
| | generický copy-paste bez detailu o konkrétnej osobe |

Príklad tvaru: *„Napísala si, že ti to praská večer doma. Je to vtedy skôr hlad,
únava, alebo stres — alebo je to inak?"*

„Alebo je to inak" nie je kozmetika — bez neho má človek na výber buď odpovedať
nepresne, alebo neodpovedať vôbec. Núti si vybrať z mojich domnienok.

**Detail ber:** pri novších kontaktoch z vybranej odpovede (`Praská mi to večer doma`),
pri starších iba z voľného textu v `message`.

### Menovateľ testu — presne 5

Overené v živých dátach 17. 8. Do testu patrí riadok `quiz_calls`, ktorý má **súčasne**
`quiz_version = 5`, `status = awaiting_reply`, vyplnené `outreach_sent_at`
a `outreach_channel = email`.

| Skupina | Počet | Do testu? |
|---|---|---|
| v5, `awaiting_reply`, oslovenie zapísané | **5** | ✅ **jediný menovateľ** |
| v5, `closed` bez dôkazu odpovede (13. a 14. 8.) | 2 | ❌ nemiešať |
| v3, `closed` | 8 | ❌ samostatná kohorta `reaktivácia` |
| v3, `new` | 3 | ❌ z toho 1 je vlastný test, 2 sú nevybavené telefonáty |

⚠️ **Starých 10 v3 kontaktov do tohto testu nepatrí.** Nevie sa, čo presne dostali ani
či odpovedali. Ak sa im niekedy ozve znova, meraj ich **zvlášť ako `reaktivácia`**,
nie ako pokračovanie dvojkroku.

### ⚠️ Čo tí piati reálne dostali (dôležité pre záver)

Správy odišli **17. 8. ~16:09 (4 ženy) a ~16:39 (1 žena)**, ručne, mimo systému.
Obsahovali **dva z troch prvkov: detail + otázku na jedno slovo. „Alebo je to inak"
tam nebolo.**

Preto ak odpovede neprídu, **nedá sa povedať, či je to typom správy, alebo tým
chýbajúcim prvkom.** Nezapisovať to ako „dvojkrok nefunguje" — testoval sa neúplný.
Ďalšie oslovenia už majú mať všetky tri prvky.

⚠️ **Slepé miesto:** správy odoslané z Gmailu sa **nikde nezaznamenávajú** — ani obsah,
ani fakt odoslania. `email_logs` a `email_events` vidia len to, čo ide cez Resend.
V okne 14:09–14:39 UTC je v oboch tabuľkách len automatika (`bridge_0`, notifikácie).
Overené volaním.

### Pravidlá zápisu — dodržať doslova

| Kedy | Čo nastaviť |
|---|---|
| **Pri odoslaní mojej správy** | `status = awaiting_reply`, `outreach_sent_at`, `outreach_channel = email` |
| **Až keď človek naozaj odpovie** | `status = replied`, `lead_replied_at` |

- ⚠️ **`quiz_leads.replied_at` NIKDY nepoužívať ako mieru odpovede človeka.** Označuje
  moment, keď Ján rozposlal odpovede. K 17. 8. má tri hromadné zápisy na rovnakú
  sekundu: 8× `11. 8. 10:12:37`, 2× `14. 8. 19:05:14`, 5× `17. 8. 14:11:55`.
- ⚠️ **Nikdy neaktualizovať `quiz_calls` podľa e-mailu, iba podľa `id`.**
- ⚠️ **Nezapisovať odpoveď z pocitu, že výmena „už je vybavená".** K 17. 8. je
  `lead_replied_at` vyplnené **0×** — teda systém eviduje nula reálnych odpovedí.
  To znamená „nesledované", nie preukázateľne „nula".
- **Zatiaľ nepridávať tretí stĺpec ani nový stav.** Prvý test meria jedinú vec:
  **oslovený → skutočne odpovedal.**

### Kedy a ako vyhodnocovať

**„Dozretý kontakt" = aspoň 72 hodín od `outreach_sent_at`.**
Všetkých 5 dozreje **20. 8. 2026 medzi 16:09 a 16:39** (nie skôr — 72 h sú tri dni).

| Dozretých oslovení | Čo robiť |
|---|---|
| 5–10 | **iba zbierať dáta, nerobiť záver** |
| 20, z toho 0–1 odpoveď | varovný signál → najprv audit doručiteľnosti, času, predmetu, obsahu a publika |
| 20, z toho 2–3 odpovede | pokračovať do 30 |
| 20, z toho 4+ odpovedí | dvojkrok držať, až potom riešiť ďalší krok |

⚠️ **Nízka odpoveď sama osebe nedokazuje príčinu.** Bez porovnávacej verzie môže ísť
o text, oneskorenie, publikum alebo doručenie.

⚠️ **Tým piatim nič neposielať znova.** Dnes už správu dostali; druhá by bola presne
tá chyba s dvojitým mailom (9. 8. ju dostalo 90 ľudí).

---

## 📐 17. 8. 2026 — opravy čísel po celolievikovej analýze

Prepočítané z živých dát (PostgREST so stránkovaním) a Ads API. **Toto prepisuje
staršie tvrdenia nižšie v dokumente.**

### v5 NIE JE dokázane lepšia než kohorta B

Fisherov exaktný test (pri jednotkách konverzií je chí-kvadrát nevhodný):

| Porovnanie | Podiely | p | Záver |
|---|---|---|---|
| A (gate so slúchadlom) vs B (bez neho) | 1/205 vs 9/190 | **0,0085** | ✅ **preukázané** — sľub telefonátu škodil |
| A vs v5 | 1/205 vs 7/83 | **0,0008** | ✅ preukázané |
| **B vs v5** | 9/190 vs 7/83 | **0,27** | ❌ **nepreukázané** |
| v4 vs v5 | 0/32 vs 7/83 | 0,19 | ❌ nepreukázané |
| analýza vs kvíz (kontakty) | 18/504 vs 0/232 | **0,0014** | ✅ preukázané |

**Čo to znamená:** máš dobrý dôkaz, že **zrušenie sľubu telefonátu** (6. 8.) zabralo.
Nemáš dôkaz, že v5 pridala niečo **navyše oproti B**. Číslo 8,4 % je zlučiteľné s tým,
že v5 nezmenila nič. Nepísať „v5 funguje" bez tejto výhrady.

### Telefonické žiadosti: sú DVE, nie tri

Riadok z **31. 7. 16:24 je vlastný test** (meno „janci", vlastná adresa). Reálne
nevybavené telefonické žiadosti sú **2** — staré 14 a 7 dní, obe `status = new`.

### Krok „klik → zobrazená stránka" je stabilný, nie zhoršujúci sa

Kampaň „Analýza", 31. 7. – 17. 8., deň po dni:

| Obdobie | Klik → zobrazenie | Klikov |
|---|---|---|
| plný rozpočet (31. 7. – 12. 8.) | 69,6 % | 1 511 |
| stlmené na 1 €/deň (13. – 17. 8.) | **72,1 %** | 272 |

Útlm rozpočtu tento krok **nezhoršil**. ~30 % strata je bežná hranica merateľnosti
pixelom (mobil, pomalé pripojenie, zavretie pred dokreslením), nie chyba stránky.
**Neinvestovať sem** — zvyšovalo by to objem, a objem dnes nie je limit.

Celý lievik za obdobie, **64,01 €** minutých:

| Krok | Počet | Konverzia |
|---|---|---|
| Kliky | 1 783 | — |
| Zobrazenie stránky | 1 247 | 69,9 % |
| E-mail (`CompleteRegistration`) | 520 | 41,7 % |
| Žiadosť o kontakt (`Lead`) | 17 | 3,3 % |

Kampaň na kvíz minula pred zastavením ďalších **72,96 €** → 232 leadov, **0 kontaktov**.

### „Veľkosť cieľa predpovedá, kto sa ozve" — efekt je slabší, než sa písalo

Pôvodne uvádzané −21 kg vs −10 kg. Prepočítané na dnešné dáta: medián cieľa u tých,
čo sa ozvali, je **−14 kg** (n = **7**, len toľkí majú vyplnené `a_*`), u všetkých
leadov s dátami **−11 kg** (n = 132). Je to **smer, nie zistenie** — pri n = 7 sa naň
nedá spoľahnúť.

### Cal.com: oprava funguje, ŽIADNA chyba tu nie je

⚠️ **Toto som najprv ohlásil ako chybu a bolo to zle.** Zapisujem aj postup overenia,
nech sa to nezopakuje.

Klik na cal.com **16. 8. o 16:08** zo šablóny `bridge_10` vyzeral ako dôkaz, že oprava
z 15. 8. nepokryla všetky šablóny. **Nie je.** Ten e-mail **odišiel 12. 8. o 07:31** —
tri dni pred opravou. Je to presne prípad popísaný nižšie: staré maily v obehu.

Rozhoduje **čas odoslania mailu**, nie čas kliku:

| Odkaz | Najnovší mail, z ktorého prišiel klik |
|---|---|
| cal.com (11 klikov) | **12. 8. 07:31** — všetky pred opravou |
| Google kalendár (6 klikov) | **16.–17. 8.** — všetky po oprave |

Čistý predel. **Z každého mailu odoslaného po oprave sa klikalo výhradne na Google.**
V `supabase/functions` sa reťazec `cal.com` nevyskytuje ani raz; odkaz sa ťahá
z `Deno.env.get('CAL_URL')` s fallbackom na `calendar.app.google/…`
(`_shared/bridgeTemplates.ts:140`, `sendHotBatch/index.ts:92`).
`bridge_5/7/10/14` sú v poriadku, **netreba na nich nič meniť**.

Rozpad všetkých 60 klikov v e-mailoch (z 3 374 odoslaných = 1,8 %):
**38 odhlásenie (63 %)**, 11 cal.com, 6 Google kalendár, 5 valyra.sk.

### Sledovanie otvorení je preukázateľne vypnuté

`email_events` má `{sent: 3374, delivered: 3308, clicked: 60, bounced: 68}` —
udalosť `email.opened` sa nevyskytuje **ani raz**. Doručiteľnosť je pritom v poriadku
(bounce 2,0 %).

---

## 15. 8. 2026 — ťuknutie namiesto písania („kedy ti to praská")

**NASADENÉ 17. 8. 2026.** Overené na živej stránke: `sw.js` v30,
`analyza/app.js?v=8`, `analyza/analyza.css?v=4`, obsah bajt na bajt zhodný
s commitom `1049f1e`.

**Prečo:** pixel prvýkrát ukázal mikro-lievik na stránke a vyvrátil hypotézu, na ktorej
stála väčšina doterajších zmien. K výzve na konzultáciu **doscrolluje 90 % ľudí**
(`ConversationView` ~36 pri ~40 analýzach) — ponuku teda vidia. Ale do prázdneho poľa
začnú písať **traja**. To je 92 % strata na jedinom kroku a najväčšia v celom lieviku.
Kto raz začne písať, ten dokončí (2 z 3). Prah je celý v prvom písmene.

**Zmena:** namiesto prázdnej textarey sú štyri veľké tlačidlá — *Večer doma · Cez deň
v práci · Cez víkend · Už po pár dňoch*. Pole na vetu aj tlačidlo na odoslanie sú
**skryté, kým človek neťukne**. Veta je potom **NEPOVINNÁ** — samotné ťuknutie stačí
na odoslanie.

- Správa sa skladá: `Praská mi to večer doma.` + prípadná dopísaná veta pod tým.
  Backend vyžaduje neprázdnu správu (CHECK v `quiz_calls`), takže prázdna sa neodošle.
- Otázka mieri na to, čo o človeku **ešte nevieme** — problém, históriu, vek aj kalórie
  máme z formulára, kedy mu to praská nie.
- Potvrdenie po odoslaní rozlišuje, či človek písal: kto len ťukol, nedostane
  „čo si napísala", ale „kedy ti to praská".

**Nová udalosť `BreakPointSelected`.** `MessageStart` ZÁMERNE zostáva viazaný na
písanie — keby dostal význam „ťukol", porovnanie verzií by sa ticho rozbilo.

**Otestované** (localhost, 375 px, stubnuté `fbq` aj `fetch`): pole aj tlačidlo skryté
pred ťuknutím a viditeľné po ňom, `aria-pressed` sedí, odoslanie **bez písania**
(správa 24 znakov), odoslanie s vetou, ženské aj mužské skloňovanie, potvrdenie v oboch
podobách, telefónna cesta nedotknutá. Screenshot v paneli padá na timeout — overované cez DOM.

**Čo z toho ešte NIE JE:** `quiz_calls` nemá stĺpec na uloženie voľby zvlášť — nesie ju
text správy. Na analýzu po segmentoch by chcel vlastný stĺpec (migrácia + backend).

**Prah:** pred zmenou klikalo na konzultáciu 7 z 80 ľudí (8,8 %). Ak sa to pri ďalších
~80 leadoch nepohne, prah nie je v písaní a treba sa vrátiť k tomu, čo ponuka sľubuje.

---

## 17. 8. 2026 — e-maily prestali sľubovať telefonát

**NASADENÉ** (`quizLead` v38, `quizBridge` v31). Repo `valyra`, commit `eb85c40`.

Stránka prestala sľubovať telefonát už 6. 8. a konverzia vtedy skočila z 0,5 % na 4,7 %.
**E-maily tú istú opravu nikdy nedostali.** Všetkých 8 malo tlačidlo `📞 Rezervovať`
a hovorilo „15 minút po telefóne", pritom:

- rezervačná stránka mala za mesiac **10 klikov z 2 581 doručených e-mailov**
- **12 z 13 kontaktov prišlo písomne**, jediný telefonát nedvihla
- 68 % všetkých klikov v e-mailoch je **odhlásenie**

Zmeny: `ctaLabel` → `Vybrať si termín — 15 minút, nezáväzne` (sedí s názvom rezervačnej
stránky), z `callBlock`, `bridge_0`, `bridge_1` a `bridge_3` zmizlo „po telefóne"
aj „volám ja, ty len zdvihneš". `bridge_0` priznáva reálnu dostupnosť (všedné dni
podvečer, overené: 18:30–19:15) a pridáva cestu „stačí odpísať na tento e-mail".

**Cal.com sa v celom backende už nevyskytuje.** Odkaz je `calendar.app.google/…`
a ťahá sa z env `CAL_URL` — **secret prebije kód**, takže pri zmene ho treba meniť tam.

### quizBridge — poistky proti odoslaniu registrovaným

4. 8. odišiel most **17 registrovaným ľuďom naraz**. Príčina: starý kód čítal profily
cez `usersRes.data ?? []` a chybu čítania ticho prehltol — prázdna množina neblokuje
nikoho. Commit `53a0cfa` (4. 8.) to vyriešil a **od vtedy je chybných odoslaní nula**.

Pridané ako druhá vrstva: `trim()` pri porovnávaní adries na **všetkých štyroch**
miestach (orezať len jednu stranu by rozbilo dedup a most by odišiel dvakrát)
a zastavenie behu, ak je zoznam registrovaných prázdny pri neprázdnych leadoch.
Odsimulované na ostrých dátach — s `trim()` aj bez neho by most odišiel rovnakým
277 ľuďom.

---

## 17. 8. 2026 — migrácia 009: koniec zavádzajúceho `called`

**SPUSTENÁ.** Repo `valyra`, commit `8fddcf9`.

Doteraz existoval len boolean `called`. Používal sa na „vybavené", lenže **zo 17
žiadostí je 14 písomných** — zapisovať im `called = true` znamená tvrdiť, že sa volalo.

Rovnaká zámena už raz nastala pri `quiz_leads.replied_at`: to pole označuje moment,
keď **Ján rozposlal odpovede**, nie keď odpovedali ženy. Všetkých osem z 11. 8. má
v ňom rovnakú sekundu. **Nepoužívať ho ako „ona odpovedala".**

Nové stĺpce v `quiz_calls`: `status` (`new` | `awaiting_reply` | `replied` | `closed`),
`outreach_sent_at` (ozvali sme sa MY), `lead_replied_at` (odpovedal ČLOVEK),
`outreach_channel` (`email` | `phone`). Doterajšie `called = true` sa prepísalo
na `closed`, **nie na `replied`** — či odpovedali, z dát nevieme.

⚠️ **`quiz_calls` zakladá samostatný riadok na každý pokus.** Aktualizovať vždy podľa
`id`, nikdy `where email = ...` — taký príkaz prepíše aj staré uzavreté pokusy.
(K 17. 8. má 17 riadkov 17 rôznych adries, takže dnes by škodu nespravil.)

---

## ⚠️ 17. 8. 2026 — čaká na odoslanie (nie je hotové)

**Štyri ženy sa ozvali a nemajú odpoveď** (16. 8. ráno, 16. 8. večer ×2, 17. 8.
poobede). Texty sú napísané, skript `posli-odpovede.js` hotový, migrácia 009
spustená — chýba len `REPLY_SECRET`, ktorý vie zadať len Ján.

Konkrétne mená, adresy a znenia sú **mimo repa** (pracovný priečinok) — toto repo
je verejné a osobné údaje leadov do neho nepatria. V databáze ich nájdeš cez
`select * from quiz_calls where status = 'new' and phone is null`.

**Osem nadviazaní** na ženy, ktoré 11. 8. dostali tú istú šablónu a **ani jedna
neodpísala**. Texty priznávajú predošlý e-mail a končia jednou otázkou.

**~~Tri telefonické žiadosti visia 17, 14 a 7 dní.~~ VYBAVENÉ 17. 8.** Boli **dve**
(14 a 7 dní), tretí riadok je vlastný test z 31. 7. Po takom čase telefonát nedáva
zmysel, preto sú **obe zavreté** (`status = closed`, aktualizované podľa `id`).
`outreach_sent_at` aj `lead_replied_at` ostali prázdne — nikto sa im neozval,
a zapisovať opak by klamalo.

**Úzke miesto sa presunulo.** Stránka teraz vyrába kontakty rýchlejšie, než sa
stíhajú vybavovať: v5 je na **7,5 % (6 z 80)** oproti 4,7 % vo v3 a 0 % vo v4.
Ďalší zisk už nie je na stránke, ale v tom, čo sa stane po kontakte.



## 13. 8. 2026 — reklama zámerne stlmená na 1 €/deň

**Nie je to porucha.** Ján znížil denný rozpočet na 1 € — dôvod bol, že lievik
za 50 € nepriniesol platiaceho klienta. Doručovanie teda kleslo podľa očakávania
a netreba to hľadať pri platbe ani pri zamietnutí reklamy.

Priebeh podľa Ads API (kampaň je stále `ACTIVE`):

| Deň | Minuté | Zobrazenia | Kliky |
|---|---|---|---|
| 9. 8. | 8,07 € | 4 558 | 224 |
| 10. 8. | 6,98 € | 4 331 | 195 |
| 11. 8. | 4,68 € | 2 571 | 144 |
| 12. 8. | **1,11 €** | **498** | **22** |
| 13. 8. | **žiadny riadok** | — | — |

Sedí to s databázou: 12. 8. prišli **3 leady**, 13. 8. **nula**. Predtým ~50 denne.

**Dôsledok pre v5:** bez premávky sa nová verzia nemá na čom odmerať. Nasadiť sa dá
kedykoľvek, porovnanie s kohortou B ale začne až keď sa rozpočet vráti hore.

⚠️ **Poradie, ktoré dáva zmysel:** najprv nasadiť v5, až potom zvyšovať rozpočet.
Opačne by sa platilo za premávku cez obrazovku, o ktorej vieme, že 98 % ľuďom
ponuku neukáže.

**Čo NIE JE overené a pri rozhodovaní o rozpočte to treba vedieť:** lievik dal
10 žiadostí o kontakt a **ani jedna nebola vybavená** až do 11. 8. — všetkých 10
riadkov v `quiz_calls` malo `called = false` a v `quiz_leads` `replied_at = null`.
Nula platiacich teda zatiaľ nehovorí o kvalite leadov; hovorí o tom, že sa s nimi
nepracovalo. Prvý test tejto hypotézy sú odpovede odoslané 11. 8.

---

## 13. 8. 2026 — stav nasadenia (overené volaním, nie z gitu)

**v5 JE NAŽIVO.** Nasadené 13. 8. 2026 v poradí migrácia → `quizLead` → stránka.

| Vec | Stav (overené volaním) |
|---|---|
| Migrácia `008` | ✅ spustená — `quiz_version`, `selected_path`, `creative_id`, `consult_requested_at` v DB sú |
| `quizLead` | ✅ nasadený — sonda `{"typ":"cesta"}` vracia „Chyba leadId alebo neznama cesta", teda novú vetvu pozná |
| Stránka | ✅ `FUNNEL_VERSION: 5`, `sw v27`, `readiness-card` sa v súbore nevyskytuje ani raz |
| E-mailová stena | ✅ len meno, e-mail, súhlas — otázka na pripravenosť je preč |
| Výsledok | ✅ dva bloky: „Tvoj ďalší krok / Kde sa ti to zvyčajne rozpadne?" a pod ním „Druhá možnosť / Valyra" |
| `creative_id` z URL | ✅ overené na `?ad_id=…` — zachytí sa a drží v sessionStorage |
| Stĺpce `a_*` | ✅ nasadením `quizLead` sa začnú plniť (dovtedy boli prázdne) |

⚠️ **Zmeny sú NECOMMITNUTÉ.** Vercel nasadzuje obsah priečinka, nie git, takže
naživo to beží, ale v `main` to nie je. Na druhom počítači to po `git pull`
nebude — kým sa to nescommituje.

⚠️ **`{{ad.id}}` v URL reklamy zatiaľ NIE JE.** Kým sa nedoplní v Ads Manageri,
`creative_id` ostane pri reálnych leadoch prázdne. Kód je pripravený.

---

## 13. 8. 2026 — REFERENČNÝ SNAPSHOT pred lievikom v5

**Snapshot: 13. 8. 2026, 15:36 Europe/Bratislava (13:36 UTC).** Toto je stav, proti
ktorému sa bude merať v5. Nič z toho neprepisuj — keď budú nové čísla, pridaj ich vedľa.

**Prečo v5:** z ľudí, ktorí nechajú e-mail, si konzultáciu vypýta 2,3 %. Reklama ani
zber e-mailov nie sú problém. Vo v4 sa otázka na pripravenosť pýta **na e-mailovej stene
a je povinná** (`submitLead()` bez nej neodošle), takže stojí medzi človekom a tým
najhodnotnejším krokom v lieviku. Zároveň 51 % ľudí vyberie „len si pozriem výsledok"
a tým sa im ponuka vypne úplne. **v5 tú otázku ruší** a nahrádza ju dvoma CTA pod
výsledkom — o ceste rozhoduje klik, nie vyhlásenie.

### Reklama — kampaň „Analýza – CompleteRegistration"

Okno `last_30d` k 12.–13. 8. 2026 (teda zhruba 14. 7. – 13. 8.). **Pri ďalšom ťahaní
zadaj presné dátumy**, nie preset — inak sa okno posunie a čísla nebudú porovnateľné.

| Krok | Počet | Konverzia | Cena |
|---|---|---|---|
| Zobrazenia | 25 747 | — | — |
| Kliky | 1 489 | CTR 5,78 % | CPC 0,03 € |
| Načítanie stránky | 1 036 | 69,6 % z klikov | — |
| E-mail (`CompleteRegistration`) | 433 | **41,8 %** z načítaní | 0,12 € |
| Konzultácia (`Lead`) | 10 | **2,3 %** z e-mailov | 5,03 € |

Minuté spolu **50,28 €**. Dve porovnávané kreatívy (nepokrývajú celú kampaň):

| Kreatíva | Registrácie | Konzultácie | % |
|---|---|---|---|
| „čas do cieľa" | 67 | 5 | **7,5 %** |
| pôvodná | 323 | 5 | 1,5 % |

⚠️ Nebežali za rovnakých podmienok ani v rovnakom čase — je to indícia, nie čistý test.

### Databáza

`quiz_leads`: **427** riadkov so `source = 'osobna-analyza'` (celkom 659 vrátane kvízu).
`quiz_calls`: **11** riadkov, z toho 1 vlastný test → **10 reálnych kontaktov**.
Všetkých 10 je z analýzy, **z kvízu ani jeden**. 8 písomných, 2 telefonáty.

### Kohorty (pravidlo priradenia: dátum vytvorenia leadu)

Okno pozorovania: **kontakt do 7 dní od vytvorenia leadu**, aby staršia kohorta nemala
výhodu dlhšieho času.

> ⚠️ **OPRAVA 14. 8. 2026 — toto pravidlo je nepresné a takto sa už deliť nemá.**
>
> `quizLead` robí `.upsert(lead, { onConflict: 'email' })` ([quizLead/index.ts:379]).
> Tabuľka má teda **jeden riadok na e-mail**, nie jeden na vyplnenie. Kto sa vráti
> a vyplní analýzu znova, prepíše si vlastný riadok: `created_date` ostane z PRVEJ
> návštevy, všetky ostatné polia sú z POSLEDNEJ.
>
> **Rozsah:** 36 zo 450 leadov analýzy (**8 %**) má `updated_date` o viac než hodinu
> neskôr než `created_date`. Jeden sa vrátil po 22 dňoch. Dva z 25 riadkov s
> `quiz_version = 5` majú dátum spred nasadenia v5.
>
> **Čo to kazí:**
> 1. Kohorta podľa `created_date` zaradí vrátivšieho sa človeka k prvej návšteve,
>    hoci nesie hodnoty z poslednej.
> 2. Sedemdňové okno takého človeka **zahodí úplne** — konverzia deväť dní po prvej
>    návšteve nespadne do žiadnej kohorty.
> 3. Počty sa nedajú porovnávať s Metou jedna k jednej: DB ráta **ľudí**, Meta ráta
>    **udalosti**. Rozdiel 433 (Meta) vs 426 (DB) teda nie je len o atribučných
>    oknách, ako tu pôvodne stálo — časť z neho sú opakované vyplnenia.
>
> **Ako deliť kohorty odteraz:**
> - primárne podľa **`quiz_version`** — je to presné a preto sme ten stĺpec pridali
> - časovo podľa **`updated_date`**, nikdy nie `created_date`
> - riadok popisuje POSLEDNÚ interakciu človeka, čo je pre vyhodnotenie lievika
>   správne: konvertoval (alebo nie) pod tou verziou, ktorú videl naposledy
>
> **Čísla nižšie tým ovplyvnené nie sú** — všetkých 10 historických kontaktov prišlo
> do 4 minút od vytvorenia leadu, takže medzi nimi vrátivší sa nie je ani jeden.

| Kohorta | Obdobie | Leadov | Kontakt do 7 dní | % | Dozretých |
|---|---|---|---|---|---|
| A | do 6. 8. (v3, gate so slúchadlom) | 205 | 1 | **0,49 %** | 91 % |
| B | 7.–10. 8. (v3, gate bez slúchadla) | 190 | 9 | **4,74 %** | 0 % |
| C | od 11. 8. (v4) | 32 | 0 | **0 %** | 0 % |

**Kohorta B je referencia pre v5**, nie kohorta C — tá má 32 leadov a nula z 32 je
zlučiteľná s čímkoľvek do ~11 %. **v4 teda NIE JE dokázane horšia**, len nemeraná.

⚠️ **Hranica 10. 8. je nečistá.** v4 sa nasadilo počas dňa a `quiz_leads` verziu lievika
neukladá, takže kohorty sa dajú deliť len podľa dátumu. Presne toto rieši migrácia
`008_quiz_leads_funnel_v5.sql` — od v5 bude `quiz_version` v riadku.

### Kľúčové zistenie: konzultácia sa vyhráva do 4 minút

Oneskorenie medzi zadaním e-mailu a žiadosťou o kontakt, všetkých 10 reálnych prípadov:
**medián 2,6 min, maximum 3,9 min.** Nikto sa nikdy nevrátil neskôr.

Z toho plynie:
- 7-dňové okno je formálne správne, ale prakticky bezpredmetné — **v5 sa dá vyhodnotiť
  do dvoch dní**, netreba čakať týždeň.
- Konzultácia vzniká **výlučne na obrazovke výsledku**. Nikde inde.
- **Mostová séria nemá na konte ani jednu žiadosť o konzultáciu** za 427 leadov.
- ⚠️ **Slepé miesto:** keby niekto odpísal priamo na Gmail, nikde sa to nezaznamená.
  `quiz_calls` pozná len žiadosti z formulára.

### Rozdelenie pripravenosti vo v4 (n = 51)

| Voľba | Podiel | Čo dostala na výsledku |
|---|---|---|
| `informacie` | **51 %** | nič — žiadna ponuka ani konzultácia |
| `plan` | **47 %** | Valyra; telefón vôbec, písanie skryté za tlačidlom |
| `podpora` | **2 %** | konzultácia naplno |

Konzultácia sa naplno ponúka vetve, ktorú si vyberú 2 % ľudí.

### Metriky, podľa ktorých sa v5 hodnotí

Odstránením povinného poľa sa zmení **veľkosť aj zloženie** leadov. Preto sa
`e-mail → konzultácia` **nesmie** brať ako hlavné číslo — môže klesnúť aj keď je
lievik lepší. Menovatele, ktoré sa zmenou nehýbu:

| Metrika | Dnes |
|---|---|
| **Cena za konzultáciu** (hlavná) | 5,03 € |
| **Konzultácie na 100 načítaní stránky** | 0,97 |
| Návšteva → e-mail (trenie) | 41,8 % |
| E-mail → konzultácia (kvalita leadov) | 2,3 % |

### Použité dotazy

```
GET /rest/v1/quiz_leads?select=email,created_date,source&source=eq.osobna-analyza&order=created_date.asc
GET /rest/v1/quiz_calls?select=created_date,name,email,phone,message,source,tier&order=created_date.asc
GET /rest/v1/profiles?select=email,created_date,role&order=created_date.desc
```
Dátumový stĺpec je **`created_date`**, nie `created_at`. Kohorty a oneskorenie sa
počítali lokálne párovaním `quiz_calls.email` ↔ `quiz_leads.email`.

### Rozpočet a poradie nasadenia

Denný rozpočet ~1,7 €, rozdelenie kreatív zatiaľ **nezmenené**. Reklama sa necháva
tak ešte 48–72 h po nasadení v5 — nie kvôli atribúcii (na tú je objem malý), ale aby
sa počas kontroly novej obrazovky hýbala jediná premenná. **Úprava kampane cez MCP ju
navyše zhodí do pauzy**, čo by v tom okne rozbilo prítok. Čas zmeny rozpočtu zapíš sem.

---

## 10. 8. 2026 — `/analyza` sa pýta na pripravenosť a rozvetvuje výsledok

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
