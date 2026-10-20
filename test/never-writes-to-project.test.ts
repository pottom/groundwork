import { createHash } from "node:crypto";
import { cp, mkdtemp, readdir, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import { figyel } from "../src/server/watcher.ts";
import { olvasPillanatkep } from "../src/server/snapshot.ts";

// ADR 0001: a Groundwork a projekt mappájába soha nem ír.

const pelda = fileURLToPath(new URL("./fixtures/sample-3-tickets", import.meta.url));

/** A mappa minden bejegyzése: útvonal, típus, módosítási idő, és fájlnál a tartalom hash-e. */
async function lenyomat(mappa: string): Promise<string[]> {
  const bejegyzesek = await readdir(mappa, { recursive: true });
  return Promise.all(
    [mappa, ...bejegyzesek.sort().map((b) => join(mappa, b))].map(async (utvonal) => {
      const adatok = await stat(utvonal);
      const tartalom = adatok.isFile()
        ? createHash("sha256").update(await readFile(utvonal)).digest("hex")
        : "mappa";
      return `${utvonal} ${adatok.mtimeMs} ${tartalom}`;
    }),
  );
}

async function peldaMasolat(): Promise<string> {
  const projekt = join(await mkdtemp(join(tmpdir(), "groundwork-")), "projekt");
  await cp(pelda, projekt, { recursive: true });
  return projekt;
}

test("az olvasás után a projekt mappája változatlan", async () => {
  const projekt = await peldaMasolat();
  const elotte = await lenyomat(projekt);

  await olvasPillanatkep(projekt);

  expect(await lenyomat(projekt)).toEqual(elotte);
});

test("a figyelés után a projekt mappája változatlan", async () => {
  const projekt = await peldaMasolat();
  const elotte = await lenyomat(projekt);

  const figyelo = await figyel(projekt, () => {});
  await figyelo.close();

  expect(await lenyomat(projekt)).toEqual(elotte);
});
