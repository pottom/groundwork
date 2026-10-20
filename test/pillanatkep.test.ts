import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { olvasPillanatkep } from "../src/server/pillanatkep.ts";

const adatMappa = (nev: string) => fileURLToPath(new URL(`./adatok/${nev}`, import.meta.url));

describe("pillanatkép", () => {
  test("a projekt neve a README első címsora", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(pillanatkep.projektNev).toBe("Időjárás app: a Groundwork példaprojektje");
  });

  test("ha a README-ben nincs első szintű címsor, a projekt neve a mappa neve", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("cimsor-nelkuli-readme"));
    expect(pillanatkep.projektNev).toBe("cimsor-nelkuli-readme");
  });

  test("a kódblokkban álló # sor nem címsor", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("kodblokkal-kezdodo-readme"));
    expect(pillanatkep.projektNev).toBe("Kódblokk utáni cím");
  });

  test("ha nincs README, a projekt neve a mappa neve", async () => {
    const mappa = join(await mkdtemp(join(tmpdir(), "groundwork-")), "readme-nelkuli-projekt");
    await mkdir(mappa);
    const pillanatkep = await olvasPillanatkep(mappa);
    expect(pillanatkep.projektNev).toBe("readme-nelkuli-projekt");
  });

  test("a terület címe a spec első címsora", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(pillanatkep.teruletek).toEqual([
      { slug: "aktualis-idojaras", cim: "Aktuális időjárás egy Településen" },
    ]);
  });

  test("ha a specben nincs első szintű címsor, a terület címe a slug", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("cim-nelkuli-spec"));
    expect(pillanatkep.teruletek).toEqual([{ slug: "uj-otlet", cim: "uj-otlet" }]);
  });

  test("spec nélkül, csak ticketekkel is terület, a slugjával", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("csak-ticketek"));
    expect(pillanatkep.teruletek).toEqual([{ slug: "kis-javitasok", cim: "kis-javitasok" }]);
  });

  test("a spec.md fájl és issues/ mappa nélküli mappa és a laza fájl nem terület", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("nem-terulet"));
    expect(pillanatkep.teruletek).toEqual([]);
  });

  test("ha nincs .scratch, nincs terület", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("cimsor-nelkuli-readme"));
    expect(pillanatkep.teruletek).toEqual([]);
  });
});
