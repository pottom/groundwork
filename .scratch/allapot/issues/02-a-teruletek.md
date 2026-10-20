# 02: A területek

**What to build:** a projekt neve alatt látszanak a területek címei. Terület minden `.scratch/<slug>/` mappa, amelyben `spec.md` vagy `issues/` van; a címe a `spec.md` első `#` címsora, ennek hiányában a slug. Ha a projektben nincs `.scratch/` vagy nincs benne terület, egy barátságos üzenet mondja, hogy még nincs mit mutatni.

**Blocked by:** 01

**Status:** done

- [x] A példaprojekten egy terület látszik: „Aktuális időjárás egy Településen”
- [x] Cím nélküli specnél a terület a slugjával látszik
- [x] `.scratch/` nélküli projektnél barátságos üzenet látszik, hiba nélkül
- [x] A szélsőséges eseteket kis tesztmappák fedik le
- [x] `npm run check` zöld

## Comments

**2026-10-20, /implement:** kész. A pillanatkép `teruletek` listája (`src/server/pillanatkep.ts`): minden `.scratch/<slug>/` mappa, amelyben `spec.md` fájl vagy `issues/` mappa van, a spec első `#` címsorával (remark), ennek hiányában a slugjával, slug szerint rendezve; `.scratch/` nélkül üres lista. Oldal: `src/web/App.svelte` a projekt neve alatt a területek címeit mutatja, terület nélkül barátságos üzenetet. Új elemek a komponenskészletben: `Stack` (függőleges elrendezés), `Subheading` (a terület címe), `EmptyState` (az üres állapot üzenete). Tesztmappák: `cim-nelkuli-spec`, `csak-ticketek`, `nem-terulet`. A felületet kézzel ellenőriztem a példaprojekten és egy `.scratch/` nélküli projekten, világos és sötét módban.
