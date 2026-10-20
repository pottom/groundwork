import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { olvasPillanatkep } from "../src/server/pillanatkep.ts";

const adatok = (nev: string) => fileURLToPath(new URL(`./adatok/${nev}`, import.meta.url));

describe("pillanatkép", () => {
  test("a projekt neve a README első címsora", async () => {
    const pillanatkep = await olvasPillanatkep(adatok("pelda-3-ticketek"));
    expect(pillanatkep.projektNev).toBe("Időjárás app: a Groundwork példaprojektje");
  });

  test("ha a README-ben nincs első szintű címsor, a projekt neve a mappa neve", async () => {
    const pillanatkep = await olvasPillanatkep(adatok("cimsor-nelkuli-readme"));
    expect(pillanatkep.projektNev).toBe("cimsor-nelkuli-readme");
  });

  test("ha nincs README, a projekt neve a mappa neve", async () => {
    const mappa = join(await mkdtemp(join(tmpdir(), "groundwork-")), "readme-nelkuli-projekt");
    await mkdir(mappa);
    const pillanatkep = await olvasPillanatkep(mappa);
    expect(pillanatkep.projektNev).toBe("readme-nelkuli-projekt");
  });
});
