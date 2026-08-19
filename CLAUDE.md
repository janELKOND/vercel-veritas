# vercel-veritas — kvíz „Pravda o chudnutí"

Lead-gen PWA nasadená na Verceli. Zbiera odpovede, zaradí človeka do segmentu,
vypýta e-mail a na výsledku ponúkne kontakt (telefón **alebo** správa).

⚠️ **Cieľom lievika nie je registrácia do appky.** Predáva sa **8-týždňová platená
spolupráca cez hovor alebo písomnú konzultáciu**; Valyra je nástroj v nej, nie
samostatný produkt (pivot 24. 7. 2026). Staršie dokumenty merajú lievik cez
registrácie a trialy — to je opustený model.

## Súbory

| Súbor | Čo je to |
|---|---|
| `index.html` · `app.js` | **kvíz** „Pravda o chudnutí" — logika, segmentácia, výsledok, odoslanie leadu |
| `analyza/index.html` · `analyza/app.js` | **osobná analýza** — druhý lead magnet, beží vedľa kvízu a je **dnes hlavný zdroj leadov**. Vlastná kópia výsledku a `submitCallback` — **meniť súbežne s `app.js`** |
| `style.css` | zdieľaný oboma stránkami (`.diagnosis`, `.offer`, `.callback`, `.way-tab`) |
| `sw.js` | service worker — **pri zmene bumpni verziu cache** aj `?v=` v oboch `index.html`, inak ľudia uvidia starú verziu |
| `apps-script.gs` | pozostatok — zápis do Sheetu; **živá cesta je Supabase funkcia `quizLead`** |
| `NAVOD.md` | pôvodný návod k projektu |

## Čítaj pred zmenami

⚠️ **Jediný dokument, ktorý hovorí o SÚČASNOSTI, je `STAV.md`.** Všetky ostatné sú
datované a čiastočne prekonané — a už dvakrát spôsobili falošný nález („cielenie nie
je nastavené", „formulár je vypnutý"). **Nikdy nevyvodzuj dnešnú prioritu z plánov.**
Ich hlavičky hovoria, čo z nich platí; sekcie sú označené priamo v texte.

| Dokument | Dátum | Ako ho čítať |
|---|---|---|
| ⭐ **[`docs/STAV.md`](docs/STAV.md)** | priebežne | **Začni tu.** Zdroj pravdy. Najnovšie sekcie sú **hore** a prepisujú staršie nižšie |
| [`docs/VYSLEDOK-A-PONUKA.md`](docs/VYSLEDOK-A-PONUKA.md) | 30. 7. (v3) | **mechanika** výsledku — diagnóza, tiering, `noPressure`, meranie, payload. Mechanika platí; „dnes" v texte znamená 30. 7. |
| [`docs/SUPABASE-REZERVACIA.md`](docs/SUPABASE-REZERVACIA.md) | 30. 7. | 🗄️ historický návod, **všetko hotové**. Vysvetľuje, prečo klient vyžaduje `kind`, nie len `200` |
| [`docs/PLAN-HOVORY.md`](docs/PLAN-HOVORY.md) | 30. 7. | 🗄️ čiastočne vykonaný, čiastočne prekonaný. Jeho predpoklad „cieľ = rezervovaný hovor" **sa nepotvrdil** — 0 rezervácií, 15 z 18 kontaktov písomne |
| [`docs/PLAN-LIEVIKA.md`](docs/PLAN-LIEVIKA.md) | 23. 7. | 🗄️ **pred pivotom.** Metriky opusteného self-serve modelu (lead → registrácia → trial). Platia z neho len reklamné čísla a sekcia 9 |
| [`docs/PLAN-7DNI.md`](docs/PLAN-7DNI.md) | 30. 7. | 💤 návrh, **zámerne nezačatý** — tretí magnet. Vrátiť sa až keď zlyhá oslovenie teplých leadov |

**Na tomto projekte platí, že zmergované ≠ nasadené** (kód býva v `main`, ale Supabase
funkcia beží stará). Príkazy na overenie nasadenia sú v `STAV.md` a v skille `stav`.

## Kde sme skončili

