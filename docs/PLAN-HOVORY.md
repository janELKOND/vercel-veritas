# Plán: z lead magnetu robiť objednávky hovorov

**Vytvorené:** 30. 7. 2026
**Cieľ:** kvíz nemá vyrábať e-maily, ale **rezervované hovory a nových klientov**.

> Stav projektu je v [`STAV.md`](STAV.md), mechanika v
> [`VYSLEDOK-A-PONUKA.md`](VYSLEDOK-A-PONUKA.md). Tento dokument je **plán ďalšej
> etapy** — čo urobiť, v akom poradí a ako poznať, že to funguje.
>
> Repo je verejné: žiadne kontakty leadov, ID Sheetu ani ad účtu.

---

## 0. Čísla, z ktorých plán vychádza

Stiahnuté z ad účtu **30. 7. 2026** za obdobie **16.–29. 7.** (14 dní), kampaň
„New Leads Campaign Kviz – pravda o chudnuti", objective `OUTCOME_LEADS`:

| Metrika | Hodnota |
|---|---|
| Míňané | 49,10 € |
| Impresie | 16 470 |
| Kliky | 1 930 · CTR 11,72 % · CPC 0,03 € |
| **Načítania stránky** | **1 024** |
| **Dokončené kvízy** (`CompleteRegistration`) | **151** · 0,33 €/lead |
| Rezervované hovory | **0** (neoverené priamym meraním, viď sekcia 5) |

Odvodené:

- klik → načítanie stránky: **53 %** — takmer polovica zaplatených klikov nikdy
  neuvidí kvíz (~23 € zo 49 €). *Pozn.: `landing page view` sa meria pixelom, blokovače
  ho podhodnocujú, takže reálna strata je menšia — ale nie 47 %.*
- načítanie → dokončený kvíz: **14,7 %**
- klik → dokončený kvíz: **7,8 %**
- tempo: **~325 leadov/mesiac za ~105 €**

**Kapacita koučingu je 5 klientov/mesiac.** Vyrábaš teda ~65× viac leadov, než
dokážeš obslúžiť.

---

## 1. Diagnóza — prečo to negeneruje hovory

### 1.1 Kvíz uzatvára, hovor nemá dôvod existovať

Človek dostane skóre, vysvetlenia, diagnózu a tipy na e-mail. **Odchádza s pocitom, že
to má vyriešené.** Nič mu nechýba, takže nemá prečo volať.

Hovory generuje lead magnet, ktorý je **prvým krokom platenej práce**, nie zábavou pred
ňou. Musí niečo dať a zároveň nechať otvorené, že sám to nedokončí.

### 1.2 Kupujeme zvedavcov, nie ľudí v probléme

„Si v obraze, alebo veríš mýtom?" je otázka na ego — odpovie na ňu každý, kto sa nudí.
CTR 11,72 % nie je záujem o chudnutie, je to **záujem o kvíz**.

### 1.3 Lacný lead je symptóm, nie výhra

151 leadov za 49 € a nula hovorov. Lacný lead, ktorý nekonvertuje, je drahší než drahý
lead, ktorý konvertuje.

**Počítaj s tým, že lead na hovor bude stáť 1–3 €, nie 33 centov — a bude to lepší
obchod.** Jediné číslo, ktoré má odteraz zmysel sledovať, je **cena za rezervovaný
hovor**.

---

## 2. Plán — päť krokov v poradí dopadu

### K1. Retargeting na ľudí, ktorí už kvíz dokončili ⭐ NAJVYŠŠIA PRIORITA

**Čo:** vlastné publikum z pixel eventu `CompleteRegistration` (posledných 30–90 dní)
+ samostatná kampaň s jediným cieľom — **rezervácia hovoru**.

**Prečo:** máš 151 ľudí, ktorí prešli 11 otázok o chudnutí a nechali e-mail. To je
najteplejšie publikum, aké kedy budeš mať, **a je už zaplatené**. Čakať, že si sami
rezervujú na výsledkovej stránke, je najdrahší možný spôsob.

**Návrh copy:**

