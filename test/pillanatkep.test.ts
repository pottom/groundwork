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

  test("a done, closed, resolved és wontfix állapotú ticket lezárt", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("lezart-ticketek"));
    expect(pillanatkep.teruletek[0].ticketek.map(({ allapot, csoport }) => ({ allapot, csoport }))).toEqual([
      { allapot: "done", csoport: "lezart" },
      { allapot: "closed", csoport: "lezart" },
      { allapot: "resolved", csoport: "lezart" },
      { allapot: "wontfix", csoport: "lezart" },
      { allapot: "ready-for-agent", csoport: "agentreVar" },
    ]);
  });

  test("az ismeretlen állapotú ticket is látszik, a nyers állapotával", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("ismeretlen-allapot"));
    expect(pillanatkep.teruletek[0].ticketek).toMatchObject([
      { szam: "01", cim: "Átnézésre vár", allapot: "in-review", csoport: "ismeretlen" },
      { szam: "02", cim: "Indítható", allapot: "ready-for-agent", csoport: "agentreVar" },
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
      { szam: "2", cim: "Második", allapot: "ready-for-agent", csoport: "agentreVar" },
      { szam: "03", cim: "Cím szám nélkül", allapot: "claimed", csoport: "folyamatban" },
      { szam: "04", cim: "cimsor-nelkuli", allapot: "needs-info", csoport: "emberreVar" },
      { szam: "06", cim: "Állapot nélkül", csoport: "ismeretlen" },
      { szam: "10", cim: "Tizedik", allapot: "needs-triage", csoport: "emberreVar" },
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
  test("a ticket a nem lezárt blokkolóira vár; a None… kezdetű Blocked by üres", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(pillanatkep.teruletek[0].ticketek.map(({ szam, varRa }) => ({ szam, varRa }))).toEqual([
      { szam: "01", varRa: [] },
      { szam: "02", varRa: [{ szam: "01", cim: "Végigfutó váz: egy Település hőmérséklete" }] },
      { szam: "03", varRa: [{ szam: "01", cim: "Végigfutó váz: egy Település hőmérséklete" }] },
      { szam: "04", varRa: [{ szam: "01", cim: "Végigfutó váz: egy Település hőmérséklete" }] },
      {
        szam: "05",
        varRa: [
          { szam: "02", cim: "Azonos nevű Települések: választás megyével" },
          { szam: "03", cim: "Szélerősség és Égkép a kártyán" },
          { szam: "04", cim: "Érthető hibák" },
        ],
      },
    ]);
  });

  test("Most: a példaprojekten csak a 01 indítható, az emberre váró 05 blokkolt", async () => {
    const { most } = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(most.indithato.map((t) => t.szam)).toEqual(["01"]);
    expect(most.emberreVar).toEqual([]);
    expect(most.folyamatban).toEqual([]);
  });

  test("Most: a példaprojekten a 02, 03, 04 és az emberre váró 05 blokkolt", async () => {
    const { most } = await olvasPillanatkep(adatMappa("pelda-3-ticketek"));
    expect(most.blokkolt.map(({ szam, csoport, varRa }) => ({ szam, csoport, varRa: varRa.map((b) => b.szam) }))).toEqual([
      { szam: "02", csoport: "agentreVar", varRa: ["01"] },
      { szam: "03", csoport: "agentreVar", varRa: ["01"] },
      { szam: "04", csoport: "agentreVar", varRa: ["01"] },
      { szam: "05", csoport: "emberreVar", varRa: ["02", "03", "04"] },
    ]);
  });

  test("a lezárt blokkoló után a ticket indítható; a blokkoló ugyanazon a területen, szám szerint; a nem létező nem lezárt", async () => {
    const pillanatkep = await olvasPillanatkep(adatMappa("lezart-blokkolo"));
    expect(pillanatkep.teruletek[1].ticketek.map(({ szam, varRa }) => ({ szam, varRa }))).toEqual([
      { szam: "01", varRa: [] },
      { szam: "02", varRa: [] },
      { szam: "03", varRa: [] },
      { szam: "04", varRa: [{ szam: "02", cim: "Utána indítható" }] },
      { szam: "05", varRa: [{ szam: "09" }] },
    ]);
    expect(pillanatkep.most.indithato.map(({ szam, cim }) => ({ szam, cim }))).toEqual([
      { szam: "01", cim: "Nyitott" },
      { szam: "02", cim: "Utána indítható" },
    ]);
    expect(pillanatkep.most.emberreVar.map(({ szam, cim }) => ({ szam, cim }))).toEqual([
      { szam: "03", cim: "Utána emberre vár" },
    ]);
    expect(pillanatkep.most.blokkolt.map(({ szam, varRa }) => ({ szam, varRa }))).toEqual([
      { szam: "04", varRa: [{ szam: "02", cim: "Utána indítható" }] },
      { szam: "05", varRa: [{ szam: "09" }] },
    ]);
  });

  test("Most: a claimed ticket folyamatban, a needs-info és a needs-triage emberre vár", async () => {
    const { most } = await olvasPillanatkep(adatMappa("folyamatban"));
    expect(most.indithato).toEqual([]);
    expect(most.emberreVar.map((t) => t.szam)).toEqual(["02", "03"]);
    expect(most.folyamatban.map((t) => t.szam)).toEqual(["01"]);
  });

  test("Most: a blokkolt claimed ticket csak a Folyamatban látszik, a Blokkoltban nem", async () => {
    const { teruletek, most } = await olvasPillanatkep(adatMappa("folyamatban"));
    expect(teruletek[0].ticketek[0]).toMatchObject({ szam: "01", csoport: "folyamatban", varRa: [{ szam: "02" }] });
    expect(most.folyamatban.map((t) => t.szam)).toEqual(["01"]);
    expect(most.blokkolt).toEqual([]);
  });

  test("ha nincs terület, a Most üres", async () => {
    const { most } = await olvasPillanatkep(adatMappa("cimsor-nelkuli-readme"));
    expect(most).toEqual({ indithato: [], emberreVar: [], folyamatban: [], blokkolt: [] });
  });
});
