import { readdir, readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import type { Nodes, Root } from "mdast";
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
  ticketek: Ticket[];
};

/** Egy `.scratch/<slug>/issues/<NN>-<név>.md` fájl. */
export type Ticket = {
  szam: string;
  cim: string;
  /** A `**Status:**` sor értéke; ha nincs ilyen sor, hiányzik. */
  allapot?: string;
  csoport: Allapotcsoport;
  /** A `- [x]` és az összes (`- [ ]` és `- [x]`) pipa száma. */
  pipak: { kesz: number; osszes: number };
};

/**
 * Az állapot csoportja. A nyitott csoportot az 05–06. ticket bontja tovább
 * (agentre vár, emberre vár, folyamatban); a hiányzó állapot is ismeretlen.
 */
export type Allapotcsoport = "nyitott" | "lezart" | "ismeretlen";

const csoportok = new Map<string, Allapotcsoport>([
  ["ready-for-agent", "nyitott"],
  ["ready-for-human", "nyitott"],
  ["needs-info", "nyitott"],
  ["needs-triage", "nyitott"],
  ["claimed", "nyitott"],
  ["done", "lezart"],
  ["closed", "lezart"],
  ["resolved", "lezart"],
  ["wontfix", "lezart"],
]);

export async function olvasPillanatkep(projektMappa: string): Promise<Pillanatkep> {
  const readme = await haVan(olvasMarkdown(join(projektMappa, "README.md")));
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
    const spec = vanSpec ? await olvasMarkdown(join(scratch, slug, "spec.md")) : undefined;
    const ticketek = vanIssues ? await olvasTicketek(join(scratch, slug, "issues")) : [];
    teruletek.push({ slug, cim: elsoCimsor(spec) ?? slug, ticketek });
  }
  return teruletek;
}

/** A terület ticketjei szám szerint; a ticket címe a `# NN: Cím` címsorból, ennek hiányában a fájlnévből. */
async function olvasTicketek(issues: string): Promise<Ticket[]> {
  const ticketek: Ticket[] = [];
  // Név szerint előre rendezve, hogy az azonos számú ticketek sorrendje is állandó legyen.
  const fajlok = (await readdir(issues, { withFileTypes: true })).sort((a, b) => (a.name < b.name ? -1 : 1));
  for (const fajl of fajlok) {
    const nev = fajl.isFile() && /^(\d+)-(.+)\.md$/.exec(fajl.name);
    if (!nev) continue;
    const ticket = await olvasMarkdown(join(issues, fajl.name));
    const cimsor = elsoCimsor(ticket);
    const allapot = mezo(ticket, "Status");
    ticketek.push({
      szam: nev[1],
      cim: cimsor ? (/^\d+:\s*(.+)$/.exec(cimsor)?.[1] ?? cimsor) : nev[2],
      allapot,
      csoport: (allapot !== undefined && csoportok.get(allapot)) || "ismeretlen",
      pipak: pipak(ticket),
    });
  }
  return ticketek.sort((a, b) => Number(a.szam) - Number(b.szam));
}

async function olvasMarkdown(fajl: string): Promise<Root> {
  return remark().parse(await readFile(fajl, "utf8"));
}

/** Az első `#` címsor szövege, vagy undefined, ha nincs (vagy üres). */
function elsoCimsor(fa: Root | undefined): string | undefined {
  const cimsor = fa?.children.find((elem) => elem.type === "heading" && elem.depth === 1);
  return (cimsor && toString(cimsor)) || undefined;
}

/** A `**Név:** érték` alakú bekezdés értéke, vagy undefined, ha nincs (vagy üres). */
function mezo(fa: Root, nev: string): string | undefined {
  const cimke = `${nev}:`;
  const bekezdes = fa.children.find(
    (elem) =>
      elem.type === "paragraph" && elem.children[0]?.type === "strong" && toString(elem.children[0]) === cimke,
  );
  return (bekezdes && toString(bekezdes).slice(cimke.length).trim()) || undefined;
}

/**
 * A pipás listaelemek (`- [ ] …`, `- [x] …`) a fában, bármilyen mélyen; a kódblokkban állók nem.
 * A remark GFM nélkül nem ismeri a pipát, ezért a listaelem szövegének elejéről olvassuk.
 */
function pipak(fa: Nodes): { kesz: number; osszes: number } {
  const eredmeny = { kesz: 0, osszes: 0 };
  if (fa.type === "listItem" && fa.children[0]?.type === "paragraph") {
    const pipa = /^\[([ xX])\]\s/.exec(toString(fa.children[0]));
    if (pipa) {
      eredmeny.osszes++;
      if (pipa[1] !== " ") eredmeny.kesz++;
    }
  }
  for (const gyerek of "children" in fa ? fa.children : []) {
    const alatta = pipak(gyerek);
    eredmeny.kesz += alatta.kesz;
    eredmeny.osszes += alatta.osszes;
  }
  return eredmeny;
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
