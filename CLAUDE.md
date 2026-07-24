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

**[`docs/PLAN-LIEVIKA.md`](docs/PLAN-LIEVIKA.md)** — vyhodnotenie celého lievika
od impresie po platiaceho zákazníka, kde tečie a v akom poradí to opravovať.
Obsahuje aj konkrétne zadania: chýbajúce pixel eventy, oprava `no-cors` zápisu,
pridanie rezervácie konzultácie.

## Kde sme skončili

Napíš **„kukni do githubu"** (alebo `/stav`) a spustí sa skill
[`.claude/skills/stav`](.claude/skills/stav/SKILL.md): načíta plán, pozrie
otvorené PR a **overí priamo v kóde**, čo je reálne hotové — checklist v pláne
ukazuje zámer, kód ukazuje realitu.

## Na čo si dať pozor

**Dva pixely.** Stránka inicializuje `2221207801987418` (patrí ad účtu) aj
`1529505581872759` (veritas). **Ad účet k druhému NEMÁ prístup** — konverzie
poslané naň sú pre reklamu neviditeľné. Konverzné eventy páľ explicitne cez
`fbq('trackSingle', '2221207801987418', ...)`.

**Zápis do Sheetu je `no-cors`**, teda naslepo bez potvrdenia. Nefunguje na ňom
žiadna kontrola chýb. Oprava je popísaná v sekcii 7 plánu — podstata je poslať
POST ako `text/plain`, čím sa vyhne preflightu `OPTIONS`, ktorý Apps Script
neobslúži.

**Terminológia.** V tomto projekte „lead" = **dokončený kvíz** = pixel event
`CompleteRegistration`. Meta „Website leads" = event `Lead` = rezervácia hovoru,
tá sa zatiaľ nezbiera. Nezamieňať — raz to už stálo peniaze.

**Kampaň optimalizuje na `CompleteRegistration`.** Neprepínať na `Lead`, kým
nebude stabilne 10+ rezervácií týždenne — dôvod je v sekcii 9 plánu.

## Súkromie

Repo je **verejné**. Do commitov nesmú ísť kontakty leadov, ID Google Sheetu,
ID ad účtu ani telefónne čísla. Tie patria do Sheetu a Ads Managera.
