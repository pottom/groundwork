# Groundwork

Prezentációs réteg az AI-jal végzett munkához: megmutatja, amit Matt Pocock skilljei és a git egy projektben hagynak.

## Előkészítés

**Setup skill** (`setup-groundwork`):
A Groundwork egyetlen skillje. Egy agent futtatja egy projektben, hogy előkészítse azt a Groundworkhöz, vagy kivegye belőle.
_Avoid_: init, telepítő

**Előkészített projekt**:
Olyan projekt, amelyben van `.groundwork/` mappa. Ami ilyen mappa nélkül fut, az nem előkészített, de a Groundwork azt is megmutatja.
_Avoid_: telepített projekt, inicializált projekt

**Rögzített verzió**:
A Groundwork pontos verziója, amellyel egy előkészített projekt indul. Csak kérésre változik; a `latest` választható, de nem alapértelmezett.
_Avoid_: aktuális verzió

**Indítási mód**:
Ahogyan egy előkészített projekt a Groundworköt indítja: `npx` vagy konténer.
_Avoid_: futtatási mód, telepítési mód

**Jelölt blokk**:
Egy Matt-fájlba (például `docs/agents/issue-tracker.md`) a setup skill által beírt, névvel jelölt szakasz. Csak ott van, ahol a skillek máshonnan nem olvasnak, és a kivétel pontosan ezt veszi vissza.
_Avoid_: patch, beszúrás

**Kivétel**:
A Groundwork nyomainak eltávolítása egy projektből: a `.groundwork/` mappa és a jelölt blokkok, semmi más.
_Avoid_: uninstall, törlés
