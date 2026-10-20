# A végtermék egy pici, önálló mappa

**Status:** accepted

A build egy kis mappát készít: a Svelte-felület statikus fájlokká fordul, a szerver pedig minden függőségével együtt egyetlen JS-fájllá csomagolódik (esbuild). Futtatáskor nem kell `npm install`, csak Node. Ugyanez a mappa indítható `npx`-szel, bemásolható egy repóba és `node`-dal futtatható, vagy betehető egy konténerbe, amelybe a projekt mappája csak olvashatóan kerül. Hogy ezek közül melyik lesz az elsődleges, később döntjük el: mindegyik erre a végtermékre épül. Az ára egy build-lépés, és az, hogy a csomagolt szerver mérete a függőségekkel nő, ezért új függőséget csak indokkal veszünk fel.
