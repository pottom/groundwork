# Aktuális időjárás egy Településen

**Status:** ready-for-agent

## Probléma

A Napsugár Túraklub tagjai minden túra előtt azt kérdezik, milyen idő van ott, ahová mennek. Ma ehhez időjárás-oldalakat kell végigkattintaniuk, amelyek zsúfoltak, gyakran nem magyar nyelvűek, és az idősebb tagoknak telefonon nehezen kezelhetők.

## Megoldás

Egy egyszerű, magyar nyelvű, telefonon is jól használható oldal. A tag beírja egy Település nevét, megnyom egy nagy „Keresés” gombot, és látja ott az Aktuális időjárást: hány fok van, milyen a Szélerősség (szélcsend, gyenge szél, erős szél), és milyen az Égkép (napos, felhős, esős, havas, zivataros). Ha több Település is ugyanazt a nevet viseli, a találatok a megyéjükkel együtt listában jelennek meg, és a tag választ. Az adatok az Open-Meteo ingyenes szolgáltatásából jönnek (ADR 0001).

## Felhasználói történetek

1. Klubtagként egy Település nevét beírva szeretném látni ott az Aktuális időjárást, hogy tudjam, mire készüljek a túrán.
2. Klubtagként egy nagy „Keresés” gombbal szeretném elindítani a keresést, hogy telefonon is könnyen eltaláljam.
3. Klubtagként az Enter megnyomásával is szeretnék keresni, hogy gépen ne kelljen az egérhez nyúlnom.
4. Klubtagként a hőmérsékletet nagy, egész fokra kerekített számmal szeretném látni (például „11 °C”), hogy messziről is leolvassam.
5. Klubtagként nulla fok körül nem szeretnék „-0 °C”-ot látni, hogy ne zavarjon meg a furcsa előjel.
6. Klubtagként szóval szeretném látni, fúj-e a szél (szélcsend, gyenge szél, erős szél), hogy ne kelljen km/h-t értelmeznem.
7. Klubtagként szóval szeretném látni, milyen az ég (napos, felhős, esős, havas, zivataros), hogy egy pillantással tudjam, kell-e esőkabát.
8. Klubtagként ködös időben „felhős” Égképet szeretnék látni, hogy kevés, közérthető állapot közül kelljen értelmeznem.
9. Klubtagként szitálásnál és záporban is „esős” Égképet szeretnék látni, hogy minden eső egy szóval jelenjen meg.
10. Klubtagként havazásnál „havas” Égképet szeretnék látni, hogy télen tudjam, havas útra készüljek.
11. Klubtagként zivatarnál „zivataros” Égképet szeretnék látni, hogy a veszélyes időt ne keverjem össze a sima esővel.
12. Klubtagként egy azonos nevű Települések közül (például „Kisfalud”) a megyéjükkel együtt szeretnék választani, hogy biztosan a túra helyének idejét lássam.
13. Klubtagként, ha a névre csak egy Település van, választás nélkül szeretném rögtön látni az időjárását, hogy ne kelljen feleslegesen kattintanom.
14. Klubtagként csak magyarországi Településeket szeretnék a találatok között látni, hogy egy hazai név ne adjon külföldi helyet.
15. Klubtagként ismeretlen név beírásakor azt szeretném olvasni, hogy „Nincs ilyen nevű település.”, hogy tudjam, elírtam-e.
16. Klubtagként, ha az időjárás-szolgáltatás nem érhető el, azt szeretném olvasni, hogy „Most nem érjük el az időjárás-szolgáltatást. Próbáld újra kicsit később.”, hogy tudjam, nem én rontottam el.
17. Klubtagként hibánál nem szeretnék technikai részleteket látni, hogy ne ijedjek meg.
18. Klubtagként az oldal megnyitásakor csak a keresőmezőt és egy rövid útmutatót szeretnék látni („Írd be a település nevét”), hogy ne higgyem egy alapértelmezett helyről, hogy az a túra helye.
19. Klubtagként üres mezővel nem szeretnék keresést indítani, hogy ne kapjak értelmetlen hibát.
20. Klubtagként a név elején és végén lévő szóközöktől függetlenül szeretnék találatot kapni, hogy egy véletlen szóköz ne rontsa el a keresést.
21. Idősebb klubtagként legalább 18 px-es betűket és erős kontrasztot szeretnék, hogy szemüveg nélkül is el tudjam olvasni.
22. Idősebb klubtagként telefonon kényelmesen eltalálható gombokat és listaelemeket szeretnék, hogy ne nyomjak mellé.
23. Klubtagként az egész oldalt magyarul szeretném látni, hogy mindent értsek.
24. Klubtagként egy új keresésnél az előző eredmény helyett az újat szeretném látni, hogy ne keveredjenek a helyek.
25. Klubtagként az eredménynél a Település nevét is szeretném látni (azonos neveknél a megyével), hogy tudjam, melyik hely idejét nézem.

