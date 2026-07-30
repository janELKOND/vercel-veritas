# Plán: nový lead magnet „7 dní bez diéty"

**Vytvorené:** 30. 7. 2026
**Stav:** návrh, nezačaté
**Cieľ:** lead magnet, ktorý vyrába **rezervované hovory**, nie e-maily.

> Súvisiace: [`PLAN-HOVORY.md`](PLAN-HOVORY.md) — prečo súčasný kvíz hovory nerobí
> a aktuálne čísla z ad účtu. [`STAV.md`](STAV.md) — kde projekt stojí.
>
> Repo je verejné: žiadne kontakty leadov, ID Sheetu ani ad účtu.

---

## 1. Podstata zmeny

**Kvíz je test. Test sa dá vyhrať a zabudnúť. Výzva sa dá dokončiť — a kto ju dokončí,
ten už s tebou pracoval.**

Po kvíze človek vie viac. Po siedmich dňoch **má za sebou sedem dní, ktoré dodržal** —
prvý dôkaz, aký kedy dostal, že to ide aj bez trápenia. V tom momente je hovor
pokračovanie, nie predaj.

Tým sa rieši hlavná chyba súčasného magnetu (viď `PLAN-HOVORY.md`, sekcia 1.1): kvíz
**uzatvára** a hovor nemá dôvod existovať.

---

## 2. Vstupná stránka — jedna obrazovka

Žiadnych 11 otázok. Jeden sľub, jeden dôkaz, jedno tlačidlo.

```
## 7 dní bez diéty
**Každý deň jedna vec. Desať minút. Žiadne zakázané jedlo.**

Sedem dní ti budem každé ráno písať jednu vec, ktorú v ten deň urobíš.
Nie plán na tri mesiace. Nie zoznam, čo nesmieš. Jedna vec denne.

Na konci budeš vedieť dve veci: prečo ti to doteraz vždy spadlo — a že sa to
dá bez toho, aby si si vyhodila polovicu jedálnička.

Ján — schudol som 45 kg a držím si to 8 rokov.
Toto je prvý týždeň z toho, čo som robil.

[Chcem začať v pondelok]
```

### Vstupné otázky — dve, nie jedenásť

Po kliku na tlačidlo, pred e-mailom:

1. **Koľkokrát sa ti už zhodené kilá vrátili?**
   `prvykrat` · `raz-dva` · `viackrat` · `jojo`
2. **Čo ťa brzdí najviac?**
   `co-jest` · `vecerne-chute` · `nevydrzim` · `nemam-cas` · `potrebujem-podporu`

Sú to tie isté hodnoty, aké zbiera dnešný kvíz, takže **`qualifyLead()` v `quizLead`
funguje bez zmeny** a mail „🔥 CHCE KONZULTÁCIU" tiež.

Potom meno + e-mail + súhlas (rovnaké znenie ako v kvíze, kryje aj obchodné oslovenie).

**E-mailovú stenu oznámiť dopredu** — „sedem dní ti budem písať" ju oznamuje samo sebou,
na rozdiel od kvízu ju netreba vysvetľovať.

---

## 3. Sedem dní — obsah a účel

Každý e-mail: **jedna vec na dnes** + **jeden mýtus, ktorý tým padá** + jedna veta prečo.
Nič viac. Krátke, čitateľné na mobile za 40 sekúnd.

| Deň | Jedna vec | Čo tým padá |
|---|---|---|
| 1 | Bielkovina k prvému jedlu dňa | „musíš hladovať" |
| 2 | 20 minút chôdze — nie tréning, chôdza | „bez posilňovne to nejde" |
| 3 | Jedna zmena **cez deň**, ktorá vypne večerné chute | „mám slabú vôľu" |
| **4** | **„Máš za sebou 3 dni. Tu väčšina prestáva."** | ⬅ **PONUKA HOVORU** |
| 5 | Spánok — najlacnejšia vec, ktorú nikto nerobí | „je to len o jedle" |
| 6 | **Čo robiť po zaváhaní** | „pokazila som to, začnem v pondelok" |
| 7 | Prečo sa ti to vlastne vracalo + čo ďalej | ⬅ ponuka hovoru druhýkrát |

### Prečo deň 6 je najdôležitejší

