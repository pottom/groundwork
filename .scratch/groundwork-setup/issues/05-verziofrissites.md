# 05: A rögzített verzió frissítése

**What to build:** előkészített projektben a skill felkínálja a rögzített verzió frissítését: lekérdezi a csomag aktuális npm-verzióját, megmutatja a régit és az újat, és csak jóváhagyás után írja át a `config.json`-t és generálja újra a `README.md`-t. A `latest` csak kifejezett kérésre kerül be. Ha már a legújabb verzió van rögzítve, ezt mondja, és nem ír. Lásd a specet: `.scratch/groundwork-setup/spec.md`.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] A frissítés megmutatja a régi és az új verziót, és csak jóváhagyás után ír
- [ ] A `git diff` csak a `config.json` verziója és a `README.md` parancsa
- [ ] A `latest` csak kifejezett kérésre kerül be
- [ ] Ha nincs újabb verzió, nem ír semmit, és ezt megmondja
- [ ] Amíg a csomag nincs az npm-en, a skill ezt érthetően jelzi, és nem ír

## Comments
