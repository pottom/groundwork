# Setup skill: egy agent készíti elő a projektet a Groundworkhöz

**Status:** ready-for-agent

## Probléma

A Groundwork ma bármelyik projektre ráindítható, de semmi nem készíti elő hozzá a projektet. Két dolog hiányzik. Egyrészt a helyi tracker sablonja nem mondja meg, mi zár le egy ticketet, ezért az `/implement` után a ticketek nyitva maradnak, és a Groundwork Állapot nézete hamis képet mutat. Másrészt nincs rögzítve, melyik Groundwork-verzióval és hogyan indul a projekt, így egy csapattárs nem tudja, mit futtasson. Futó projektben ráadásul már ott lehetnek elkészült, de le nem zárt ticketek. A régi Groundwork erre egy kb. 15 KB-os `init` programot írt, amely a projekt sok pontjára írt, és nem lehetett tisztán kivenni.

## Megoldás

Egy skill, a `setup-groundwork`, amelyet a felhasználó Matt Pocock skilljeivel azonos módon telepít (`npx skills add`), és az agentjében futtat. A skill körülnéz, megmutatja, mit talált és mit tenne, és csak jóváhagyás után ír. Egy belépési pontja van:

- **előkészítetlen projektben előkészít**: megírja a `.groundwork/` mappát (a rögzített verzióval és az indítási móddal), és ha kell, beírja a lezárási szabályt egy jelölt blokkba;
- futó projektben ezután felkínálja a **felzárkóztatást**: a nyitott ticketeket a kóddal és a git-történettel összevetve javasolja a lezárást, és csak az elfogadottakat zárja le;
- **előkészített projektben ellenőriz**, és felkínálja a verziófrissítést, az indítási mód váltását, az offline image parancsát, a felzárkóztatást és a **kivételt**.

A kivétel a `.groundwork/` mappát és a jelölt blokkokat veszi ki, mást nem. A Groundwork programja továbbra sem ír a projektbe (ADR 0001). Ha egy projekt nincs előkészítve, ezt a felületen és a terminálban jelzi, és megmondja a két lépést.

## Felhasználói történetek

