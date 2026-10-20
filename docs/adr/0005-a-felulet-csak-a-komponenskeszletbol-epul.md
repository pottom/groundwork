# A felület csak a saját komponenskészletből épül

**Status:** accepted

A felület egy saját, újrahasznosítható komponenskészletből épül (shadcn-svelte alapon, a repóban, a mi tulajdonunkban), és minden vizuális döntés ott és a közös design tokenekben él. Az oldalak és a nézetek csak összerakják a komponenseket: nincs bennük `class`, `style` vagy `<style>`, az elrendezés is komponens (például Stack, Grid). Így egy komponens megváltoztatása mindenhol egyszerre hat, és nem fordulhat elő, hogy két képernyő ugyanazt az elemet másképp mutatja. A szabályt egy teszt őrzi, amely elbukik, ha a komponenskészleten kívül bárhol ilyen stílus jelenik meg. Az ára: ha egy oldalnak új megjelenés kell, előbb a komponenskészletet kell bővíteni, és ez lassabb, mint helyben odaírni egy osztályt.
