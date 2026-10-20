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
    expect(pillanatkep.teruletek).toMatchObject([
      { slug: "aktualis-idojaras", cim: "Aktuális időjárás egy Településen" },
    ]);
  });

  test("a terület ticketjei számmal, címmel és állapottal, szám szerint", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(pillanatkep.teruletek[0].ticketek).toMatchObject([
      { szam: "01", cim: "Végigfutó váz: egy Település hőmérséklete", allapot: "ready-for-agent" },
      { szam: "02", cim: "Azonos nevű Települések: választás megyével", allapot: "ready-for-agent" },
      { szam: "03", cim: "Szélerősség és Égkép a kártyán", allapot: "ready-for-agent" },
      { szam: "04", cim: "Érthető hibák", allapot: "ready-for-agent" },
      { szam: "05", cim: "Kézi ellenőrzés telefonon", allapot: "ready-for-human" },
    ]);
  });

  test("a ticket pipáinak aránya a - [ ] és - [x] sorokból", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(pillanatkep.teruletek[0].ticketek.map((t) => t.pipak)).toEqual([
      { kesz: 0, osszes: 7 },
      { kesz: 0, osszes: 7 },
      { kesz: 0, osszes: 5 },
      { kesz: 0, osszes: 7 },
      { kesz: 0, osszes: 4 },
    ]);
  });

  test("pipa a beágyazott listaelem is, a kódblokkban álló és a szóköz nélküli nem", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("pipa-szelek"));
    expect(pillanatkep.teruletek[0].ticketek[0].pipak).toEqual({ kesz: 3, osszes: 4 });
  });

  test("a done, closed, resolved és wontfix állapotú ticket lezárt, a többi nyitott", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("lezart-ticketek"));
    expect(pillanatkep.teruletek[0].ticketek.map(({ allapot, csoport }) => ({ allapot, csoport }))).toEqual([
      { allapot: "done", csoport: "lezart" },
      { allapot: "closed", csoport: "lezart" },
      { allapot: "resolved", csoport: "lezart" },
      { allapot: "wontfix", csoport: "lezart" },
      { allapot: "ready-for-agent", csoport: "nyitott" },
    ]);
  });

  test("az ismeretlen állapotú ticket is látszik, a nyers állapotával", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("ismeretlen-allapot"));
    expect(pillanatkep.teruletek[0].ticketek).toMatchObject([
      { szam: "01", cim: "Átnézésre vár", allapot: "in-review", csoport: "ismeretlen" },
      { szam: "02", cim: "Indítható", allapot: "ready-for-agent", csoport: "nyitott" },
    ]);
  });

  test("ha a specben nincs első szintű címsor, a terület címe a slug", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("cim-nelkuli-spec"));
    expect(pillanatkep.teruletek).toEqual([{ slug: "uj-otlet", cim: "uj-otlet", ticketek: [] }]);
  });

  test("spec nélkül, csak ticketekkel is terület, a slugjával", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("csak-ticketek"));
    expect(pillanatkep.teruletek).toMatchObject([
      {
        slug: "kis-javitasok",
        cim: "kis-javitasok",
        ticketek: [{ szam: "01", cim: "Elírás a láblécben", allapot: "ready-for-agent" }],
      },
    ]);
  });

  test("a ticket száma a fájlnévből, a címe a címsorból vagy a fájlnévből, az állapota a Status sorból, hiányában ismeretlen", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("ticket-szelek"));
    expect(pillanatkep.teruletek[0].ticketek.map(({ szam, cim, allapot, csoport }) => ({ szam, cim, allapot, csoport }))).toEqual([
      { szam: "2", cim: "Második", allapot: "ready-for-agent", csoport: "nyitott" },
      { szam: "03", cim: "Cím szám nélkül", allapot: "claimed", csoport: "nyitott" },
      { szam: "04", cim: "cimsor-nelkuli", allapot: "needs-info", csoport: "nyitott" },
      { szam: "06", cim: "Állapot nélkül", csoport: "ismeretlen" },
      { szam: "10", cim: "Tizedik", allapot: "needs-triage", csoport: "nyitott" },
    ]);
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