```
Dokončila si kvíz Pravda o chudnutí.

Ak sa ti to už niekedy vrátilo, nie je to o vôli — je to o systéme.
15 minút, prejdeme si tvoj výsledok a povieme si, čím začať.

[Chcem svoj Reštart plán]
```

**Kto:** Claude vie publikum aj kampaň pripraviť cez Ads MCP. **Míňa to peniaze, takže
sa nespustí bez výslovného pokynu** — Ján určí denný rozpočet a či spustiť, alebo nechať
pauznuté na schválenie.

**Sledované číslo:** cena za rezervovaný hovor. Prvý cieľ je **jeden** rezervovaný hovor
— nie optimalizácia.

---

### K2. Nasadiť mail o leade a osobne osloviť existujúcich 151

**Čo:** nasadiť Supabase funkciu (viď `STAV.md`), potom ručne osloviť ~20 leadov, ktorí
majú v maili „🔥 CHCE KONZULTÁCIU".

```bash
supabase functions deploy quizLead --project-ref ztuudcgmzbkkbldnkqay
```

**Prečo:** je to **zadarmo** a je to jediná cesta, ktorá dnes vie odpovedať na otázku,
ktorú žiadna zmena v kóde neodpovie: *konvertujú tieto leady na platiacich klientov?*

**Rozhodovacie pravidlo:** ak z 20 osobných oslovení nevznikne **ani jeden hovor**,
problém nie je v kvíze a ďalší kód nepomôže — chyba je v publiku alebo v ponuke a treba
sa vrátiť ku K5.

**Kto:** Ján (Claude nemá Supabase CLI ani token).

---

### K3. Zapnúť uspaný formulár na telefón

**Čo:** `BOOKING_ENABLED: true` + migrácia `003_quiz_calls.sql`. Postup:
[`SUPABASE-REZERVACIA.md`](SUPABASE-REZERVACIA.md).

**Prečo:** „Nechaj číslo, ozvem sa ti" konvertuje výrazne lepšie než „vyber si termín
v kalendári". Cal.com je cudzia stránka, výber dátumu, výber času a opäť meno aj
e-mail — **pri predaji hovoru je každý ten krok zabitá rezervácia**.

Bonus: `Lead` sa začne páliť po potvrdenom zápise, takže **cena za hovor sa konečne
začne merať** bez Cal.com webhooku.

**Pozn.:** 30. 7. sa rozhodlo nechať to vypnuté, keď bola priorita prevádzková
(vedieť o záujme). Ak je cieľ **objednávky hovorov**, toto rozhodnutie sa mení — je to
presne ten prvok, ktorý ich má vyrábať.

---

### K4. Prerobiť magnet z testu na osobný plán

**Čo:** posunúť sľub z „koľko vieš o mýtoch" na **„prečo to u teba nefunguje a čím
začať"**. Kvíz už zbiera brzdu, históriu návratov a pripravenosť — z toho sa dá zložiť
skutočný osobný mini-plán prvého týždňa.

**Prečo:** hovor prestane byť nová vec a stane sa pokračovaním: *„prejdeme si tvoj plán
spolu a doladíme ho na tvoj život."* Magnet sa tým stane prvým krokom práce, nie
zábavou pred ňou (viď 1.1).

**Pozor:** mení hlavný sľub, takže sa musí zmeniť aj intro, e-mail `bridge_0` a možno
reklama. Nespájať s K5 v jednom kroku, inak sa nedá vyhodnotiť, čo zabralo.

**Kto:** Claude, väčšia zmena (rádovo hodiny).

---

### K5. Nová reklama na bolesť, nie na zvedavosť

**Čo:** druhá kreatíva vedľa existujúcej (tú **nevypínať**, aby bolo s čím porovnať).

```
Schudla si a vrátilo sa to? Nie si slabá.
Toto je dôvod — a čo s tým.
```

**Prečo:** priťahuje ľudí s problémom, nie hráčov kvízu.

**Čo očakávať:** CTR spadne, cena za lead vyletí — **a rezervácií bude viac**. Ak to
hodnotíš podľa ceny za lead, vyzerá to ako zhoršenie. Preto sekcia 5.

---

## 3. Čo NEROBIŤ