1. Fejlesztőként egy paranccsal szeretném telepíteni a setup skillt, ugyanúgy, ahogy Matt skilljeit, hogy ne kelljen második telepítési módot megtanulnom.
2. Fejlesztőként azt szeretném, hogy ha a Groundworköt egy nem előkészített projektre indítom, az oldal ettől még mindent megmutasson, amit lát, hogy egy első kíváncsi futás ne akadjon el.
3. Fejlesztőként azt szeretném, hogy egy nem előkészített projektben a Groundwork felülete és a terminál is jól látható, de nem tolakodó módon jelezze, hogy a projekt nincs előkészítve, hogy ne menjek el a setup mellett.
4. Fejlesztőként a jelzés mellé a két pontos, kimásolható lépést szeretném látni (a skill telepítése, majd a `/setup-groundwork`), hogy ne kelljen keresgélnem.
5. Fejlesztőként azt szeretném, hogy a jelzés eltűnjön, amint a projekt előkészített lett, hogy ne zavarjon tovább.
6. Fejlesztőként azt szeretném, hogy a skill előbb körülnézzen, és megmutassa, mit talált és mit tenne, mielőtt bármit ír, hogy semmi ne lepjen meg.
7. Fejlesztőként azt szeretném, hogy a skill csak az én jóváhagyásom után írjon, hogy én döntsek a projektemről.
8. Fejlesztőként azt szeretném, hogy ha a Matt-féle setup még nincs lefuttatva, a skill semmit ne írjon, hanem megmondja, hogy előbb a `/setup-matt-pocock-skills`-t futtassam, mert azt az agent nem indíthatja el helyettem.
9. Fejlesztőként azt szeretném, hogy előkészítéskor a skill a Groundwork aktuális, pontos verzióját rögzítse, ne a `latest`-et, hogy a projekt mindig ugyanazzal a verzióval induljon.
10. Fejlesztőként azt szeretném, hogy a skill megkérdezze az indítási módot (`npx` vagy konténer), és az `npx`-et javasolja, hogy a legegyszerűbb út legyen az alapértelmezett.
11. Fejlesztőként azt szeretném, hogy a rögzített verzió és az indítási mód egy géppel is olvasható, egyértelmű fájlban legyen, hogy a skill később pontosan tudja frissíteni.
12. Csapattársként azt szeretném, hogy a `.groundwork/` mappában egy rövid leírás megmondja, mi ez a mappa, melyik pontos parancs indítja a Groundworköt, és hogyan vehető ki, hogy kérdezés nélkül el tudjam indítani.
13. Csapattársként azt szeretném, hogy a `.groundwork/` mappa a gitben legyen, hogy mindenki ugyanazt a verziót és parancsot lássa.
14. Fejlesztőként azt szeretném, hogy a skill a lezárási szabályt jelölt blokkban írja be a tracker leírásába, hogy az `/implement` és a többi skill tudja, mi zár le egy ticketet.
15. Fejlesztőként azt szeretném, hogy a jelölt blokk a megjelenített Markdownban ne látsszon jelölőként, de az agent és a kivétel pontosan megtalálja.
16. Fejlesztőként azt szeretném, hogy ha a lezárási szabályt már magam beírtam, a skill ne nyúljon hozzá, hanem jelezze, és ha a szövege eltér a Groundworkétől, mutassa meg a különbséget, hogy az enyém maradjon.
17. Fejlesztőként azt szeretném, hogy GitHubon, GitLabon vagy más külső trackeren követett projektet is előkészíthessek, mert a szószedet, az ADR-ek és a README attól még helyben vannak.
18. Fejlesztőként azt szeretném, hogy nem helyi trackernél a skill figyelmeztessen, hogy a Groundwork ma csak a helyi trackert olvassa, és ne írjon jelölt blokkot, mert annak szövege a helyi trackerre szól.
19. Fejlesztőként azt szeretném, hogy futó projektben a skill felkínálja a felzárkóztatást, hogy a már elkészült, de le nem zárt ticketek ne torzítsák az Állapot nézetet.
20. Fejlesztőként azt szeretném, hogy a felzárkóztatás egy táblázatban mutassa meg minden nyitott ticket bizonyítékát (commitok, fájlok, teljesült feltételek) és a javaslatot, hogy gyorsan dönthessek.
21. Fejlesztőként azt szeretném, hogy a felzárkóztatás csak azokat a ticketeket zárja le, amelyeket elfogadtam, hogy a lezárás mögött mindig emberi átnézés álljon.
22. Fejlesztőként azt szeretném, hogy a felzárkóztatás a lezárási szabály szerint zárjon (kipipált feltételek, `Status: done`, dátumozott megjegyzés arról, hogy a felzárkóztatáskor fogadtam el), hogy a lezárt ticket ugyanúgy nézzen ki, mint bármelyik másik.
23. Fejlesztőként azt szeretném, hogy nulláról induló projektben, ahol nincs nyitott ticket, a felzárkóztatás szóba se kerüljön, hogy ne kelljen fölösleges kérdésre válaszolnom.
24. Fejlesztőként azt szeretném, hogy ha a skillt egy már előkészített projektben futtatom, először ellenőrizze, hogy a beállítás és a jelölt blokk rendben és naprakészen van-e, hogy egy elrontott állapot kiderüljön.
25. Fejlesztőként azt szeretném, hogy egy előkészített projektben a skill felkínálja, mit tehet (verziófrissítés, módváltás, offline image parancsa, felzárkóztatás, kivétel), hogy ne kelljen tudnom a pontos kérést.
26. Fejlesztőként azt szeretném, hogy ha a hívásban megmondom a célt (például a kivételt), a skill egyből arra menjen, hogy ne kelljen menün átmennem.
27. Fejlesztőként azt szeretném, hogy verziófrissítéskor a skill megmutassa a régi és az új verziót, és csak jóváhagyás után írja át, hogy tudatosan lépjek.
28. Fejlesztőként azt szeretném, hogy a `latest` is választható legyen, de csak ha kifejezetten kérem.
29. Fejlesztőként konténeres módban a pontos `docker run` parancsot szeretném kapni (pontos verziójú Node-image, csak olvasható projekt, csak a gépen elérhető port), hogy ne kelljen összeraknom.
30. Fejlesztőként internet nélküli használathoz egy kész, egyszer futtatandó parancsot szeretnék a saját offline image helyi megépítéséhez, hogy utána internet nélkül is induljon.
31. Fejlesztőként azt szeretném, hogy a kivétel csak a `.groundwork/` mappát és a jelölt blokkokat vegye ki, mást nem, hogy a projektem ép maradjon.
32. Fejlesztőként azt szeretném, hogy a kivétel után a felzárkóztatáskor lezárt ticketek lezárva maradjanak, mert azok a munkám valódi állapotai, nem a Groundwork nyomai.
33. Fejlesztőként azt szeretném, hogy a kivétel a kézzel beírt lezárási szabályomat se vegye ki, mert azt nem a Groundwork tette be.
34. Fejlesztőként azt szeretném, hogy a skill ne commitoljon, hanem szóljon, hogy `git diff`-fel nézzem át és commitoljam, hogy minden írás átnézhető maradjon.
35. Fejlesztőként azt szeretném, hogy a skill a beszélgetés nyelvén beszéljen velem, akkor is, ha az általa írt fájlok angolok.
36. Fejlesztőként azt szeretném, hogy két futás ugyanazt írja ugyanabba a helyzetbe, hogy az eredmény kiszámítható legyen.

