# A kód angolul készül, a szöveg magyarul

**Status:** accepted

A forráskód angolul készül: a fájl- és mappanevek (a tesztadatok mappáit is beleértve), az azonosítók (típusok, függvények, változók, komponensek, API-végpontok) és a kódban álló megjegyzések. Magyarul marad, ami embernek szól: a felület szövegei, a dokumentáció (README, ADR-ek, specek, ticketek) és a commit-üzenetek. A skillek által írt fájlok (`.scratch/` alatt) nevét és formáját nem mi szabjuk meg (ADR 0001). Az angol kód könnyebben olvasható másnak, jobban illik a könyvtárak és a keretrendszerek nyelvéhez, és nem keveredik benne a két nyelv. Az ára: az első szeletek magyar nevű kódját (például `pillanatkep.ts`, `olvasPillanatkep`, `test/adatok/`) egyszer át kell nevezni.