- **Nezvyšovať rozpočet.** Vyrábaš 65× viac leadov než kapacitu. Kým nie je overená
  konverzia na klienta, každé euro navyše je vyhodené.
- **Neprepínať kampaň na optimalizáciu `Lead`**, kým nebude stabilne 10+ rezervácií
  týždenne. 13. 7. to stálo 28,53 € za dve rezervácie.
- **Nehodnotiť nové kreatívy podľa ceny za lead.** Zabilo by to presne tie, ktoré
  prinesú hovory.
- **Nemeniť K4 a K5 naraz.** Nedalo by sa zistiť, čo zabralo.
- **Neoptimalizovať kvíz ďalej, kým nie je prvý hovor.** Kód nie je dnes obmedzenie.

---

## 4. Ako merať úspech

**Jediné hlavné číslo: cena za rezervovaný hovor.**

Reťaz eventov na pixeli ad účtu (`2221207801987418`):

```
QuizStart → QuizStep 1..11 → QuizComplete → CompleteRegistration
                                          → ConsultView → ConsultClick → Lead
```

- `ConsultView` → `ConsultClick` = či ponuka presviedča
- `Lead` = **potvrdená rezervácia**; páli sa len po zápise, a **dnes sa nepáli**, lebo
  formulár je vypnutý (K3 to zapne)
- rezervácie cez Cal.com sa dnes **nemerajú vôbec** — vidno len klik

**Kým nie je K3, počítaj hovory ručne** (Cal.com kalendár + prijaté maily). Inak sa
o „nula hovorov" nedá tvrdiť nič isté.

### Rozhodovacie prahy

| Situácia | Rozhodnutie |
|---|---|
| K2: z 20 oslovení 0 hovorov | problém je publikum/ponuka → K5, nie ďalší kód |
| K1 beží 2 týždne, 0 rezervácií | ponuka hovoru nefunguje pre toto publikum → prepísať ponuku, nie zdvíhať rozpočet |
| Prvý hovor prišiel | **prestať vylepšovať a začať volať** — z 5 hovorov sa naučíš viac než z 5 PR |
| Kapacita 5/mes. je plná | až vtedy má zmysel zdvíhať rozpočet |

---

## 5. Otvorené otázky

1. **Koľko rezervácií reálne prišlo za 16.–29. 7.?** Ján to vie z Cal.com; z pixelu sa
   to zistiť nedá. Bez toho je „0 hovorov" domnienka, nie fakt.
2. **Prečo 47 % klikov nedorazí na stránku?** Skontrolovať rýchlosť načítania na
   mobile. Je to najväčší jednotlivý únik a s copy nemá nič.
3. **Tlačí e-mailová séria stále Valyra appku?** `bridgeTemplates.ts` v repe `valyra` —
   séria bola písaná pre starý lievik. Ak áno, e-maily hovoria niečo iné než stránka.
4. **Referencia klienta.** Dôkaz dnes stojí len na Jánovom príbehu (45 kg, 8 rokov).
   Prvá klientska referencia nad tlačidlom je pravdepodobne najväčší jednotlivý skok
   v konverzii, aký na stránke zostáva.
5. **Cena koučingu** — Ján ju zámerne neuviedol. Bez nej sa nedá spočítať, koľko smie
   stáť rezervovaný hovor, ani kedy sa oplatí škálovať. Rozhodovanie v sekcii 4 je
   preto postavené na milníkoch, nie na eurách.

---

## 6. Rozdelenie práce

| Krok | Kto | Poznámka |
|---|---|---|
| K1 retargeting | Claude pripraví, **Ján schváli spustenie** | míňa peniaze |
| K2 nasadiť funkciu | **len Ján** | Claude nemá Supabase CLI ani token |
| K2 osloviť 20 leadov | **len Ján** | kontakty sú v Sheete/Supabase |
| K3 zapnúť formulár | Ján (migrácia + deploy), Claude prepne prepínač | |
| K4 prerobiť magnet | Claude | väčšia zmena |
| K5 nová kreatíva | Claude napíše, Ján nasadí v Ads Manageri | |
| Zacielenie 45+ a iba feed | **len Ján** | 5 minút v Ads Manageri, viď `STAV.md` |
