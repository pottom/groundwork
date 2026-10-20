# 06: Felzárkóztatás futó projektben

**What to build:** helyi trackerű, nyitott ticketeket tartalmazó projektben a skill az előkészítés utolsó, opcionális lépéseként (és később kérésre is) felkínálja a felzárkóztatást. A nyitott ticketeket összeveti a kóddal és a git-történettel, és egy táblázatban mutatja: ticket, bizonyíték (commitok, fájlok, teljesült feltételek), javaslat (lezárható / nem). Csak az elfogadottakat zárja le, a lezárási szabály szerint: kipipálja a teljesült feltételeket, `Status: done`, és dátumozott megjegyzés a `## Comments` alatt arról, hogy a felzárkóztatáskor fogadták el. Nyitott ticket nélkül vagy nem helyi trackernél a lépés szóba sem kerül. A példaprojekt ehhez új taget kap. Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A példaprojektben van egy `4a-megepitve-lezaratlan` tag a `39b1f2d` commiton, és a README táblázata leírja
- [ ] Próba a `4a-megepitve-lezaratlan` tagen: a táblázat a 01-et lezárásra javasolja, a 02–05-öt nem, bizonyítékkal
- [ ] Elfogadás után a 01 a szabály szerint lezárva; a többi ticket változatlan
- [ ] Ha semmit nem fogadok el, egyetlen ticket sem változik
- [ ] A `0-indulas` tagen (nincs nyitott ticket) a felzárkóztatás szóba sem kerül
- [ ] Kivétel után a felzárkóztatáskor lezárt ticketek lezárva maradnak; a taghez képest a `git diff` csak ezek a lezárások

## Comments
