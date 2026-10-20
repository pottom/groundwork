# 01: A kód átnevezése angolra (ADR 0006)

**What to build:** a Groundwork forráskódja az ADR 0006 szerint angol lesz: fájl- és mappanevek (a `test/adatok/` és alatta a tesztmappák is), azonosítók (típusok, függvények, változók, mezők, komponensek, API-végpontok, például `pillanatkep` → snapshot, `olvasPillanatkep`, `figyelo`, `/api/pillanatkep`, `/api/valtozasok`) és a kód megjegyzései. A viselkedés nem változik: a felület szövegei magyarok maradnak, a tesztek ugyanazt ellenőrzik, az oldal ugyanúgy néz ki a példaprojekten. A tesztadatok belsejében lévő projektfájlok (README, `.scratch/` tartalma) a példát utánozzák, ezek tartalma nem fordítandó.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Nincs magyar fájl- vagy mappanév a `src/` és a `test/` alatt (a tesztadatok projektfájljainak tartalma kivétel)
- [ ] Nincs magyar azonosító és magyar kódmegjegyzés a `src/` és a `test/` kódjában
- [ ] Az API-végpontok angol nevűek, és a felület ezeket hívja
- [ ] A felület szövegei magyarok maradtak, és az oldal a példaprojekten ugyanúgy néz ki, mint előtte
- [ ] A README „Felépítés” része az új neveket mutatja
- [ ] `npm run check` zöld, ugyanannyi teszttel, mint előtte
