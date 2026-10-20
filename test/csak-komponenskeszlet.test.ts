import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

// ADR 0005: a komponenskészleten kívül egyetlen Svelte-fájlban sincs `class`, `style` vagy `<style>`.

const forras = fileURLToPath(new URL("../src", import.meta.url));
const komponenskeszlet = "web/lib/components/ui/";
const tiltott = /\bclass\s*[=:]|\bstyle\s*[=:]|<style[\s>]/;

test("a komponenskészleten kívül egyik Svelte-fájlban sincs saját stílus", async () => {
  const svelteFajlok = (await readdir(forras, { recursive: true }))
    .filter((f) => f.endsWith(".svelte"))
    .filter((f) => !f.startsWith(komponenskeszlet));
  expect(svelteFajlok, "nincs ellenőrizhető Svelte-fájl").not.toEqual([]);

  const sertesek: string[] = [];
  for (const fajl of svelteFajlok) {
    const sorok = (await readFile(join(forras, fajl), "utf8")).split("\n");
    sorok.forEach((sor, i) => {
      if (tiltott.test(sor)) sertesek.push(`${relative(".", join(forras, fajl))}:${i + 1}: ${sor.trim()}`);
    });
  }
  expect(sertesek).toEqual([]);
});