Napíš **„skontroluj si a pokračuj"** (alebo `/stav`, „kukni do githubu") a spustí sa
skill [`.claude/skills/stav`](.claude/skills/stav/SKILL.md): načíta
[`docs/STAV.md`](docs/STAV.md), **overí volaním**, čo je reálne nasadené (stránka aj
Supabase funkcia), pozrie otvorené PR v oboch repách a povie ďalší krok.

**Projekt je v dvoch repách:** `vercel-veritas` (kvíz, verejné) a `valyra` vetva
`supabase-migration` (funkcia `quizLead` — príjem leadu, e-maily, notifikácie).
Ján pracuje na dvoch počítačoch, takže najprv `git pull`.

## Na čo si dať pozor

**Dva pixely.** Stránka inicializuje `2221207801987418` (patrí ad účtu) aj
`1529505581872759` (veritas). **Ad účet k druhému NEMÁ prístup** — konverzie
poslané naň sú pre reklamu neviditeľné. Na adresné odoslanie je v `app.js`
helper `trackAd()`; vlastné eventy musia ísť cez `trackSingleCustom`, štandardné
cez `trackSingle` (zámena = pixel event zahodí).

**Kapacita v ponuke musí zostať pravdivá.** `CONFIG.OFFER.SPOTS_PER_MONTH` a
`SPOTS_LEFT` sa píšu na výsledkovú stránku ako voľné miesta. Keď čísla prestanú
sedieť, nastav `SPOTS_LEFT` na `null` — veta o miestach sa prestane zobrazovať.
Vymyslené miesta, ktoré sa nikdy nemenia, ľudia odhalia a stoja dôveru.

**`ConsultClick` nie je rezervácia**, je to len klik na rezervačnú stránku. Skutočný počet
hovorov z reklamy sa dá merať až podľa rezervácií v Google Kalendári — do vtedy je
konverzia hovoru odhad. Pomer `ConsultView` → `ConsultClick` hovorí o copy ponuky.

**Zápis leadu ide na Supabase funkciu `quizLead`** (`mode: 'cors'`, kontrola
`response.ok`, timeout 12 s) — **nie** na Apps Script v `no-cors`, ako tvrdí
sekcia 7 plánu. Tá je prekonaná; `apps-script.gs` v repe je pozostatok.

**`ConsultClick` ≠ odoslaná žiadosť, a rovnako `selected_path` ≠ odoslanie.**
`selected_path = 'written_consult'` sa zapíše už pri **ťuknutí** na odpoveď —
z 25 ľudí, čo ťukli, reálne odoslalo 13. Pri analýze lievika to nemiešaj.

**Ručne odoslané maily z Gmailu sa nikde nezaznamenávajú.** `email_logs`
a `email_events` vidia len to, čo ide cez Resend. Ak sa niekomu odpisuje ručne,
zapíš to do `quiz_calls` (`outreach_sent_at`, `outreach_channel`) — inak o tom
neexistuje záznam.

**Zložený `segment` menil význam opakovane** — prostredný diel bol urgencia, od v3 je
to história návratov; v4 pridala `readiness: informacie`, v5 ju zrušila a pridala
`selected_path`. Preto je v payloade `quizVersion` (dnes **5**). Riadky z rôznych
verzií sa **nesmú porovnávať naslepo**, **staré riadky `quizVersion` nemajú vôbec**
a pri ďalšej zmene významu polí ho treba zvýšiť.

**Terminológia.** V tomto projekte „lead" = **dokončený kvíz / analýza** = pixel event
`CompleteRegistration`. Meta „Website leads" = event `Lead` = **žiadosť o kontakt**.
~~Tá sa zatiaľ nezbiera.~~ **Zbiera sa od 30. 7.** — páli sa po potvrdenom zápise pri
oboch cestách (`way=call|message`). Nezamieňať — raz to už stálo peniaze.

**Kampaň optimalizuje na `CompleteRegistration`.** Neprepínať na `Lead`, kým
nebude stabilne 10+ rezervácií týždenne — dôvod je v sekcii 9 plánu.

## Súkromie

Repo je **verejné**. Do commitov nesmú ísť kontakty leadov, ID Google Sheetu,
ID ad účtu ani telefónne čísla. Tie patria do Sheetu a Ads Managera.
