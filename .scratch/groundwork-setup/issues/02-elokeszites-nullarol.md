# 02: Előkészítés nulláról, npx móddal

**What to build:** a `setup-groundwork` skill első, végigfutó változata. A Groundwork repójából `npx skills add`-del telepíthető (amíg nincs távoli repó, helyi útvonalról). Egy agentben futtatva körülnéz, megmutatja, mit talált és mit tenne, és csak jóváhagyás után ír: megírja a `.groundwork/config.json`-t (pontos rögzített verzió, `launch: npx`) és a sablonból generált, angol `.groundwork/README.md`-t (mi ez a mappa, a pontos indító parancs, hogyan vehető ki), és a `docs/agents/issue-tracker.md`-be a „Conventions” után beírja a `closing-a-ticket` jelölt blokkot. Ha nincs Matt-setup (`docs/agents/`), semmit nem ír, és a `/setup-matt-pocock-skills`-t kéri. Nem commitol, a végén a `git diff`-es átnézést kéri. A `SKILL.md` angolul, a `writing-for-agents` szerint készül. Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A skill a Groundwork repójában él, a sablonjaival együtt; `npx skills add`-del telepíthető, és az agent `/setup-groundwork`-ként látja
- [ ] A csomagnév a sablonokban egyetlen helyen áll
- [ ] Írás előtt megmutatja, mit talált és mit tenne, és csak jóváhagyás után ír
- [ ] Próba a példaprojekt `0-indulas` tagjén: a `git diff` pontosan a `.groundwork/config.json`, a `.groundwork/README.md` és a jelölt blokk; más fájl nem változik
- [ ] A `config.json` a pontos verziót tartalmazza, nem a `latest`-et; a `README.md` a sablonból készül, és a pontos `npx` parancsot tartalmazza
- [ ] A jelölt blokk a `groundwork:begin closing-a-ticket` / `groundwork:end closing-a-ticket` jelölők között áll, a szabály angol szövegével, a „Conventions” után
- [ ] Próba egy üres, friss git-mappában: semmit nem ír, és a `/setup-matt-pocock-skills`-t kéri
- [ ] Nem commitol; a végén elmondja, mit írt, és kéri a `git diff`-es átnézést
- [ ] A felhasználóval a beszélgetés nyelvén beszél

## Comments
