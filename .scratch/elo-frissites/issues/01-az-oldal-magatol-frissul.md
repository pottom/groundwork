# 01: Az oldal magától frissül, ha a projekt változik

**What to build:** futó Groundwork mellett, ha a projekt `.scratch/` mappájában vagy a gyökér `README.md`-ben bármi változik (módosul, létrejön vagy törlődik egy fájl), az oldal pár másodpercen belül magától az új állapotot mutatja, újratöltés nélkül. A gyors egymásutáni változások egyetlen frissítést okoznak. Ha a kapcsolat a szerverrel megszakad, halk jelzés látszik, és visszatéréskor az oldal magától frissül.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Egy ticket `**Status:**` sorának átírása után az oldal pár másodpercen belül az új állapotot mutatja, újratöltés nélkül
- [x] Új ticket létrehozása és egy ticket törlése is látszik újratöltés nélkül
- [x] A `.scratch/`-en kívüli fájlok (kivéve a gyökér `README.md`-t) változása nem okoz frissítést
- [x] Gyors egymásutáni változások egyetlen frissítést okoznak (teszt)
- [x] Frissítés közben nem villan üres állapot
- [x] Megszakadt kapcsolatnál halk jelzés látszik, visszatéréskor az oldal frissül
- [x] A figyelő modul tesztje ideiglenes mappán fut; az ADR 0001 és 0005 őrző tesztjei zöldek
- [x] `npm run check` zöld

## Comments

**2026-10-20, /implement:** kész. Új varrat, a figyelő modul (`src/server/figyelo.ts`): `figyel(projektMappa, valtozott)` chokidarral (új függőség, ADR 0002) a projekt mappáját figyeli, de csak azt, amit a pillanatkép megmutat: a `.scratch/` alatt bármit és a gyökér `README.md`-t; minden mást (például `node_modules`, `.git`, `src/`) ki sem nyit. Módosításra, létrehozásra és törlésre (mappára is) jelez; a gyors sorozatokat egy 200 ms-os időzítő vonja össze (az utolsó változás után 200 ms-mal jelez egyszer). Akkor tér vissza, amikor a figyelés kész, és `close()`-zal leáll. Szerver: a `groundworkApi` most `{ app, valtozott }`-ot ad; új végpont: `GET /api/valtozasok` (Server-Sent Events, Hono `streamSSE`), amely minden nyitott kapcsolatnak `valtozott` eseményt küld; a pillanatkép-végpont változatlan. A `src/server/dev.ts` köti össze a figyelőt és az appot, és SIGINT/SIGTERM-re (Ctrl+C, illetve a `node --watch-path` újraindítása) lezárja a figyelőt és a Vite-ot, majd kilép. Oldal (`src/web/App.svelte`): az `{#await}` helyett állapotban tartja a pillanatképet, így frissítéskor a régi látszik, amíg az új meg nem jön; csak a legutóbb indított lekérés eredménye kerül ki. Az `EventSource` jelzésére és minden (újra)csatlakozáskor újra lekéri a pillanatképet; megszakadt kapcsolatnál halk jelzés látszik („A kapcsolat megszakadt, újracsatlakozás…”); ha az `EventSource` végleg lezárta a kapcsolatot, 3 másodperc múlva újat nyit; ha egy frissítés nem sikerül, a korábbi állapot marad, és ezt halk jelzés mondja. Komponenskészlet: új `Notice` (halk, lebegő jelzés az oldal alján, `role="status"`, nem tolja el a tartalmat). Tesztek: `test/figyelo.test.ts` a `pelda-3-ticketek` ideiglenes másolatán (módosítás, létrehozás, törlés, új terület mappája, gyökér README: jelez; `.scratch/`-en kívüli és nem gyökér README: nem jelez; tíz gyors írás: egy jelzés; lezárás után nem jelez), a pozitív esetek `vi.waitFor`-ral várnak, a „nem jelez” esetek 1 másodperces csendet figyelnek; az ADR 0001 őrző tesztje a figyelésre is kiterjed. Kézzel ellenőriztem egy ideiglenes másolaton: a Status sor átírása, egy új ticket és egy törölt ticket egy másodpercen belül, egyetlen lekéréssel látszik, üres állapot nem villan; a `src/` és `docs/` alatti változás nem frissít; leállított szervernél a halk jelzés látszik, és visszatéréskor az oldal az új README-címet mutatja. Fejlesztés közben ezt a Vite saját kliense teljes újratöltéssel előzi meg, így az `EventSource` újracsatlakozási ága kézzel külön nem volt kipróbálható. A dev szerver SIGTERM-re és SIGINT-re pár másodpercen belül kilép, és nem marad utána figyelő.