## Megvalósítási döntések

- **A skill helye:** a Groundwork repójában, Matt setup skilljének mintájára egy saját skill-mappában: egy `SKILL.md` és mellette a rögzített sablonfájlok (a `.groundwork/README.md` sablonja és a jelölt blokk szövege). `npx skills add`-del települ a Groundwork repójából, amíg nincs távoli repó, helyi útvonalról. Az npm-csomag nem hordozza (ADR 0009).
- **A skill nyelve:** a `SKILL.md` és a sablonok angolul készülnek (ADR 0006: ami az agentnek szól, az kód). A felhasználóval a beszélgetés nyelvén beszél. A `SKILL.md`-t a `writing-for-agents` skill szerint írjuk.
- **Menet:** körülnéz → megmutatja, mit talált és mit tenne → jóváhagyás → ír → elmondja, mit írt, és kéri a `git diff`-es átnézést. Nem commitol.
- **Mit néz meg a körülnézésben:** van-e `docs/agents/` (a Matt-setup), mi a tracker a `docs/agents/issue-tracker.md` szerint (helyi vagy más), van-e már „Closing a ticket” szabály (jelölt blokkban vagy anélkül), van-e `.groundwork/` és mi van benne, vannak-e nyitott ticketek a `.scratch/` alatt.
- **Előkészített projekt:** az a projekt, amelyben van `.groundwork/` mappa. A mappa két fájlja:
  - `config.json`, az igazság forrása:
    ```json
    { "version": "0.2.0", "launch": "npx" }
    ```
    A `launch` értéke `npx` vagy `container`. Konténernél még: `"image": "node:22.18-alpine"` (pontos címke).
  - `README.md`: angol, rögzített sablonból, a `config.json`-ból generálva. Leírja, mi ez a mappa, melyik pontos parancs indítja a Groundworköt, és hogyan vehető ki (a `/setup-groundwork` futtatásával). A skill minden írásnál újragenerálja, kézzel nem szerkesztjük.
  - Mindkettő a gitbe kerül, nem gitignore-oljuk.
