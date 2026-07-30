# vercel-veritas — kvíz „Pravda o chudnutí"

Lead-gen PWA nasadená na Verceli. Kvíz posbiera odpovede, zaradí človeka do
segmentu a vypýta e-mail. Slúži ako vstup do lievika smerom na aplikáciu.

## Súbory

| Súbor | Čo je to |
|---|---|
| `index.html` | celá stránka, vrátane pixel snippetov |
| `app.js` | logika kvízu, segmentácia, odoslanie leadu |
| `apps-script.gs` | Google Apps Script, zapisuje leady do Sheetu |
| `sw.js` | service worker — **pri zmene kvízu bumpni verziu cache**, inak ľudia uvidia starú verziu |
| `NAVOD.md` | pôvodný návod k projektu |

## Čítaj pred zmenami

**[`docs/VYSLEDOK-A-PONUKA.md`](docs/VYSLEDOK-A-PONUKA.md)** — ako lievik funguje
**dnes**: tri kvalifikačné otázky a čo každá riadi, diagnóza (`gapDiagnosis`),
tiering HOT/WARM/COLD, `noPressure`, ponuka hovoru, meranie, payload a
`quizVersion`. Obsahuje aj chronológiu zmien a pravidlá pre ďalšie úpravy.

**[`docs/PLAN-LIEVIKA.md`](docs/PLAN-LIEVIKA.md)** — vyhodnotenie lievika od
impresie po platiaceho zákazníka s číslami z reklamy (23. 7. 2026). Čísla a
poradie priorít platia, ale **časť zámerov je už prekonaná** — čo presne, je
v sekcii 9 dokumentu vyššie. Nečítaj ho ako popis súčasného stavu.

## Kde sme skončili

Napíš **„kukni do githubu"** (alebo `/stav`) a spustí sa skill
[`.claude/skills/stav`](.claude/skills/stav/SKILL.md): načíta plán, pozrie
otvorené PR a **overí priamo v kóde**, čo je reálne hotové — checklist v pláne
ukazuje zámer, kód ukazuje realitu.

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

**`ConsultClick` nie je rezervácia**, je to len klik na Cal.com. Skutočný počet
hovorov z reklamy sa dá merať až eventom `Lead` z Cal.com webhooku — do vtedy je
konverzia hovoru odhad. Pomer `ConsultView` → `ConsultClick` hovorí o copy ponuky.

**Zápis leadu ide na Supabase funkciu `quizLead`** (`mode: 'cors'`, kontrola
`response.ok`, timeout 12 s) — **nie** na Apps Script v `no-cors`, ako tvrdí
sekcia 7 plánu. Tá je prekonaná; `apps-script.gs` v repe je pozostatok.

**Zložený `segment` už dvakrát zmenil význam** — prostredný diel bol urgencia,
od v3 je to história návratov. Preto je v payloade `quizVersion`. Riadky z
rôznych verzií sa **nesmú porovnávať naslepo** a pri ďalšej zmene významu
polí treba `quizVersion` zvýšiť.

**Terminológia.** V tomto projekte „lead" = **dokončený kvíz** = pixel event
`CompleteRegistration`. Meta „Website leads" = event `Lead` = rezervácia hovoru,
tá sa zatiaľ nezbiera. Nezamieňať — raz to už stálo peniaze.

**Kampaň optimalizuje na `CompleteRegistration`.** Neprepínať na `Lead`, kým
nebude stabilne 10+ rezervácií týždenne — dôvod je v sekcii 9 plánu.

## Súkromie

Repo je **verejné**. Do commitov nesmú ísť kontakty leadov, ID Google Sheetu,
ID ad účtu ani telefónne čísla. Tie patria do Sheetu a Ads Managera.
