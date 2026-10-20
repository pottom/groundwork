# 01: A Groundwork jelzi, ha a projekt nincs előkészítve

**What to build:** ha a Groundworköt olyan projektre indítják, amelyben nincs `.groundwork/` mappa, ugyanúgy mindent megmutat, mint eddig, de a felület tetején egy jól látható, nem tolakodó jelzés áll: a projekt nincs előkészítve, és alatta a két kimásolható lépés (a setup skill telepítése `npx skills add`-del, majd a `/setup-groundwork` az agentben). Indításkor a terminál is kiírja ugyanezt. Amint a `.groundwork/` mappa megjelenik, a jelzés újratöltés nélkül eltűnik. A program továbbra sem ír a projektbe (ADR 0001). Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A pillanatkép megmondja, előkészített-e a projekt; teszt: a `sample-3-tickets` tesztadaton nem, egy `.groundwork/`-öt tartalmazó ideiglenes másolaton igen
- [ ] A figyelő a `.groundwork/` mappa megjelenésére és eltűnésére is jelez (teszt)
- [ ] Nem előkészített projektben a felület tetején látszik a jelzés a két kimásolható lépéssel; előkészítettben nem
- [ ] A jelzés a `.groundwork/` létrehozása után újratöltés nélkül eltűnik (kézzel, a példaprojekten)
- [ ] Indításkor a terminál is kiírja a jelzést és a két lépést, ha a projekt nincs előkészítve (fejlesztői és végtermék-indításnál is)
- [ ] A jelzés csak a komponenskészletből épül; az ADR 0001 és 0005 őrző tesztjei zöldek
- [ ] `npm run check` zöld

## Comments
