# 01: Futás konténerben

**What to build:** a végtermék konténerben is használható (ADR 0008): egy új `--host` kapcsolóval a szerver a megadott címen figyel (alapból továbbra is csak `127.0.0.1`), és ez minden indítási módban működik, nem csak konténerben: aki máshonnan is el akarja érni, átállíthatja; nem helyi címnél a Groundwork figyelmeztet, hogy a projekt tartalma hitelesítés nélkül látszik a hálózaton; konténerben nem próbál böngészőt nyitni; és egy kapcsolóval a figyelő lekérdezéses módra válthat, ha a fájlváltozás nem jut át a csatolt mappán. A README leírja a két konténeres indítást: a hivatalos Node-image + npx (rögzített verziókkal), és az offline image egyszeri, helyi megépítésének kész parancsát.

**Blocked by:** None (can start immediately)

**Status:** needs-triage

## Comments

**2026-10-20, felvetés:** a végtermék most csak a `127.0.0.1`-en figyel, így konténerben kívülről nem érhető el; ez minden konténeres módot érint. Az npm-kiadás előtt a parancsok a helyben buildelt végtermékkel próbálhatók.
