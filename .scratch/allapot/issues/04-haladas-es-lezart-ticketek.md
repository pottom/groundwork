# 04: Haladás és lezárt ticketek

**What to build:** minden ticketnél látszik a pipák aránya (például 2/7) a `- [ ]` és `- [x]` sorokból. A lezárt ticketek (`done`, `closed`, `resolved`, `wontfix`) elkülönülnek a nyitottaktól, hogy a nyitott munka kiemelkedjen. Egy ismeretlen állapotú ticket is látszik a területén, a nyers állapotával.

**Blocked by:** 03

**Status:** done

- [x] A példaprojekt ticketjeinél a pipák aránya látszik (például a 01-nél 0/7)
- [x] Egy lezárt ticket láthatóan elkülönül a nyitottaktól
- [x] Egy ismeretlen állapotú ticket nyers állapottal látszik, nem tűnik el
- [x] A lezárt és az ismeretlen állapotot kis tesztmappák fedik le
- [x] `npm run check` zöld

## Comments

**2026-10-20, /implement:** kész. A pillanatkép minden ticketnél adja a `pipak` arányát (`kesz`/`osszes`) és az állapot `csoport`ját (`src/server/pillanatkep.ts`). Pipa minden `[ ] `-vel vagy `[x] `-szel (`[X] `-szel) kezdődő listaelem, beágyazva is; a kódblokkban álló nem. A remark GFM nélkül nem ismeri a pipát, ezért a listaelem szövegének elejéről olvassuk, új függőség nélkül. Csoport: `done`, `closed`, `resolved`, `wontfix` → `lezart`; a többi ismert címke (`ready-for-agent`, `ready-for-human`, `needs-info`, `needs-triage`, `claimed`) → `nyitott`; minden más → `ismeretlen`, a hiányzó állapot is. Az egyezés pontos, kisbetűs: a `Done` ismeretlen. A nyitott csoport bontása és a „Most” rész az 05–06. Oldal: `src/web/App.svelte`: a lezárt ticket sora halvány, és szám szerinti helyén marad; az ismeretlen állapot nyersen, figyelmeztető jelvénnyel látszik; a sor végén a pipák aránya. Pipa nélküli ticketnél a hely üres, hogy az oszlop egyben álljon. Állapot nélküli ticketnél továbbra sincs jelvény. Komponenskészlet: `Item` `dimmed`, `Badge` `warning` változat (a `destructive` tokennel, mert nincs külön figyelmeztető token), új `Progress`. Tesztmappák: `pipa-szelek`, `lezart-ticketek`, `ismeretlen-allapot`. A felületet kézzel ellenőriztem a példaprojekten és egy vegyes állapotú ideiglenes projekten, világos és sötét módban, telefonméretben is.
