# 03: Kézzel beírt szabály és nem helyi tracker

**What to build:** a skill két eltérő helyzetet is helyesen kezel. Ha a „Closing a ticket” szabály jelölés nélkül már megvan, nem nyúl hozzá és nem keretezi be, hanem jelzi; ha a szövege eltér a Groundworkétől, megmutatja a különbséget. Jelölt blokk ilyenkor nem lesz. Ha a tracker nem helyi (GitHub, GitLab vagy más), figyelmeztet, hogy a Groundwork ma csak a helyi trackert olvassa, és a `.groundwork/` mappát megírja, de jelölt blokkot nem. Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Próba a példaprojekt `4-epul` tagjén: a meglévő szabály változatlan, a skill jelzi, hogy már megvan; a `git diff` csak a `.groundwork/` két fájlja
- [ ] Ha a meglévő szabály szövege eltér, a skill megmutatja a különbséget, és úgy hagyja
- [ ] Próba egy olyan példaprojekt-másolaton, amelynek `issue-tracker.md`-je GitHubot ír le: figyelmeztet, a `git diff` csak a `.groundwork/` két fájlja
- [ ] Mindkét helyzetben írás előtt megmutatja, mit tenne, és jóváhagyást kér

## Comments
