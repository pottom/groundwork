import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

/** Amit a Groundwork egy projekt mappájából egyszerre, csak olvasva lát. */
export type Pillanatkep = {
  projektNev: string;
};

export async function olvasPillanatkep(projektMappa: string): Promise<Pillanatkep> {
  const readme = await olvasHaVan(join(projektMappa, "README.md"));
  return { projektNev: elsoCimsor(readme) ?? basename(resolve(projektMappa)) };
}

/** Az első `# Cím` sor szövege, vagy undefined, ha nincs. */
function elsoCimsor(markdown: string | undefined): string | undefined {
  return markdown?.match(/^#[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*\r?$/m)?.[1];
}

async function olvasHaVan(fajl: string): Promise<string | undefined> {
  try {
    return await readFile(fajl, "utf8");
  } catch (hiba) {
    if ((hiba as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw hiba;
  }
}
