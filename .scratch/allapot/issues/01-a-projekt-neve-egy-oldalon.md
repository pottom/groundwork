# 01: A projekt neve egy oldalon

**What to build:** a fejlesztő elindítja a Groundworköt egy projekt mappájára (`npm run dev -- --root ../groundwork-pelda`), és megnyílik egy oldal, amelyen egyetlen dolog látszik: a projekt neve („Időjárás app: a Groundwork példaprojektje”). Ez a legvékonyabb út végig: az olvasó modul a pillanatképbe a projekt nevét olvassa, a Hono-szerver egy végponton adja, a Svelte-oldal a komponenskészlet első elemével mutatja. Itt jön létre a komponenskészlet alapja (shadcn-svelte, közös tokenek, világos és sötét mód) és a két őrző teszt.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A projekt neve a gyökér `README.md` első `#` címsorából jön; ha nincs, a mappa nevéből
- [ ] A példaprojekten a „Időjárás app: a Groundwork példaprojektje” felirat látszik
- [ ] Az olvasó modul tesztje a `groundwork-pelda` `3-ticketek` tagjéről exportált másolaton fut, amely a tesztadatok között él
- [ ] Az oldal világos és sötét módban is jól néz ki, a színek a közös tokenekből jönnek
- [ ] Őrző teszt: elbukik, ha a komponenskészleten kívül bármelyik Svelte-fájlban `class`, `style` vagy `<style>` van (ADR 0005)
- [ ] Őrző teszt: az olvasás után a projekt mappája változatlan
- [ ] `npm run check` zöld (típusellenőrzés és tesztek)
