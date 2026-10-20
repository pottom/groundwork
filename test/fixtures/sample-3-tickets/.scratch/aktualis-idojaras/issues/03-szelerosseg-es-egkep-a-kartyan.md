# 03: Szélerősség és Égkép a kártyán

**What to build:** a kártyán a hőmérséklet mellett megjelenik a Szélerősség (szélcsend, gyenge szél, erős szél) és az Égkép (napos, felhős, esős, havas, zivataros), szóval, ikon nélkül. A Szélerősség 5 km/h alatt szélcsend, 5 és 30 km/h között gyenge szél, 30 km/h fölött erős szél. Az Égkép az Open-Meteo időjáráskódjából jön a specben leírt csoportosítás szerint.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] A kártyán a Szélerősség szóval látszik
- [ ] A kártyán az Égkép szóval látszik
- [ ] A Szélerősség határait teszt fedi le (4, 5, 30 és 31 km/h)
- [ ] Az Égkép minden kódcsoportját teszt fedi le, a ködöt (felhős) és a zivatart jégesővel (zivataros) is
- [ ] `npm run check` zöld
