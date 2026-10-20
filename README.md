# Groundwork

Prezentációs réteg az AI-jal végzett munkához: megmutatja, amit Matt Pocock skilljei és a git a repóban hagynak, hogy lásd, hol tartasz, mi van hátra, és meg tudd mutatni másnak is.

> Állapot: újrakezdés, az első szelet épül (`.scratch/allapot/`).

A döntések a [`docs/adr/`](docs/adr/) mappában vannak.

## Indítás

```bash
npm install
npm run dev -- --root ../groundwork-pelda
```

Aztán: <http://localhost:5173>. A `--root` a megmutatandó projekt mappája; a Groundwork ebbe soha nem ír (ADR 0001).

Fejlesztéskor egy folyamat fut egy porton: a `src/server/dev.ts` elindítja a Vite-ot, amely az oldalt szolgálja ki, a `/api/` kéréseket pedig egy Vite-middleware továbbadja a Hono-appnak. Így nincs proxy és nincs második szerver.

## Ellenőrzés

```bash
npm run check
```

Típusellenőrzés (`svelte-check`) és a tesztek (Vitest).

## Felépítés

- `src/server/pillanatkep.ts`: az olvasó modul, egy projekt mappájából pillanatképet készít, csak olvasva.
- `src/server/app.ts`: a Hono-app, egyetlen végpont: `GET /api/pillanatkep`.
- `src/web/`: a Svelte-oldal. A `src/web/lib/components/ui/` a komponenskészlet (shadcn-svelte alapon); csak itt lehet `class`, `style` vagy `<style>` (ADR 0005). A közös tokenek a `src/web/app.css`-ben vannak.
- `test/adatok/`: tesztadatok, köztük a `groundwork-pelda` `3-ticketek` tagjének másolata.
