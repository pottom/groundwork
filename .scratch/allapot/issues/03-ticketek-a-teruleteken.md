# 03: Ticketek a területeken

**What to build:** minden terület alatt látszanak a ticketjei a számukkal, a címükkel és az állapotukkal. Ticket minden `.scratch/<slug>/issues/<NN>-<név>.md`; a száma a fájlnév elejéről, a címe az első címsorból (`# NN: Cím` alakból a cím rész), az állapota a `**Status:**` sorból jön.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A példaprojekt területe alatt az öt ticket látszik számmal, címmel és állapottal, szám szerinti sorrendben
- [ ] Az állapot olvashatóan jelenik meg (például `ready-for-agent`, `ready-for-human`)
- [ ] `npm run check` zöld
