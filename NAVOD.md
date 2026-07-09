# NÁVOD: Zber leadov + automatické e-maily (15 minút, zadarmo)

Celý systém beží na Google Sheets + Apps Script. Žiadny Mailchimp, žiadne poplatky.
Limit Gmailu je 100 odoslaných e-mailov denne — na začiatok bohato stačí.

---

## KROK 1: Vytvor Google Sheet

1. Choď na sheets.google.com → prázdna tabuľka
2. Premenuj ju napr. na **„Pravda kvíz — leady"**

## KROK 2: Vlož skript

1. V tabuľke hore: **Rozšírenia → Apps Script**
2. Vymaž všetko, čo tam je, a vlož celý obsah súboru **apps-script.gs**
3. Hore klikni na disketu (Uložiť)

## KROK 3: Otestuj e-mail

1. Hore v lište vyber funkciu **testEmail1** a klikni **Spustiť**
2. Google sa spýta na povolenia → **Povoliť** (pri varovaní klikni
   „Rozšírené" → „Prejsť na projekt"; je to tvoj vlastný skript, je to OK)
3. Skontroluj si schránku — mal ti prísť testovací e-mail s vyhodnotením

## KROK 4: Nasaď ako webovú aplikáciu

1. Vpravo hore: **Nasadiť → Nové nasadenie**
2. Ozubené koliesko → typ **Webová aplikácia**
3. Nastav:
   - Spustiť ako: **Ja**
   - Prístup má: **Ktokoľvek**  ← dôležité, inak kvíz nedosiahne na skript
4. Klikni **Nasadiť** a skopíruj **URL webovej aplikácie**
   (končí na `/exec`)

## KROK 5: Vlož URL do kvízu

1. Otvor **app.js**
2. Hore nájdi `WEBHOOK_URL: ''` a vlož URL medzi úvodzovky:
   ```
   WEBHOOK_URL: 'https://script.google.com/macros/s/....../exec',
   ```
3. Ulož a nasaď kvíz: `vercel deploy --prod`

## KROK 6: Zapni follow-up e-maily (deň 2 a deň 5)

1. V Apps Script vľavo klikni na **budík (Spúšťače / Triggers)**
2. **Pridať spúšťač** a nastav:
   - Funkcia: **followUp**
   - Zdroj udalosti: **Časovo riadené**
   - Typ: **Denný časovač**, napr. 9:00 – 10:00
3. Ulož

## KROK 7: Otestuj celý reťazec

1. Otvor nasadený kvíz, vyplň ho s vlastným e-mailom
2. Skontroluj: pribudol riadok v Sheete? Prišiel e-mail s vyhodnotením?
3. Follow-upy prídu automaticky na 2. a 5. deň

---

## Čo systém robí

| Kedy | Čo | Obsah |
|---|---|---|
| Hneď | E-mail 1 | Skóre, typológia, chybné otázky, 3 tipy podľa pásma |
| Deň 2 | E-mail 2 | Tvoj príbeh 133 → 88 kg + mäkké CTA na Valyru (7 dní zadarmo) |
| Deň 5 | E-mail 3 | „Nie je to o vôli" + 2 cesty: Valyra alebo odpoveď KONZULTÁCIA |

Každý lead je v Sheete aj so segmentom (motiváciou) a zoznamom chybných
otázok — keď ti niekto odpíše, otvor si jeho riadok a hneď vieš, s kým hovoríš.

## Keď niekto odpíše STOP

Vymaž jeho riadok zo Sheetu (alebo aspoň e-mail zo stĺpca C) — follow-upy
sa mu prestanú posielať.

## Úprava textov e-mailov

Všetky texty sú v apps-script.gs vo funkciách `sendEmail1_`, `sendEmail2_`,
`sendEmail3_` a tipy v `tipsForBand_`. Po úprave stačí Uložiť — netreba
znova nasadzovať (nasadenie treba obnoviť len ak meníš `doPost`:
Nasadiť → Spravovať nasadenia → ceruzka → Verzia: Nová → Nasadiť).
