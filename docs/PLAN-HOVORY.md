# Plán: z lead magnetu robiť objednávky hovorov

**Vytvorené:** 30. 7. 2026 · **Zosúladené so `STAV.md`:** 19. 8. 2026
**Cieľ:** kvíz nemá vyrábať e-maily, ale **rezervované hovory a nových klientov**.

> ⚠️ **Stav dokumentu: čiastočne vykonaný, čiastočne prekonaný.** Nie je to zoznam
> úloh na dnes. Kde projekt reálne stojí: [`STAV.md`](STAV.md).

**Čo sa z tohto plánu stalo (overené 19. 8.):**

| Krok | Stav |
|---|---|
| K1 retargeting na dokončené kvízy | ⏸️ **blokované** — Ján musí odsúhlasiť podmienky pre vlastné publiká (API vracia `Terms of service has not been accepted`) |
| K2 nasadiť `quizLead` + osloviť leadov | ✅ funkcia beží (v38); osobné oslovenia prebehli vo vlnách 24. 7., 29. 7., 30. 7., 11. 8., 17. 8. a 18. 8. |
| **K3 zapnúť formulár na telefón** | ✅ **HOTOVÉ 30. 7.** — `BOOKING_ENABLED: true`; od 3. 8. sú cesty dve (telefón/správa) |
| K4 prerobiť magnet na osobný plán | ✅ **spravené inak, než plán čakal** — namiesto prerobenia kvízu vznikol druhý magnet [`/analyza`](../analyza/), ktorý beží vedľa. Kvíz nikto nevypol. |
| K5 nová reklama na bolesť | ❌ nespravené |

⚠️ **Hlavný predpoklad plánu sa nepotvrdil.** Plán stojí na tom, že cieľom je
**rezervovaný hovor**. Za celé obdobie kampane je v kalendári **0 rezervácií**, zato
**15 z 18 kontaktov prišlo písomne**. Od 17. 8. e-maily telefonát ani nesľubujú a
testuje sa **písomný dvojkrok** (prvá správa nepredáva, len rozhovorí). „Cena za
rezervovaný hovor" zo sekcie 4 preto dnes **nie je hlavné číslo** — je ním, či človek
na správu odpovie.

> Mechanika výsledku je v [`VYSLEDOK-A-PONUKA.md`](VYSLEDOK-A-PONUKA.md).
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

### ~~K3. Zapnúť uspaný formulár na telefón~~ ✅ HOTOVÉ 30. 7. 2026

> ⚠️ **Tento krok je spravený.** `BOOKING_ENABLED: true`, migrácia `003` spustená,
> otestované ostrým POSTom. Od 3. 8. má formulár **dve cesty** (telefón / správa,
> migrácia `004`) a `Lead` sa páli pri oboch po potvrdenom zápise.
>
> **Ako to dopadlo:** predpoklad „nechaj číslo konvertuje lepšie" sa **potvrdil len
> spolovice** — formulár kontakty naozaj vyrába (v5 je na 7,5 %), ale ľudia si volia
> **písomnú** cestu, nie telefón (15 z 18). Telefonát ako sľub sa medzitým ukázal ako
> brzda: jeho zrušenie 6. 8. je jediná zmena s preukázaným efektom (Fisher, p = 0,0085).

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
- ~~`Lead` = potvrdená rezervácia; **dnes sa nepáli**, lebo formulár je vypnutý~~
  **OPRAVENÉ 19. 8.: `Lead` sa páli od 30. 7.** po potvrdenom zápise, od 3. 8. pri
  oboch cestách (`way=call|message`)
- rezervácie cez cudziu kalendárovú stránku sa **nemerajú** — vidno len klik.
  Za celé obdobie je tam **0 rezervácií**, takže webhook by meral nulu.

~~**Kým nie je K3, počítaj hovory ručne.**~~ Netreba — žiadosť o kontakt sa meria
priamo cez `Lead` a v `quiz_calls`.

⚠️ **Doplnené 19. 8. — čo sa medzitým ukázalo ako skutočné úzke miesto:** nie meranie,
ale **vybavovanie**. Stránka vyrába kontakty rýchlejšie, než sa stíhajú vybavovať,
a odpovedá sa ručne z Gmailu, ktorý sa nikde nezaznamenáva.

### Rozhodovacie prahy

| Situácia | Rozhodnutie |
|---|---|
| K2: z 20 oslovení 0 hovorov | problém je publikum/ponuka → K5, nie ďalší kód |
| K1 beží 2 týždne, 0 rezervácií | ponuka hovoru nefunguje pre toto publikum → prepísať ponuku, nie zdvíhať rozpočet |
| Prvý hovor prišiel | **prestať vylepšovať a začať volať** — z 5 hovorov sa naučíš viac než z 5 PR |
| Kapacita 5/mes. je plná | až vtedy má zmysel zdvíhať rozpočet |

---

## 5. Otvorené otázky

1. ~~**Koľko rezervácií reálne prišlo za 16.–29. 7.?**~~ **ZODPOVEDANÉ:** nula — a
   platí to aj pre celé nasledujúce obdobie. V kalendári nie je ani jedna rezervácia,
   15 z 18 kontaktov je písomných. Už to nie je domnienka.
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
| K1 retargeting | Claude pripraví, **Ján schváli spustenie** | míňa peniaze · ⏸️ blokuje súhlas s podmienkami pre vlastné publiká |
| K2 nasadiť funkciu | **len Ján** | Claude nemá Supabase CLI ani token · ✅ hotové |
| K2 osloviť 20 leadov | **len Ján** | kontakty sú v Supabase · ✅ prebehlo vo vlnách, kľúče v `email_logs` |
| K3 zapnúť formulár | Ján (migrácia + deploy), Claude prepne prepínač | ✅ **hotové 30. 7.** |
| K4 prerobiť magnet | Claude | ✅ vyriešené inak — vznikol druhý magnet `/analyza` |
| K5 nová kreatíva | Claude napíše, Ján nasadí v Ads Manageri | ❌ nespravené |
| ~~Zacielenie 45+ a iba feed~~ | — | ✅ **HOTOVÉ**, nastavené 23. 7., overené 30. 7. na ad sete |
