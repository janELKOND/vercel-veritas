---
name: stav
description: Zisti, kde sme skončili na projekte veritas kvíz — načíta plán opráv lievika, pozrie stav na GitHube a overí priamo v kóde, čo je reálne hotové. Použi, keď používateľ napíše „kukni do githubu", „aký je stav", „čo mám robiť", „kde sme skončili", „stav projektu", „pokračujeme" alebo sa po prestávke vracia k práci a chce vedieť, čo ďalej.
---

# Stav projektu veritas kvíz

Cieľ: za jednu odpoveď povedať **čo je hotové, čo je rozrobené a čo je ďalší krok**.
Nehádaj — over to v kóde a na GitHube.

## 1. Načítaj plán

Prečítaj `docs/PLAN-LIEVIKA.md`. Kľúčové sú:

- **sekcia 2** — poradie opráv (odtiaľ berieš „ďalší krok")
- **sekcia 10** — checklist „Hotovo, keď"
- **sekcia 11** — otvorené otázky

Checklistu never naslovo. Odškrtnutie v dokumente nie je dôkaz, že je vec spravená.

## 2. Pozri stav na GitHube

```bash
gh pr list --state open
git log --oneline -10
git status -sb
```

Ak je otvorený PR, povedz čoho sa týka a či čaká na merge.
Ak je lokálna vetva pozadu za `origin/main`, upozorni na to skôr, než sa začne robiť.

## 3. Over v kóde, čo je naozaj hotové

Toto je jadro — checklist v dokumente ukazuje zámer, kód ukazuje realitu.

**Chýbajúce pixel eventy (sekcia 4.1 plánu):**

```bash
grep -n "trackCustom\|quiz_step\|quiz_start\|quiz_email_shown\|PageView" app.js index.html
```

**Oprava `no-cors` zápisu (sekcia 7):**

```bash
grep -n "no-cors\|text/plain\|ok: true" app.js apps-script.gs
```

Ak `no-cors` v `app.js` stále je, oprava spravená nie je — bez ohľadu na checklist.

**Rezervácia konzultácie (sekcie 5–6):**

```bash
grep -n "konzultacia\|cal.com\|trackSingle" app.js index.html
```

**Timestamp a stĺpec `typ` v Sheete (sekcia 4.2, 6):**

```bash
grep -n "appendRow\|new Date()" apps-script.gs
```

## 4. Ohlás to takto

Stručne, v tomto poradí:

1. **Hotové** — čo si potvrdil v kóde, nie čo tvrdí checklist
2. **Rozrobené** — otvorené PR, necommitnuté zmeny
3. **Ďalší krok** — prvá nesplnená položka z poradia v sekcii 2 plánu, aj s odhadom, koľko to zaberie
4. **Blokujúce otázky** — ak niektorá z otvorených otázok v sekcii 11 bráni ďalšiemu kroku, povedz ktorá

Ak sa checklist a kód rozchádzajú, povedz to naplno — je to dôležitejšie než samotný stav.

## Čo nerobiť

- Needškrtávaj položky v checkliste sám od seba. Odškrtne ich až ten, kto vec spraví a otestuje.
- Nepúšťaj sa rovno do implementácie. Toto je prehľad; na prácu čakaj na pokyn.
- Nemeň kampaň ani optimalizáciu — to sa robí v Ads Manageri, nie v tomto repe.