- **Csomagnév:** a `groundwork` név az npm-en foglalt. A csomagnév a skill sablonjaiban egyetlen helyen áll, így az npm-kiadáskor csak ott kell átírni. Amíg a csomag nincs fent, a skill a végleges `npx <csomag>@<verzió>` parancsot írja, és ezt az npm-kiadás után egyszer kipróbáljuk.
- **Rögzített verzió:** előkészítéskor a csomag aktuális npm-verziója, pontosan (`npm view <csomag> version`). A `latest` csak kifejezett kérésre. Frissítéskor a régi és az új verzió látszik, és csak jóváhagyás után írja át.
- **Jelölt blokk:** HTML-megjegyzés-jelölők között, névvel:
  ```markdown
  <!-- groundwork:begin closing-a-ticket -->
  ## Closing a ticket

  A ticket is closed when its `Status:` line is `done`. …
  <!-- groundwork:end closing-a-ticket -->
  ```
  A szöveg megegyezik a Groundwork repójában és a példaprojektben ma kézzel szereplő angol szabállyal. A `docs/agents/issue-tracker.md`-ben a „Conventions” szakasz után áll. Ma ez az egyetlen jelölt blokk. A `CLAUDE.md`-be és az `AGENTS.md`-be nem írunk semmit (ADR 0007).
- **Kézzel beírt szabály:** ha a „Closing a ticket” szabály jelölés nélkül már megvan, a skill nem nyúl hozzá, nem keretezi be, hanem jelzi. Ha a szövege eltér, megmutatja a különbséget. Jelölt blokk ilyenkor nem lesz, és a kivétel sem nyúl hozzá.
- **Hiányzó Matt-setup:** ha nincs `docs/agents/`, a skill semmit nem ír, és a `/setup-matt-pocock-skills` futtatását kéri. Azt az agent nem indíthatja el maga (`disable-model-invocation`).
- **Nem helyi tracker** (GitHub, GitLab, más): figyelmeztet, hogy a Groundwork ma csak a helyi trackert olvassa, előkészít, de jelölt blokkot nem ír, és felzárkóztatást sem kínál.
- **Felzárkóztatás:** csak helyi trackernél, és csak ha van nyitott ticket. Opcionális utolsó lépés előkészítéskor, és később is kérhető. Egy táblázatban mutatja a nyitott ticketeket: ticket, bizonyíték, javaslat. Csak az elfogadottakat zárja le, a lezárási szabály szerint: kipipálja a teljesült feltételeket, `Status: done`, és dátumozott megjegyzést tesz a `## Comments` alá arról, hogy a felzárkóztatáskor fogadták el. A nulláról induló és a futó projekt így nem két külön út, csak annyi a különbség, hogy van-e nyitott ticket.
- **Újrafuttatás előkészített projektben:** először ellenőriz (érvényes-e a `config.json`, egyezik-e a `README.md` a sablonnal, megvan-e és naprakész-e a jelölt blokk), jelzi az eltéréseket, és felajánlja a javítást. Utána felkínálja: verziófrissítés, indítási mód váltása, offline image parancsa (konténeres módnál), felzárkóztatás, kivétel. Ha a hívás megnevezi a célt, egyből arra megy.
- **Konténeres mód:** a `config.json`-ban `launch: container` és `image`. A `README.md` a teljes `docker run` parancsot tartalmazza: pontos verziójú hivatalos Node-image, npx a rögzített verzióval, a projekt csak olvashatóan csatolva, `-p 127.0.0.1:…`, `--host 0.0.0.0`, böngészőnyitás nélkül (ADR 0008). Kérésre a skill kiadja az offline image egyszeri, helyi megépítésének kész parancsát. Ez a konténeres futástól függ (`.scratch/kontener/`, 01: a `--host` kapcsoló ma még nincs meg).
- **Kivétel:** kiveszi a `.groundwork/` mappát, és minden `groundwork:begin` / `groundwork:end` jelölt blokkot a jelölőkkel együtt, semmi mást. A lezárt ticketek lezárva maradnak, a kézzel beírt szabály marad.
- **A Groundwork programja: a „nincs előkészítve” jelzés.** A pillanatkép kap egy mezőt arról, hogy a projekt előkészített-e (van-e `.groundwork/` mappa). Ha nem, a felület tetején egy jól látható, nem tolakodó jelzés áll a két kimásolható lépéssel, és indításkor a terminál is kiírja. Az élő frissítés miatt a jelzés eltűnik, amint a mappa megjelenik: a figyelő a `.groundwork/` mappát is figyeli. A felület csak a komponenskészletből épül (ADR 0005). A program továbbra sem ír a projektbe (ADR 0001).
- **A példaprojekt új taget kap:** `4a-megepitve-lezaratlan` a `39b1f2d` commiton (a 01 megépült, de nincs lezárva, és a szabály sincs benne). A példaprojekt README táblázata is kap egy sort.

