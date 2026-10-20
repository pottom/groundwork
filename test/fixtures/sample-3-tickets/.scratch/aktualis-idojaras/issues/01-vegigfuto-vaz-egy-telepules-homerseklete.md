# 01: Végigfutó váz: egy Település hőmérséklete

**What to build:** kezdéskor csak a keresőmező és egy rövid útmutató („Írd be a település nevét”) látszik. A tag beírja egy egyértelmű nevű Település nevét (például „Zirc”), megnyomja a nagy „Keresés” gombot vagy Entert üt, és megjelenik egy kártya a Település nevével és az Aktuális időjárás hőmérsékletével, egész fokra kerekítve. Ehhez elkészül az időjárás modul két művelete (Település keresése, Aktuális időjárás lekérése), amely a hálózati hívást paraméterként kapja, és a hozzá tartozó tesztek hamis hálózattal. Az alapelemek már itt nagy betűt és erős kontrasztot kapnak.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Kezdéskor csak a keresőmező, a „Keresés” gomb és az útmutató látszik, nincs alapértelmezett Település
- [ ] A „Zirc” beírása és a gomb megnyomása után Zirc neve és aktuális hőmérséklete látszik (például „11 °C”)
- [ ] Az Enter ugyanúgy elindítja a keresést, mint a gomb
- [ ] A Település keresése csak magyarországi találatokat ad, magyar nevekkel
- [ ] A szövegek legalább 18 px-esek, a hőmérséklet jóval nagyobb, a kontraszt erős
- [ ] Az időjárás modul tesztjei hamis hálózattal futnak, és csak a modul kimenetét nézik
- [ ] `npm run check` zöld