## Megvalósítási döntések

- Egy új **időjárás modul** készül a felület alatt, két művelettel:
  - **Település keresése:** névből a magyarországi találatok listája; minden találatnak van neve, megyéje és földrajzi helye. Az üres vagy csak szóközből álló név nem indít keresést.
  - **Aktuális időjárás lekérése:** egy Településhez a hőmérséklet (°C), a Szélerősség és az Égkép.
- A modul a hálózati hívást paraméterként kapja, így a tesztek hamis hálózattal futnak.
- A modul a hibákat két, a felület számára megkülönböztethető esetként adja vissza: **nincs ilyen Település**, illetve **a szolgáltatás nem érhető el** (hálózati hiba vagy hibás válasz). A felület ezekhez a fenti két magyar mondatot írja ki.
- A Település keresése az Open-Meteo településkeresőjével megy, Magyarországra szűrve, magyar nyelvű nevekkel. A megye a találat első szintű közigazgatási egysége.
- Az Aktuális időjárás az Open-Meteo aktuális adataiból jön: hőmérséklet, szélsebesség km/h-ban, időjáráskód.
- **Szélerősség:** 5 km/h alatt szélcsend, 5 és 30 km/h között gyenge szél, 30 km/h fölött erős szél.
- **Égkép** az Open-Meteo időjáráskódjából: derült és túlnyomóan derült = napos; részben felhős, borult és köd = felhős; szitálás, eső, ónos eső és zápor = esős; havazás, hódara és hózápor = havas; zivatar (jégesővel is) = zivataros.
- A hőmérséklet kijelzése a meglévő hőmérséklet-formázót használja (egész fokra kerekít, nincs „-0”).
- A felület: keresőmező, nagy „Keresés” gomb (Enterrel is működik), azonos neveknél választólista megyével, egy kártya az Aktuális időjárással, és egy hibaüzenet-sáv. Kezdéskor csak a keresőmező és az útmutató látszik.
- Ikonok és gépelés közbeni javaslatok nincsenek.

## Tesztelési döntések

- Egyetlen varrat: az időjárás modul. A tesztek csak azt nézik, mi jön ki belőle (találatok, hőmérséklet, Szélerősség, Égkép, hibák), azt nem, hogyan számolja.
- A tesztek hamis hálózatot adnak a modulnak, amely Open-Meteo-formájú válaszokat ad vissza; valódi hálózatot nem használnak.
- A Szélerősség határai (például 4, 5, 30 és 31 km/h) és az Égkép összes csoportja ezen a varraton keresztül tesztelődik.
- Tesztelt esetek: egy találat, több azonos nevű találat megyével, nincs találat, üres név, hálózati hiba, hibás válasz.
- Előzmény: a hőmérséklet-formázó tesztje, amely ugyanígy csak a bemenetet és a kimenetet nézi.
- A felületet nem teszteljük automatikusan; kézzel ellenőrizzük telefonméretben is.

## Hatókörön kívül

- Előrejelzés a következő napokra.
- Fahrenheit vagy más mértékegység.
- Kedvenc Települések mentése.
- Ikonok az Égképhez.
- Gépelés közbeni javaslatok.
- Külföldi helyek.
- Saját szerver vagy API-kulcs.

## További megjegyzések

Az app internet nélkül nem működik, és az Open-Meteo kéréskorlátjára sem kell külön felkészülni a klub méreténél (ADR 0001).
