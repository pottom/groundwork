import { readdir, readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";

/** Amit a Groundwork egy projekt mappájából egyszerre, csak olvasva lát. */
export type Pillanatkep = {
  projektNev: string;
  teruletek: Terulet[];
};

/** Egy `.scratch/<slug>/` mappa, amelyben `spec.md` vagy `issues/` van. */
export type Terulet = {
  slug: string;
  cim: string;
};

export async function olvasPillanatkep(projektMappa: string): Promise<Pillanatkep> {
  const readme = await haVan(readFile(join(projektMappa, "README.md"), "utf8"));
  return {
    projektNev: elsoCimsor(readme) ?? basename(resolve(projektMappa)),
    teruletek: await olvasTeruletek(join(projektMappa, ".scratch")),
  };
}

async function olvasTeruletek(scratch: string): Promise<Terulet[]> {
  const mappak = ((await haVan(readdir(scratch, { withFileTypes: true }))) ?? [])
    .filter((bejegyzes) => bejegyzes.isDirectory())
    .map((mappa) => mappa.name)
    .sort();
  const teruletek: Terulet[] = [];
  for (const slug of mappak) {
    const tartalom = await readdir(join(scratch, slug), { withFileTypes: true });
    const vanSpec = tartalom.some((b) => b.name === "spec.md" && b.isFile());
    const vanIssues = tartalom.some((b) => b.name === "issues" && b.isDirectory());
    if (!vanSpec && !vanIssues) continue;
    const spec = vanSpec ? await readFile(join(scratch, slug, "spec.md"), "utf8") : undefined;
    teruletek.push({ slug, cim: elsoCimsor(spec) ?? slug });
  }
  return teruletek;
}

/** Az első `#` címsor szövege, vagy undefined, ha nincs (vagy üres). */
function elsoCimsor(markdown: string | undefined): string | undefined {
  if (markdown === undefined) return undefined;
  const cimsor = remark()
    .parse(markdown)
    .children.find((elem) => elem.type === "heading" && elem.depth === 1);
  return (cimsor && toString(cimsor)) || undefined;
}

/** A fájlművelet eredménye, vagy undefined, ha a fájl vagy mappa nem létezik. */
async function haVan<T>(muvelet: Promise<T>): Promise<T | undefined> {
  try {
    return await muvelet;
  } catch (hiba) {
    if ((hiba as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw hiba;
  }
}
