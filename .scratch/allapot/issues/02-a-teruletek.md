# 02: A területek

**What to build:** a projekt neve alatt látszanak a területek címei. Terület minden `.scratch/<slug>/` mappa, amelyben `spec.md` vagy `issues/` van; a címe a `spec.md` első `#` címsora, ennek hiányában a slug. Ha a projektben nincs `.scratch/` vagy nincs benne terület, egy barátságos üzenet mondja, hogy még nincs mit mutatni.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A példaprojekten egy terület látszik: „Aktuális időjárás egy Településen”
- [ ] Cím nélküli specnél a terület a slugjával látszik
- [ ] `.scratch/` nélküli projektnél barátságos üzenet látszik, hiba nélkül
- [ ] A szélsőséges eseteket kis tesztmappák fedik le
- [ ] `npm run check` zöld
