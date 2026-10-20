# 01: A projekt neve egy oldalon

**What to build:** a fejlesztő elindítja a Groundworköt egy projekt mappájára (`npm run dev -- --root ../groundwork-pelda`), és megnyílik egy oldal, amelyen egyetlen dolog látszik: a projekt neve („Időjárás app: a Groundwork példaprojektje”). Ez a legvékonyabb út végig: az olvasó modul a pillanatképbe a projekt nevét olvassa, a Hono-szerver egy végponton adja, a Svelte-oldal a komponenskészlet első elemével mutatja. Itt jön létre a komponenskészlet alapja (shadcn-svelte, közös tokenek, világos és sötét mód) és a két őrző teszt.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] A projekt neve a gyökér `README.md` első `#` címsorából jön; ha nincs, a mappa nevéből
- [x] A példaprojekten a „Időjárás app: a Groundwork példaprojektje” felirat látszik
- [x] Az olvasó modul tesztje a `groundwork-pelda` `3-ticketek` tagjéről exportált másolaton fut, amely a tesztadatok között él
- [x] Az oldal világos és sötét módban is jól néz ki, a színek a közös tokenekből jönnek
- [x] Őrző teszt: elbukik, ha a komponenskészleten kívül bármelyik Svelte-fájlban `class`, `style` vagy `<style>` van (ADR 0005)
- [x] Őrző teszt: az olvasás után a projekt mappája változatlan
- [x] `npm run check` zöld (típusellenőrzés és tesztek)

## Comments

**2026-10-20, /implement:** kész. Olvasó modul: `src/server/pillanatkep.ts` (a címsort remark olvassa, így a kódblokkban álló `#` sor nem számít). Végpont: `GET /api/pillanatkep` (Hono). Oldal: `src/web/App.svelte` a komponenskészlet `Page` és `Heading` elemével. Tokenek: shadcn-svelte stone, a sötét mód a rendszerbeállítást követi. Fejlesztői indításkor egy folyamat fut: a Vite egy middleware-rel adja tovább a `/api/` kéréseket a Hono-appnak (README). A felületet kézzel ellenőriztem a példaprojekten, világos és sötét módban.
