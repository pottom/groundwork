# Végtermék: egy kis, önálló mappa, ami bárhol elindul

**Status:** ready-for-agent

## Probléma

A Groundwork ma csak fejlesztői módban fut (Vite, `node_modules`, a forrás TypeScript-fájljai). Így nem lehet odaadni senkinek, nem lehet bemásolni egy projektbe, és nem látszik, mekkora és milyen lesz a végeredmény (ADR 0003).

## Megoldás

Egy `npm run build` parancs elkészíti a végterméket: egy kis mappát, amelyben a lefordított felület és egyetlen, minden függőséget tartalmazó szerverfájl van. Ez a mappa önmagában, `npm install` nélkül, csak Node-dal indul: `node <mappa>/groundwork.mjs --root <projekt>`. Ugyanazt tudja, mint fejlesztői módban: az Állapot nézetet élő frissítéssel.

## Felhasználói történetek

1. Fejlesztőként egy paranccsal szeretném elkészíteni a végterméket, hogy odaadhassam vagy bemásolhassam.
2. Fejlesztőként azt szeretném, hogy a végtermék `npm install` nélkül, csak Node-dal induljon, hogy bármelyik gépen és projektben működjön.
3. Fejlesztőként a `--root` kapcsolóval szeretném megadni a megmutatandó projektet, alapból az aktuális mappát.
4. Fejlesztőként azt szeretném, hogy induláskor kiírja a címet, és megnyissa a böngészőt, hogy azonnal lássam az oldalt; `--no-open`-nel ne nyissa meg.
5. Fejlesztőként a `--port` kapcsolóval szeretném megadni a portot; ha a választott port foglalt, a következő szabadot használja, és ezt kiírja.
6. Fejlesztőként azt szeretném, hogy a végtermék ugyanazt mutassa, mint fejlesztői módban, élő frissítéssel együtt.
7. Fejlesztőként azt szeretném, hogy a szerver csak a saját gépemről legyen elérhető (127.0.0.1), hogy a projektem ne látszódjon a hálózaton.
8. Fejlesztőként érthető hibaüzenetet szeretnék, ha a `--root` nem létező mappára mutat.
9. Fejlesztőként Ctrl+C-re tiszta leállást szeretnék, árván maradt figyelő nélkül.
10. Fejlesztőként szeretném tudni, mekkora a végtermék, hogy lássam, valóban kicsi-e.

## Megvalósítási döntések

- **Build:** a Vite lefordítja a felületet statikus fájlokká; az esbuild a szervert (Hono, chokidar, remark és minden függőségük) egyetlen ESM-fájllá csomagolja. A kettő egy kimeneti mappába kerül (például `dist/groundwork/`: `groundwork.mjs` és a felület fájljai).
- **Éles szerver:** egy Node-szerver (Hono), amely kiszolgálja a felület statikus fájljait, a pillanatkép-végpontot és a változás-jelzés (SSE) végpontot, és elindítja a figyelőt. Vite futásidőben nincs.
- **A fejlesztői és az éles indítás ugyanazt az API-t és figyelőt használja**, csak a felület kiszolgálása más (Vite vs. statikus fájlok).
- **Kapcsolók:** `--root` (alapból az aktuális mappa), `--port` (alapértelmezett port, foglaltság esetén a következő szabad), `--no-open`, `--help`.
- **Csak `127.0.0.1`-en figyel.**
- Új függőség: esbuild (csak fejlesztési, a buildhez).
- A build kiírja a végtermék méretét.

## Tesztelési döntések

- Egy füstteszt: elkészíti a buildet, a kimeneti mappát átmásolja egy ideiglenes helyre, ahol nincs `node_modules`, ott elindítja a `groundwork.mjs`-t egy tesztadat-projektre (`--no-open`, szabad porton), és ellenőrzi, hogy a főoldal és a pillanatkép-végpont a várt választ adja; végül leállítja.
- A meglévő tesztek és őrző tesztek (ADR 0001, 0005) zöldek maradnak.
- Kézzel: a végtermék a példaprojekten, élő frissítéssel.

## Hatókörön kívül

- `npx`-csomagolás és npm-kiadás.
- Konténer (Docker-image).
- Verziószám kiírása, frissítés-ellenőrzés.
- A setup skill (init, uninstall).
