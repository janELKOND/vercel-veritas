---
name: stav
description: Zisti, kde sme skončili na projekte veritas kvíz — načíta handoff dokument, overí čo je REÁLNE nasadené (stránka + Supabase funkcia) a povie ďalší krok. Použi, keď používateľ napíše „skontroluj si a pokračuj", „kukni do githubu", „aký je stav", „čo mám robiť", „kde sme skončili", „stav projektu", „pokračujeme", alebo sa po prestávke či z druhého počítača vracia k práci.
---

# Stav projektu veritas kvíz

Cieľ: za jednu odpoveď povedať **čo je nasadené, čo čaká a čo je ďalší krok**.

**Zmergované ≠ nasadené.** Toto je na tomto projekte hlavný zdroj omylov: kód býva
v `main`, ale Supabase funkcia beží stará. Preto sa nasadenie **vždy overuje
volaním**, nikdy z gitu.

## 1. Načítaj handoff

Prečítaj **`docs/STAV.md`** — je to vstupný bod: čo je naživo, čo je zmergované
a nenasadené, čo je zámerne uspané a čo treba v akom poradí.

**Najnovšie sekcie sú v `STAV.md` HORE a prepisujú staršie nižšie.** Sekcia 5
(„Čo treba — v poradí") je z ~3. 8. a je čiastočne prekonaná — ďalší krok ber
z datovaných sekcií na začiatku.

Doplňujúce, len keď treba detail:
- `docs/VYSLEDOK-A-PONUKA.md` — **ako** veci fungujú (mechanika, meranie, pravidlá).
  Písané k 30. 7. / v3 — mechanika platí, „dnes" v texte znamená 30. 7.
- `docs/SUPABASE-REZERVACIA.md` — 🗄️ historické, formulár je **dávno zapnutý**
- `docs/PLAN-LIEVIKA.md` — 🗄️ 23. 7., **pred pivotom**; metriky opusteného
  self-serve modelu (lead → registrácia → trial)
- `docs/PLAN-HOVORY.md` — 🗄️ 30. 7., čiastočne vykonaný, čiastočne prekonaný
- `docs/PLAN-7DNI.md` — 💤 návrh, zámerne nezačatý

⚠️ **Z plánov nikdy nevyvodzuj dnešnú prioritu ani nezaškrtnuté políčko neber ako
nesplnenú úlohu.** Presne to už dvakrát vyrobilo falošný nález. Overuj proti
`STAV.md` a proti kódu.

## 2. Over, čo je reálne nasadené

Toto je jadro skillu. Spusti a porovnaj s očakávaním v `STAV.md`:

```bash
curl -s https://kviz.valyra.sk/sw.js | head -1
curl -s https://kviz.valyra.sk/app.js | grep -n "BOOKING_ENABLED\|SPOTS_PER_MONTH:"
```

Verzia Supabase funkcie — bezpečná sonda, nič nezapíše ani neodošle (chýba meno
aj e-mail, takže obe verzie končia na `400`):

```bash
curl -s -X POST "https://ztuudcgmzbkkbldnkqay.supabase.co/functions/v1/quizLead" \
  -H "Content-Type: application/json" -d '{"typ":"konzultacia","phone":"123"}'
```

- `Chýba meno alebo platný e-mail` → **stará** verzia, nenasadené
- `Chýba platné telefónne číslo` → **nová** verzia, nasadené

**Nikdy neposielaj sondu s platným menom a e-mailom** — vyrobil by si falošný lead
a spustil e-mail cudzej adrese.

## 3. Pozri rozrobené veci v OBOCH repách

```bash
gh pr list --state open
git log --oneline -5
git status -sb
gh pr list --state open --repo janELKOND/valyra
```

Projekt je v dvoch repách: `vercel-veritas` (kvíz) a `valyra` vetva
`supabase-migration` (funkcia `quizLead`). Ján pracuje na dvoch počítačoch — ak je
lokálna vetva pozadu, povedz to skôr, než sa začne robiť.

## 4. Ohlás to takto

1. **Nasadené a funguje** — čo si potvrdil volaním, nie čo tvrdí git
2. **Čaká na nasadenie** — čo je zmergované, ale naživo nebeží, a kto to musí spustiť
3. **Ďalší krok** — z **najnovšej datovanej sekcie** v `STAV.md` (hore), nie zo
   sekcie 5; tá je z ~3. 8. a čiastočne prekonaná
4. **Rozpor** — ak sa `STAV.md` a realita rozchádzajú, povedz to naplno a **oprav
   `STAV.md`**; zastaralý handoff je horší než žiadny

Ak je ďalší krok mimo kódu (Ads Manager, telefonáty leadom, referencia), povedz to
priamo — nehľadaj v kóde prácu, ktorá tam nie je.

## Čo nerobiť

- **Nehádaj nasadenie z gitu.** Vždy sonda.
- **Nepúšťaj sa rovno do implementácie.** Toto je prehľad; na prácu čakaj na pokyn.
- **Nemeň kampaň ani optimalizáciu** — to sa robí v Ads Manageri, nie v repe.
- **Neprepínaj `BOOKING_ENABLED` na `false`.** Je `true` od 30. 7. a formulár je
  dnes jediná cesta, ako človek nechá kontakt. *(Pôvodné pravidlo znelo opačne —
  „nezapínaj, kým sonda nepotvrdí novú verziu funkcie". To bolo správne do 30. 7.;
  funkcia je odvtedy nasadená a otestovaná.)*
- **Neodškrtávaj** položky sám od seba. Odškrtne ich ten, kto vec spraví a otestuje.
- **Nehlás nález z nezaškrtnutého políčka v pláne.** Plány sú datované a prekonané;
  najprv over v `STAV.md` a v kóde, až potom to nazvi dierou.