## Tesztelési döntések

- A jó teszt a külső viselkedést nézi: amit a felhasználó lát és amit a projektben talál, nem azt, hogyan jutott oda a skill.
- **Első varrat, a skill viselkedése: a példaprojekt állapota előtte és utána.** A skill nem egységtesztelhető (ADR 0009). Egy ismert tagről indulva lefuttatjuk a `/setup-groundwork`-öt a `groundwork-pelda`-ban, és a `git diff`-et, valamint azt, amit kérdezett és mondott, összevetjük az elvárással. Utána visszaállítjuk a tagre. Kézi próba, a ticketek elfogadási feltételei között. Forgatókönyvek:

  | Helyzet | Kiindulás | Elvárás |
  |---|---|---|
  | Nulláról | `0-indulas` | `.groundwork/` (config, README) és a jelölt blokk; felzárkóztatás nincs |
  | Futó projekt, felzárkóztatással | `4a-megepitve-lezaratlan` | előkészít, a 01-et lezárásra javasolja, a 02–05-öt nem; elfogadás után a 01 a szabály szerint lezárva |
  | Kézzel beírt szabály | `4-epul` | a szabályhoz nem nyúl, jelzi; jelölt blokk nincs; a 01 már lezárt |
  | Nincs Matt-setup | egy üres, friss git-mappa | semmit nem ír, a `/setup-matt-pocock-skills`-t kéri |
  | Újrafuttatás | bármelyik előkészített állapot | ellenőriz, és felkínálja a lehetőségeket; két futás ugyanazt írja |
  | Kivétel | mindegyik előkészítés után | a kiinduló taghez képest csak a felzárkóztatás lezárásai maradnak |

  Automatizált (`claude -p`-s) futtatást nem csinálunk: drága, lassú és nem determinisztikus.
- **Második varrat, a „nincs előkészítve” jelzés: a meglévő olvasó modul.** A pillanatkép új mezője a `sample-3-tickets` tesztadaton hamis, egy ideiglenes másolaton, amelyben van `.groundwork/`, igaz. Előzmény: a meglévő pillanatkép-tesztek. A figyelő tesztje (előzmény: a meglévő figyelőteszt) azt nézi, hogy a `.groundwork/` megjelenése jelzést ad. A felületi jelzést kézzel nézzük meg. Az ADR 0001 és 0005 őrző tesztjei zöldek maradnak.

## Hatókörön kívül

- A csomag npm-re tétele és a csomagnév kiválasztása (a `groundwork` foglalt).
- A Groundwork repójának távoli (GitHub) közzététele, amelyből a `npx skills add` telepít.
- A konténeres futás maga (`--host`, a figyelő lekérdezéses módja): a `.scratch/kontener/` igénye.
- A GitHub, GitLab vagy más külső tracker olvasása a Groundworkben.
- A lezárási szabály változata nem helyi trackerre.
- A Matt-setup elindítása vagy megváltoztatása (ADR 0001, Matt skilljeihez nem nyúlunk).
- A setup automatizált, agentet futtató tesztje.

## További megjegyzések

- A régi Groundwork `init`-je (`groundwork-legacy/core/init.mjs`) csak tanulság, kódot nem veszünk át belőle.
- Eredet: 2026-10-20-án felmerült igény (korábban `issues/01-groundwork-setup-skill.md`, `needs-triage`), miután kiderült, hogy az `/implement` nem zárja le a ticketet, és a helyi tracker sablonja nem mondja meg, mi zárja le. Ezt az igényt a spec és a hét ticket váltja fel; a fájl kikerült, a git-történetben megvan.
- A 07-es ticket a `kontener/01`-re vár. A Groundwork a blokkolót csak a saját területén keresi, ezért a 07 akkor is blokkoltnak látszik, amikor a konténer-ticket már lezárult. Ilyenkor a sort kézzel kell átírni.
