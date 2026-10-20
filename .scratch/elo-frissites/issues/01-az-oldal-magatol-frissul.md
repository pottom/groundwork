# 01: Az oldal magától frissül, ha a projekt változik

**What to build:** futó Groundwork mellett, ha a projekt `.scratch/` mappájában vagy a gyökér `README.md`-ben bármi változik (módosul, létrejön vagy törlődik egy fájl), az oldal pár másodpercen belül magától az új állapotot mutatja, újratöltés nélkül. A gyors egymásutáni változások egyetlen frissítést okoznak. Ha a kapcsolat a szerverrel megszakad, halk jelzés látszik, és visszatéréskor az oldal magától frissül.

**Blocked by:** None (can start immediately)

**Status:** claimed

- [ ] Egy ticket `**Status:**` sorának átírása után az oldal pár másodpercen belül az új állapotot mutatja, újratöltés nélkül
- [ ] Új ticket létrehozása és egy ticket törlése is látszik újratöltés nélkül
- [ ] A `.scratch/`-en kívüli fájlok (kivéve a gyökér `README.md`-t) változása nem okoz frissítést
- [ ] Gyors egymásutáni változások egyetlen frissítést okoznak (teszt)
- [ ] Frissítés közben nem villan üres állapot
- [ ] Megszakadt kapcsolatnál halk jelzés látszik, visszatéréskor az oldal frissül
- [ ] A figyelő modul tesztje ideiglenes mappán fut; az ADR 0001 és 0005 őrző tesztjei zöldek
- [ ] `npm run check` zöld
