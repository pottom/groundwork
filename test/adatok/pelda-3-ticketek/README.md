# Időjárás app: a Groundwork példaprojektje

Ezen a projekten próbáljuk ki a Groundworköt. Egy időjárás webapp a (kitalált) Napsugár Túraklubnak, amelyet Matt Pocock skilljeivel, a fejlesztési loopon végigmenve építünk meg. Az ügyfél kérései az `ugyfel/` mappában vannak.

## Szakaszok

Minden szakasz egy git tag, amelyet a skillek valódi lefuttatásával állítunk elő. Visszaállítani így lehet: `git checkout <tag>`.

| Tag | Mi történt |
|---|---|
| `0-indulas` | megjött az első levél; az app egy váz, a skillek beállítva (helyi tracker) |
| `1-grillezve` | `/grill-with-docs` az első levélen: `GLOSSARY.md` és az első ADR |
| `2-spec` | `/to-spec`: `.scratch/aktualis-idojaras/spec.md`, `ready-for-agent` |
| `3-ticketek` | `/to-tickets`: 5 ticket; a 01 indítható, a 02–04 rá vár, a 05 emberre vár |

## Indítás

Node.js 22.12 vagy újabb kell.

```bash
npm install
npm run dev      # az app a böngészőben
npm run check    # típusellenőrzés + tesztek
```

Az időjárásadatok az [Open-Meteo](https://open-meteo.com/) ingyenes szolgáltatásából jönnek.