**Všetci učia, ako začať. Nikto neučí, ako nespadnúť.** Ján má 8 rokov dôkaz, že to vie —
a presne toto je dôvod, prečo sa ľuďom kilá vracajú. Je to jeho jediná skutočná
konkurenčná výhoda a v súčasnom kvíze sa nevyužíva vôbec.

### Prečo je ponuka na deň 4

Nie je to náhoda. Človek má za sebou tri dni, cíti, že to ide — a zároveň vie, že
zvyčajne práve teraz prestáva. **To je najlepší moment na hovor v celom lieviku.**

### Personalizácia

Prvý e-mail (deň 1) má odkázať na to, čo človek sám povedal:
*„Píšeš, že ti to vždy spadne po pár dňoch. Deň 6 je celý o tom."*
Podľa dát z pôvodného lievika konvertuje takto personalizovaný e-mail výrazne lepšie
než všeobecný text.

---

## 4. Ponuka hovoru (deň 4 a deň 7, plus stránka po dokončení)

```
Reštart plán — 15 minút, po telefóne

Tri dni ti to ide. Poď, aby to nebol znova len týždeň.

✓ Povieme si, prečo presne sa ti to minule vrátilo — nie všeobecne, u teba
✓ Odídeš s jednou konkrétnou vecou na ďalší týždeň. Tú si necháš, aj keby
  sme spolu viac nehovorili.
✓ Ak budeš chcieť, aby som ťa viedol ďalej, poviem ti ako. Ak nie,
  rozlúčime sa v pohode.

Beriem maximálne 5 nových ľudí mesačne, lebo pri každom som osobne.

[Nechaj mi číslo, ozvem sa ti]
```

**Ponuka koučingu sa hovorí až NA hovore**, nikdy v e-maili:

> Neplatíš za počet stretnutí. Platíš za to, že to konečne zaberie —
> **ostávam s tebou, kým sa to nepohne.**

### Pravidlá pre ponuku

- **„Nechaj číslo, ozvem sa ti"** má prednosť pred Cal.com odkazom — každý krok
  (cudzia stránka, výber dátumu, výber času, znova meno a mail) je zabitá rezervácia
- kapacita **musí zostať pravdivá** (viď `STAV.md`, sekcia 6)
- nesľubovať nič, čo 15-minútový hovor nesplní
- kto v druhej otázke nepriznal opakované návraty a e-maily neotvára, **nedostane tlak**
  — rovnaký princíp ako `noPressure` v kvíze

---

## 5. Ako to spustiť bez rizika a bez eura

**Toto je najdôležitejšia sekcia celého plánu.**

### Fáza 1: na teplé publikum, náklad nula

Nekupovať reklamu. Pustiť to na **151 ľudí, ktorí už kvíz dokončili** (16.–29. 7.):

> „Pred pár dňami si prešla kvízom. Chcem ti dať niečo praktickejšie —
> 7 dní, každý deň jedna vec. Začíname v pondelok."

Do desiatich dní bude jasná odpoveď na otázku, ktorá sa dnes nedá zodpovedať:
**konvertuje moje publikum na hovory?**

### Rozhodovacie prahy

| Výsledok fázy 1 | Rozhodnutie |
|---|---|
| 5+ hovorov z 151 ľudí | funguje → presmerovať reklamu na výzvu (fáza 2) |
| 1–4 hovory | funguje slabo → prepísať ponuku na deň 4, skúsiť znova |
| 0 hovorov | **chyba nie je v magnete** → problém je publikum alebo ponuka koučingu; ďalší lead magnet nepomôže |

### Fáza 2: až potom cold traffic

Nová kreatíva, nová vstupná stránka. **Kvíz nevypínať** — nechať bežať vedľa, aby bolo
s čím porovnávať.

**Počítať s tým, že CTR spadne** a lead bude drahší než 0,33 €. To nie je zhoršenie —
je to prechod z nakupovania zvedavcov na nakupovanie ľudí, ktorí chcú začať. Hodnotiť
podľa **ceny za rezervovaný hovor**, nikdy podľa ceny za lead.

---

## 6. Čo z infraštruktúry už existuje

