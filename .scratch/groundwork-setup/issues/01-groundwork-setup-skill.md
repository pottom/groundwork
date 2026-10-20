# 01: Groundwork setup skill: egy LLM készíti elő a projektet

**What to build:** egy skill (Matt `/setup-matt-pocock-skills` mintájára), amelyet egy agent futtat egy projektben, új vagy már futó projektben egyaránt, és amely előkészíti azt a Groundworkhöz. Promptból vezérelt, nem determinisztikus program: körülnéz, megmutatja, mit talált és mit tenne, a jóváhagyás után ír. A Groundwork programja továbbra sem ír a projektbe (ADR 0001); a setup az agent munkája, az ember jóváhagyásával.

Három helyzetet kezel: nulláról induló projekt, már futó projekt, és a Groundwork kivétele a projektből. Minden, amit a projektbe tesz, a `.groundwork/` mappába kerül; Matt fájljaihoz csak minimálisan, jelölt blokkal nyúl, amelyet a kivétel pontosan visszavesz (ADR 0007).

Amit tudnia kell (a triage és a grillezés pontosítja):
- megnézi, le van-e futtatva a Matt-féle setup (`docs/agents/`); ha nincs, megmondja, hogy előbb azt kell futtatni;
- ha nincs benne, beírja a `docs/agents/issue-tracker.md`-be a „Closing a ticket” szabályt, jelölt blokkban;
- már futó projektnél felzárkóztat: végignézi a nyitott ticketeket a kóddal és a git-történettel, ticketenként javaslatot tesz a lezárásra, és csak az elfogadottakat zárja le;
- megkérdezi az indítás módját (npx vagy konténer, ADR 0008), és a `.groundwork/` alá írja a választott módot és a rögzített verziót; megmondja, hogyan indítható;
- kérésre frissíti a rögzített verziót;
- kivételkor eltávolítja a `.groundwork/` mappát és a jelölt blokkokat, mást nem;
- GitHub vagy GitLab tracker esetén jelzi, hogy a Groundwork ma csak a helyi trackert olvassa.

**Blocked by:** None (can start immediately)

**Status:** needs-triage

## Comments

**2026-10-20, felvetés:** a felhasználó igénye, miután kiderült, hogy az `/implement` nem zárja le a ticketet, és a helyi tracker sablonja nem mondja meg, mi zárja le. A régi Groundwork `groundwork init` programja helyett (kb. 15 KB kód) promptból vezérelt skill.
