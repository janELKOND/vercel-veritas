// TELEFÓN — spoločná kontrola tvaru pre KVÍZ aj OSOBNÚ ANALÝZU.
//
// Prečo samostatný súbor: obe stránky píšu do toho istého stĺpca
// `quiz_calls.phone`. Kým bola kontrola len v analýze (27. 8. 2026), kvíz bral
// „aspoň 9 číslic" a v tabuľke sa miešali dva rôzne tvary čísla. Dve kópie tej
// istej funkcie by sa skôr či neskôr rozišli — preto je zdroj jeden.
//
// Načítava sa OBYČAJNÝM `<script>` pred `app.js` na oboch stránkach, takže
// `normalizePhone` je tu skôr, než ju niekto zavolá. Nie je to modul zámerne:
// zvyšok repa žiadny build nemá a kvôli jednej funkcii ho nezavádzame.
//
// Do dnes stačilo „aspoň 9 číslic", takže prešlo aj 123456789, aj rozpísaný
// dátum. Číslo, na ktoré sa nedá zavolať, je horšie než žiadne: sľúbi sa hovor,
// ktorý sa nemá ako uskutočniť, a človek márne čaká.
//
// Vracia číslo v medzinárodnom tvare, alebo null. Rozsahy sú úmyselne úzke —
// SK mobil 9xx, CZ mobil 6xx/7xx. Pevné linky sem nepatria: 15-minútový hovor
// sa dohaduje na mobil.
//
// ⚠️ Toto je POHODLIE, nie bezpečnosť. Posledné slovo má quizLead na serveri
// a tam kontrola ZÁMERNE ostáva voľnejšia (>= 9 číslic), aby sa nestratil lead
// s legitímnym zahraničným číslom. Sprísniť backend by znamenalo ticho zahodiť
// kontakt — presne to, čomu sa tu predchádza.
function normalizePhone(vstup) {
  // Medzery, pomlčky, lomky a zátvorky sú bežný spôsob zápisu, nie chyba.
  const t = String(vstup).replace(/[\s()\-/.]/g, '');
  if (!/^\+?\d+$/.test(t)) return null;

  // Doplnenie predvoľby podľa toho, ako sa číslo píše doma. SK sa píše
  // s vodiacou nulou (0900 123 456), CZ bez nej (601 123 456) — podľa toho sa
  // dá domáci zápis rozlíšiť bez toho, aby sa človeka pýtalo na krajinu.
  let d = t;
  if (d.startsWith('00')) d = '+' + d.slice(2);         // 00421… → +421…
  else if (/^09\d{8}$/.test(d)) d = '+421' + d.slice(1); // 0900 123 456 → SK
  else if (/^9\d{8}$/.test(d)) d = '+421' + d;           // 900 123 456  → SK bez nuly
  else if (/^[67]\d{8}$/.test(d)) d = '+420' + d;        // 601 123 456  → CZ

  if (/^\+4219\d{8}$/.test(d)) return d;               // SK mobil  +421 9xx xxx xxx
  if (/^\+420[67]\d{8}$/.test(d)) return d;            // CZ mobil  +420 6xx/7xx xxx xxx
  return null;
}

// Jednotné znenie chyby — aby kvíz aj analýza hovorili to isté.
const PHONE_ERR = 'Skontroluj, prosím, číslo — čakám slovenské alebo české mobilné, napr. 0900 123 456 alebo +421 900 123 456.';
