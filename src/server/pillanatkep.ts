import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";

/** Amit a Groundwork egy projekt mappájából egyszerre, csak olvasva lát. */
export type Pillanatkep = {
  projektNev: string;
};

export async function olvasPillanatkep(projektMappa: string): Promise<Pillanatkep> {
  const readme = await olvasHaVan(join(projektMappa, "README.md"));
  return { projektNev: elsoCimsor(readme) ?? basename(resolve(projektMappa)) };
}

/** Az első `#` címsor szövege, vagy undefined, ha nincs (vagy üres). */
function elsoCimsor(markdown: string | undefined): string | undefined {
  if (markdown === undefined) return undefined;
  const cimsor = remark()
    .parse(markdown)
    .children.find((elem) => elem.type === "heading" && elem.depth === 1);
  return (cimsor && toString(cimsor)) || undefined;
}

async function olvasHaVan(fajl: string): Promise<string | undefined> {
  try {
    return await readFile(fajl, "utf8");
  } catch (hiba) {
    if ((hiba as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw hiba;
  }
}
