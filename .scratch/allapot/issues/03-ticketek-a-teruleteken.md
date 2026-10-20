# 03: Ticketek a területeken

**What to build:** minden terület alatt látszanak a ticketjei a számukkal, a címükkel és az állapotukkal. Ticket minden `.scratch/<slug>/issues/<NN>-<név>.md`; a száma a fájlnév elejéről, a címe az első címsorból (`# NN: Cím` alakból a cím rész), az állapota a `**Status:**` sorból jön.

**Blocked by:** 02

**Status:** done

- [x] A példaprojekt területe alatt az öt ticket látszik számmal, címmel és állapottal, szám szerinti sorrendben
- [x] Az állapot olvashatóan jelenik meg (például `ready-for-agent`, `ready-for-human`)
- [x] `npm run check` zöld

## Comments

**2026-10-20, /implement:** kész. A pillanatkép területenként a `ticketek` listáját is adja (`src/server/pillanatkep.ts`): minden `issues/<NN>-<név>.md` fájl, a fájlnév elején álló számmal, a `# NN: Cím` címsor cím részével (ha a címsor nem ilyen alakú, az egészével; ha nincs címsor, a fájlnév név részével) és a `**Status:**` sor értékével (remark, így a kódblokkban álló sor nem számít), szám szerint rendezve. Ha nincs `**Status:**` sor, az állapot hiányzik, és nem látszik jelvény. Oldal: `src/web/App.svelte` minden terület alatt a ticketeket mutatja számmal, címmel és nyers állapottal. Új elemek a komponenskészletben: `Section` (a terület címe és listája együtt), `ItemList` (elválasztott lista), `Item` (szám, cím, és a végén egy jelvény), `Badge` (az állapot). Tesztmappa: `ticket-szelek`. Közben: az `npm run dev` a `src/server/` változásaira újraindul (`node --watch-path=src/server`; a sima `--watch` a Vite ideiglenes config-fájlja miatt újraindítási hurokba került). A felületet kézzel ellenőriztem a példaprojekten, világos és sötét módban, telefonméretben is.
