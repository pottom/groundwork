# Élő frissítés: az oldal követi a projekt változásait

**Status:** ready-for-agent

## Probléma

Amikor egy skill (például az `/implement`) munka közben átírja egy ticket állapotát vagy pipáit, a Groundwork oldala ezt nem veszi észre: újra kell tölteni. Így épp akkor nem lehet rá hagyatkozni, amikor a munka folyik, pedig akkor lenne a legtöbb értelme ránézni.

## Megoldás

A Groundwork figyeli a projekt mappáját, és ha a megmutatott fájlok közül valamelyik változik, az oldal pár másodpercen belül magától frissül, újratöltés nélkül. Ha a kapcsolat a szerverrel megszakad, az oldal ezt halkan jelzi, és magától újracsatlakozik.

## Felhasználói történetek

1. Fejlesztőként azt szeretném, hogy ha egy skill átír egy ticketet, az oldal pár másodpercen belül magától mutassa az új állapotot, hogy munka közben is rá tudjak hagyatkozni.
2. Fejlesztőként azt szeretném, hogy egy új ticket, terület vagy spec megjelenése is látsszon újratöltés nélkül, hogy a `/to-tickets` futását is lássam.
3. Fejlesztőként azt szeretném, hogy egy törölt ticket vagy terület eltűnjön az oldalról, hogy ne lássak elavult állapotot.
4. Fejlesztőként azt szeretném, hogy a README címének változása is látsszon, hogy a projekt neve mindig friss legyen.
5. Fejlesztőként azt szeretném, hogy egy gyors egymásutáni változássorozat (például sok ticket egyszerre) egyetlen frissítést okozzon, hogy az oldal ne villogjon.
6. Fejlesztőként halk jelzést szeretnék, ha a kapcsolat a szerverrel megszakadt, hogy tudjam, az oldal épp nem friss.
7. Fejlesztőként azt szeretném, hogy a kapcsolat visszatérése után az oldal magától frissüljön, hogy ne kelljen semmit tennem.
8. Fejlesztőként biztos szeretnék lenni benne, hogy a figyelés sem ír semmit a projektembe (ADR 0001).

## Megvalósítási döntések

- **Figyelő modul:** egy projekt mappájára figyel (chokidar, ADR 0002), és egy visszahívással jelzi, ha a megmutatott fájlok közül valami változott: a `.scratch/` alatt bármi, és a gyökér `README.md`. Más mappákat (például `node_modules`, `.git`) nem figyel. A gyors egymásutáni változásokat összevonja (rövid, néhány száz ezredmásodperces várakozással).
- **Szerver:** egy új végpont, amely Server-Sent Events kapcsolaton „változott” jelzést küld a böngészőnek. A pillanatkép-végpont változatlan.
- **Oldal:** a jelzésre újra lekéri a pillanatképet, és a régit lecseréli; közben nem villan üres állapot. Ha a kapcsolat megszakad, halk jelzés látszik („A kapcsolat megszakadt, újracsatlakozás…”), és visszatéréskor újra lekéri a pillanatképet.
- A felület továbbra is csak a komponenskészletből épül (ADR 0005).

## Tesztelési döntések

- Egy új varrat: a figyelő modul. A teszt egy ideiglenes mappára (a `pelda-3-ticketek` másolatára) indítja, abban módosít, létrehoz és töröl fájlt, és azt nézi, hogy a visszahívás meghívódik-e; a `.scratch/`-en kívüli (nem README) változásra nem; és egy gyors sorozat egyetlen jelzést ad.
- Az olvasó modul tesztjei változatlanok; az ADR 0001 és ADR 0005 őrző tesztjei továbbra is zöldek.
- A teljes utat kézzel ellenőrizzük: futó Groundwork mellett a példaprojekten egy ticket átírása pár másodpercen belül látszik.

## Hatókörön kívül

- A változás kiemelése vagy animálása az oldalon.
- Változásnapló, „legutóbbi mozgás”.
- Git-adatok figyelése.
