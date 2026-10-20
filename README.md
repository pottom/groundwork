# Groundwork

Prezentációs réteg az AI-jal végzett munkához: megmutatja, amit Matt Pocock skilljei és a git a repóban hagynak, hogy lásd, hol tartasz, mi van hátra, és meg tudd mutatni másnak is.

> Állapot: újrakezdés, az első szelet épül (`.scratch/allapot/`).

A döntések a [`docs/adr/`](docs/adr/) mappában vannak.

## Indítás

Node 22.18 vagy újabb kell: a szerver TypeScript-fájljait a Node közvetlenül futtatja, fordítás nélkül.

```bash
npm install
npm run dev -- --root ../groundwork-pelda
```

Aztán: <http://localhost:5173>. A `--root` a megmutatandó projekt mappája; a Groundwork ebbe soha nem ír (ADR 0001).

Fejlesztéskor egy folyamat fut egy porton: a `src/server/dev.ts` elindítja a Vite-ot, amely az oldalt szolgálja ki, a `/api/` kéréseket pedig egy Vite-middleware továbbadja a Hono-appnak. Így nincs proxy és nincs második szerver. Ha a `src/server/` alatt bármi megváltozik, a Node (`--watch-path`) újraindítja a folyamatot, így az oldal mindig a friss szerverkódot látja; a felület változásait a Vite magától frissíti.

## Ellenőrzés

```bash
npm run check
```

Típusellenőrzés (`svelte-check`) és a tesztek (Vitest).

## Felépítés

- `src/server/snapshot.ts`: az olvasó modul, egy projekt mappájából pillanatképet készít, csak olvasva.
- `src/server/watcher.ts`: a figyelő modul (chokidar), jelez, ha a projekt `.scratch/` mappájában vagy a gyökér `README.md`-ben valami változik; a gyors sorozatokat összevonja.
- `src/server/app.ts`: a Hono-app, két végpont: `GET /api/snapshot` és `GET /api/changes` (Server-Sent Events, `changed` jelzés). Az oldal a jelzésre újra lekéri a pillanatképet.
- `src/web/`: a Svelte-oldal. A `src/web/lib/components/ui/` a komponenskészlet (shadcn-svelte alapon); csak itt lehet `class`, `style` vagy `<style>` (ADR 0005). A közös tokenek a `src/web/app.css`-ben vannak.
- `test/fixtures/`: tesztadatok, köztük a `groundwork-pelda` `3-ticketek` tagjének másolata (`sample-3-tickets`).
