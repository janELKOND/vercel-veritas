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

Doplňujúce, len keď treba detail:
- `docs/VYSLEDOK-A-PONUKA.md` — **ako** veci fungujú (mechanika, meranie, pravidlá)
- `docs/SUPABASE-REZERVACIA.md` — ako zapnúť uspaný formulár na telefón
- `docs/PLAN-LIEVIKA.md` — čísla z reklamy z 23. 7., **čiastočne prekonaný**;
  nečítaj ho ako popis súčasného stavu

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
3. **Ďalší krok** — prvá nesplnená položka z poradia v `STAV.md` sekcii 5
4. **Rozpor** — ak sa `STAV.md` a realita rozchádzajú, povedz to naplno a **oprav
   `STAV.md`**; zastaralý handoff je horší než žiadny

Ak je ďalší krok mimo kódu (Ads Manager, telefonáty leadom, referencia), povedz to
priamo — nehľadaj v kóde prácu, ktorá tam nie je.

## Čo nerobiť

- **Nehádaj nasadenie z gitu.** Vždy sonda.
- **Nepúšťaj sa rovno do implementácie.** Toto je prehľad; na prácu čakaj na pokyn.
- **Nemeň kampaň ani optimalizáciu** — to sa robí v Ads Manageri, nie v repe.
- **Neprepínaj `BOOKING_ENABLED` na `true`**, kým sonda nepotvrdí novú verziu
  funkcie — inak ľudia z reklamy nechajú číslo a dostanú chybu.
- **Neodškrtávaj** položky sám od seba. Odškrtne ich ten, kto vec spraví a otestuje.
