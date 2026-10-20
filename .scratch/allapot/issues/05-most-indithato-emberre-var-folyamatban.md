# 05: „Most”: mi indítható, mi vár rám, mi van folyamatban

**What to build:** az oldal tetején a „Most” rész három csoportot mutat. *Indítható:* `ready-for-agent` és nem blokkolt. *Emberre vár:* `ready-for-human`, `needs-info` vagy `needs-triage`, és nem blokkolt. *Folyamatban:* `claimed`. Egy nyitott ticket blokkolt, ha a `**Blocked by:**` sorában (számok vesszővel; a `None…` kezdetű érték üres) van olyan, ugyanazon a területen lévő ticket, amely nem lezárt.

**Blocked by:** 03

**Status:** done

- [x] A példaprojekten az Indítható csoportban a 01 látszik, az Emberre vár csoport üres
- [x] A 05 (emberre vár, de blokkolt) nem jelenik meg az Emberre vár csoportban
- [x] Egy lezárt blokkoló után a ticket indíthatóvá válik (tesztmappa)
- [x] Egy `claimed` ticket a Folyamatban csoportban látszik (tesztmappa)
- [x] Üres csoportnál rövid, nyugodt üzenet látszik
- [x] `npm run check` zöld

## Comments

**2026-10-20, /implement:** kész. Az állapotcsoport a `nyitott` helyett pontosabb (`src/server/pillanatkep.ts`): `ready-for-agent` → `agentreVar`; `ready-for-human`, `needs-info`, `needs-triage` → `emberreVar`; `claimed` → `folyamatban`; a `lezart` és az `ismeretlen` változatlan. Minden ticket megkapja a `varRa` listát: a `**Blocked by:**` sor elemei (vesszővel elválasztva; a `None…` kezdetű vagy hiányzó érték üres) közül azok, amelyek nem lezártak. A blokkoló ugyanazon a területen, szám szerint keresendő (a `1` és a `01` ugyanaz); lezárt, ha van ilyen számú ticket és mind lezárt; a nem létező vagy nem szám blokkoló nem lezárt, így a ticket blokkolt marad. Egy nyitott ticket blokkolt, ha a `varRa` nem üres; erre épülhet a 06 (Blokkolt csoport, mire vár, figyelmeztetés). A pillanatkép `most` része minden területről, területenként szám szerint adja az `indithato` (agentre vár, nem blokkolt), az `emberreVar` (emberre vár, nem blokkolt) és a `folyamatban` (claimed, blokkoltságtól függetlenül) ticketeket. Oldal: `src/web/App.svelte`: a projekt neve alatt a „Most” rész a három csoporttal, ugyanolyan sorokkal, mint a területeken; üres csoportnál rövid, halk üzenet; terület nélküli projektnél a „Most” rész nem látszik, csak a barátságos üzenet. Komponenskészlet: új `Group` (kis, halk című csoport) és `Note` (halk megjegyzés); új borostyánszínű `warning` token világos (amber-700) és sötét (amber-500) módra, a `Badge` `warning` változata ezt használja a `destructive` helyett. Tesztmappák: `lezart-blokkolo` (két terület, lezárt, nyitott és nem létező blokkoló), `folyamatban`. A felületet kézzel ellenőriztem a példaprojekten, világos és sötét módban, telefonméretben is; a `warning` jelvényt a böngészőben egy ideiglenesen beszúrt elemen.
