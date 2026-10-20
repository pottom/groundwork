# 07: Konténeres indítási mód és offline image

**What to build:** a skill az indítási mód kérdésénél a konténert is felkínálja, és előkészített projektben a módváltást is. Konténeres módban a `config.json`-ba `launch: container` és a pontos Node-image (`image`) kerül, a `README.md` pedig a teljes `docker run` parancsot tartalmazza: hivatalos, pontos verziójú Node-image, npx a rögzített verzióval, a projekt csak olvashatóan csatolva, `-p 127.0.0.1:…`, `--host 0.0.0.0`, böngészőnyitás nélkül (ADR 0008). Kérésre kiadja az offline image egyszeri, helyi megépítésének kész parancsát. Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** 04, kontener/01

**Status:** ready-for-agent

- [ ] Előkészítéskor választható a konténeres mód; a `config.json` a pontos image-et tartalmazza, a `README.md` a teljes `docker run` parancsot
- [ ] Előkészített projektben a mód `npx` és konténer között váltható, jóváhagyással
- [ ] Kérésre a skill kiadja az offline image megépítésének kész parancsát, és nem ír fájlt
- [ ] A kiírt `docker run` parancs a helyben buildelt végtermékkel kipróbálva elindítja a Groundworköt a példaprojekten, és csak a gépen érhető el
- [ ] Kivétel konténeres mód után is csak a `.groundwork/` mappát és a jelölt blokkot veszi ki

## Comments
