# Állapot: hol tart a munka, egy oldalon

**Status:** ready-for-agent

## Probléma

Aki Matt Pocock skilljeivel dolgozik helyi trackerrel, annak a specjei és ticketjei sok kis Markdown-fájlban élnek a `.scratch/` alatt. Hogy mi indítható most, mi vár rá, és mi blokkolt, azt csak a fájlok egyenkénti megnyitásával tudja meg. Elveszíti a fonalat, és nem érzi, hogy képben van.

## Megoldás

A Groundwork első szelete: egy helyi oldal, amely egy projekt mappáját csak olvasva megmutatja, hol tart a munka. Felül a „Most” rész mondja meg, mi indítható, mi vár emberre, mi van folyamatban és mi blokkolt; alatta területenként látszanak a ticketek állapottal. A projekt fájljaiba nem ír, és csak azt mutatja, amit a skillek a repóban hagytak (ADR 0001).

## Felhasználói történetek

1. Fejlesztőként egy paranccsal szeretném elindítani a Groundworköt egy projekt mappájára, hogy azonnal lássam az állapotát.
2. Fejlesztőként a projekt nevét szeretném látni az oldal tetején, hogy tudjam, melyik projektet nézem.
3. Fejlesztőként a „Most” részben szeretném látni az indítható ticketeket, hogy tudjam, mit adhatok oda most az agentnek.
4. Fejlesztőként a „Most” részben szeretném látni, mi vár rám, emberre, hogy tudjam, mivel kell foglalkoznom.
5. Fejlesztőként a „Most” részben szeretném látni, mi van folyamatban, hogy ne indítsam el kétszer ugyanazt.
6. Fejlesztőként a „Most” részben szeretném látni a blokkolt ticketeket, és azt is, mire várnak, hogy értsem, mi tartja fel őket.
7. Fejlesztőként egy blokkolt, de emberre váró ticketnél „utána emberre vár” jelzést szeretnék látni, hogy előre tudjam, mi jön majd hozzám.
8. Fejlesztőként nem szeretnék az „Emberre vár” között olyat látni, amihez még hozzá sem lehet nyúlni, hogy ez a lista mindig a most elvégezhető dolgaimat mutassa.
9. Fejlesztőként területenként (funkciónként) szeretném látni a ticketeket, hogy egy területen belül is lássam a haladást.
10. Fejlesztőként egy terület címét a specje első címsorából szeretném látni, nem a mappa nevéből, hogy olvasható legyen.
11. Fejlesztőként minden ticketnél a számot, a címet és az állapotot szeretném látni, hogy egy pillantással azonosítsam.
12. Fejlesztőként minden ticketnél a pipák arányát szeretném látni (például 2/7), hogy lássam, mennyi van kész belőle.
13. Fejlesztőként a lezárt ticketeket a többitől megkülönböztetve szeretném látni, hogy a nyitott munka kiemelkedjen.
14. Fejlesztőként egy olyan blokkolóra, amely nem létező ticketre hivatkozik, jelzést szeretnék, hogy észrevegyem a hibát.
15. Fejlesztőként egy ismeretlen állapotú ticketet is szeretnék látni a területén, a nyers állapotával, hogy semmi ne tűnjön el csendben.
16. Fejlesztőként üres vagy `.scratch/` nélküli projektnél egy barátságos üzenetet szeretnék látni, hogy tudjam, nincs még mit mutatni.
17. Fejlesztőként biztos szeretnék lenni benne, hogy a Groundwork semmit nem ír a projektembe, hogy nyugodtan rá tudjam engedni bármelyik repóra.
18. Fejlesztőként szép, egységes, nyugodt felületet szeretnék, világos és sötét módban is, hogy szívesen ránézzek.
19. Fejlesztőként azt szeretném, hogy egy felületi elem megváltoztatása mindenhol egyszerre hasson, hogy a felület egységes maradjon (ADR 0005).

## Megvalósítási döntések