| Časť | Stav |
|---|---|
| Resend + `sendEmail` | ✅ hotové |
| Cron na sériu (`quizBridge`, deň 1/3/5/7) | ⚠️ existuje, treba prerobiť na 7 dní za sebou |
| `quiz_leads` + `email_logs` (ochrana proti duplicite) | ✅ hotové |
| `qualifyLead()` + mail „CHCE KONZULTÁCIU" | ⚠️ zmergované, **nenasadené** (viď `STAV.md`) |
| Formulár „nechaj číslo" | ⚠️ napísaný a otestovaný, **vypnutý** (`BOOKING_ENABLED`) |
| Meranie (pixel, `trackAd`) | ✅ hotové, len nové názvy eventov |
| Vstupná stránka | 🔴 nová, ale jednoduchšia než kvíz |
| **7 e-mailov** | 🔴 **neexistujú — toto je celý produkt** |

---

## 7. Meranie

Analogicky ku kvízu, všetko adresne na pixel ad účtu cez `trackAd()`:

| Event | Kedy |
|---|---|
| `ChallengeView` | zobrazenie vstupnej stránky |
| `CompleteRegistration` | prihlásenie do výzvy (= lead) |
| `ChallengeDay` (`day: N`) | otvorenie/klik v e-maili dňa N |
| `ConsultView` / `ConsultClick` | zobrazenie a klik na ponuku hovoru |
| `Lead` | **potvrdená** rezervácia (až po zápise) |

**Hlavné číslo: cena za rezervovaný hovor.** Druhé v poradí: **koľkí dokončia deň 4** —
to je predikátor, či vôbec príde hovor.

---

## 8. Čo NErobiť

- **Nevypínať kvíz**, kým výzva nemá prvé hovory
- **Nekupovať reklamu na výzvu pred fázou 1** — teplé publikum je zadarmo a odpovie
  rýchlejšie
- **Nehodnotiť výzvu podľa ceny za lead** — zabilo by to presne to, čo má priniesť
- **Nedávať ponuku koučingu do e-mailov.** Do e-mailu patrí ponuka **hovoru**, nič viac
- **Nepísať e-maily „na tri mesiace dopredu".** Jedna vec denne, inak to nikto neurobí
- **Neposielať sériu ľuďom, ktorí už majú hovor** — po rezervácii ju zastaviť

---

## 9. Buďme úprimní v jednej veci

**Sedem e-mailov, ktoré niečo naučia, musí napísať Ján.** Claude napíše prvú verziu, ale
musí to znieť ako on — inak je to len ďalší newsletter. **Bez tých siedmich e-mailov je
celý tento plán nepoužiteľný**, pretože e-maily NIE SÚ obal magnetu, e-maily SÚ magnet.

Stránka je len obal a dá sa spraviť za hodinu.

---

## 10. Rozdelenie práce

| Krok | Kto |
|---|---|
| Obsah 7 e-mailov — prvá verzia | Claude |
| Obsah 7 e-mailov — finálne znenie, aby to znelo ako Ján | **len Ján** |
| Vstupná stránka + 2 otázky + formulár | Claude |
| Prerobiť cron na 7 dní za sebou | Claude |
| Nasadiť Supabase funkciu a cron | **len Ján** (Claude nemá CLI ani token) |
| Poslať výzvu 151 leadom (fáza 1) | Claude pripraví, Ján odošle |
| Nová kreatíva pre fázu 2 | Claude napíše, Ján nasadí v Ads Manageri |
| Volať ľuďom, ktorí nechajú číslo | **len Ján** |

---

## 11. Otvorené otázky

1. **Začínať výzvu v pondelok, alebo hneď po prihlásení?** Pondelok dáva „štart" a lepšie
   sa naň teší; hneď má nižšie trenie a nikto nevychladne. Odporúčanie: **hneď na druhý
   deň**, s možnosťou „začnem v pondelok".
2. **Čo s tými, čo prestanú na dni 2?** Jeden záchytný e-mail („nič sa nestalo, pokračuj
   dnes") alebo ich nechať? Bez dát netipovať.
3. **Ponuka hovoru aj na dni 7 pre tých, čo ju na dni 4 ignorovali?** Áno, ale iným
   textom — inak to pôsobí ako otravovanie.
4. **Cena koučingu** — Ján ju zámerne neuviedol, takže sa nedá spočítať, koľko smie stáť
   rezervovaný hovor. Rozhodovanie v sekcii 5 je preto na milníkoch, nie na eurách.
