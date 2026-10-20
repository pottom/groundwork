# 06: „Most”: mi blokkolt és mire vár

**What to build:** a „Most” rész negyedik csoportja, a *Blokkolt*: minden blokkolt nyitott ticket, mellette a blokkolói (szám és cím), amelyekre még vár. Ha a ticket emberre vár, „utána emberre vár” jelzést kap. Egy nem létező ticketre mutató blokkoló nem számít lezártnak, és figyelmeztetést kap.

**Blocked by:** 05

**Status:** done

- [x] A példaprojekten a Blokkolt csoportban a 02, 03, 04 (a 01-re várnak) és a 05 (a 02–04-re vár) látszik
- [x] A 05 mellett „utána emberre vár” jelzés látszik
- [x] Egy nem létező blokkolóra figyelmeztetés látszik (tesztmappa)
- [x] `npm run check` zöld

## Comments

**2026-10-20, /implement:** kész. A `varRa` elemei most blokkolók (`src/server/pillanatkep.ts`, új `Blokkolo` típus): `{ szam, cim }`, ahol a szám úgy áll, ahogy a `**Blocked by:**` sorban, a cím az ugyanazon a területen lévő, ilyen számú ticketé (azonos számú ticketek közül az elsőé); nem létező (vagy nem szám) blokkolónál a `cim` hiányzik, ez a figyelmeztetés jele. A pillanatkép `most` része új `blokkolt` listát kap: az agentre vagy emberre váró ticketek, amelyeknek a `varRa` listája nem üres, minden területről, területenként szám szerint. Döntés: ami folyamatban van (`claimed`), az csak a Folyamatban csoportban látszik, akkor is, ha blokkolt; a Blokkolt csoportban nem (teszt: a `folyamatban` tesztmappa 01-es ticketje most a nyitott 02-re vár). Az ismeretlen állapotú ticket nem nyitott, így a Blokkolt csoportban sem jelenik meg, ahogy az 05 óta a blokkoltság sem számít nála. Oldal: `src/web/App.svelte`: a „Most” rész negyedik csoportja a Blokkolt; minden ticket címe alatt soronként a blokkolói („vár 01 Végigfutó váz…”), nem létező blokkolónál borostyán színnel „vár 09 nincs ilyen ticket ezen a területen”, emberre váró ticketnél utolsó sorként „utána emberre vár”. A blokkolók csak a Blokkolt csoportban látszanak, a területek listáin és a Folyamatban nem. Komponenskészlet: az `Item` új `details` snippetet kap a cím alá; új `Detail` (kis, halk sor `label` és `number` előtaggal, `warning` változattal a meglévő `warning` tokenből). A felületet kézzel ellenőriztem a példaprojekten és a `lezart-blokkolo` tesztmappán, világos és sötét módban, telefonméretben is.