- **Olvasó modul:** egyetlen művelet, amely egy projekt mappájából egy **pillanatképet** készít: a projekt neve, a területek, és területenként a ticketek. Csak olvas.
- **Projekt neve:** a gyökér `README.md` első `#` címsora; ha nincs, a mappa neve.
- **Terület:** minden `.scratch/<slug>/` mappa, amelyben `spec.md` vagy `issues/` van. A címe a `spec.md` első `#` címsora; ha nincs, a slug.
- **Ticket:** minden `.scratch/<slug>/issues/<NN>-<név>.md`. A száma a fájlnév elejéről, a címe az első címsorból (`# NN: Cím` alakból a cím rész), a blokkolói a `**Blocked by:**` sorból (számok vesszővel; a `None…` kezdetű érték üres lista), az állapota a `**Status:**` sorból, a pipák a `- [ ]` és `- [x]` sorokból.
- **Állapotcsoportok:** `ready-for-agent` → agentre vár; `ready-for-human`, `needs-info`, `needs-triage` → emberre vár; `claimed` → folyamatban; `done`, `closed`, `resolved`, `wontfix` → lezárt. Minden más ismeretlen állapot, amelyet nyersen mutatunk.
- **Blokkoltság:** egy nyitott ticket blokkolt, ha van olyan blokkolója (ugyanazon a területen, szám szerint), amely nem lezárt. A nem létező ticketre mutató blokkoló nem számít lezártnak, és jelzést kap.
- **„Most” rész:** *Indítható* = agentre vár és nem blokkolt; *Emberre vár* = emberre vár és nem blokkolt; *Folyamatban* = claimed; *Blokkolt* = minden blokkolt nyitott ticket, a blokkolóival, és ha emberre vár, „utána emberre vár” jelzéssel.
- **Szerver:** Hono, egyetlen végpont, amely a pillanatképet adja; a projekt mappáját induláskor kapja meg (`--root`).
- **Oldal:** Svelte, amely betölti és megjeleníti a pillanatképet. Csak a komponenskészletből épül (shadcn-svelte, a repóban); az oldalakon nincs `class`, `style` vagy `<style>` (ADR 0005). Világos és sötét mód a közös tokenekből.
- A szelet fejlesztési módban fut; a végtermék csomagolása (ADR 0003) későbbi szelet.

## Tesztelési döntések

- Egy varrat: az olvasó modul. A tesztek egy mappát adnak neki, és csak a pillanatképet nézik.
- A fő teszt a `groundwork-pelda` `3-ticketek` tagjéről exportált másolaton fut, amely a tesztadatok között él, így független a gépen lévő példarepó állapotától. Elvárás: a projekt neve, egy terület („Aktuális időjárás egy Településen”), öt ticket; indítható a 01; blokkolt a 02, 03, 04 (a 01-re várnak) és a 05 (a 02–04-re vár, „utána emberre vár”); az „Emberre vár” üres.
- Kis, célzott tesztmappák a szélsőséges esetekre: nem létező blokkoló, ismeretlen állapot, cím nélküli spec, `.scratch/` nélküli projekt, lezárt blokkoló.
- Egy teszt őrzi az ADR 0005-öt: elbukik, ha a komponenskészleten kívül bármelyik Svelte-fájlban `class`, `style` vagy `<style>` van.
- Egy teszt őrzi, hogy az olvasás után a projekt mappája változatlan.
- A felületet kézzel ellenőrizzük a példaprojekten, világos és sötét módban.

## Hatókörön kívül

- Élő frissítés fájlváltozásra.
- A spec, az ADR-ek és a szótár megnyitása, olvasása.
- Bemutató nézet, rajzok, git-adatok, ötletek.
- Csomagolás és `npx`-indítás.
- GitHub vagy más tracker olvasása.
- Bármilyen írás a projektbe.

## További megjegyzések

Hogy az `/implement` és a többi skill pontosan milyen állapotokat és megjegyzéseket ír a ticketekbe munka közben, azt a példaprojekt `4-epul` szakaszánál nézzük meg; addig a fenti állapotcsoportok a Matt-féle címkékből és a `development-status` gyakorlatából jönnek.
