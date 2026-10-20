import { readdir, readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import type { Nodes, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";

/** Amit a Groundwork egy projekt mappájából egyszerre, csak olvasva lát. */
export type Pillanatkep = {
  projektNev: string;
  teruletek: Terulet[];
  most: Most;
};

/**
 * A nem blokkolt agentre és emberre váró, a folyamatban lévő és a blokkolt ticketek, minden területről, sorrendben.
 * Blokkolt az agentre vagy emberre váró ticket, amelynek a `varRa` listája nem üres; a folyamatban lévő
 * (`claimed`) csak a `folyamatban` között van, akkor is, ha blokkolt.
 */
export type Most = {
  indithato: Ticket[];
  emberreVar: Ticket[];
  folyamatban: Ticket[];
  blokkolt: Ticket[];
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
  pipak: Pipak;
  /**
   * A `**Blocked by:**` sor blokkolói közül azok, amelyek nem lezártak, ahogy a sorban állnak.
   * A blokkoló ugyanazon a területen, szám szerint keresendő; a nem létező nem számít lezártnak.
   * Egy nyitott ticket akkor blokkolt, ha ez nem üres; a lezárt és az ismeretlen állapotúnál nem számít.
   */
  varRa: Blokkolo[];
};

/** Egy blokkoló, ahogy a `**Blocked by:**` sorban áll, és a címe; a cím hiányzik, ha nincs ilyen számú ticket a területen. */
export type Blokkolo = { szam: string; cim?: string };

/** A `- [x]` és az összes (`- [ ]` és `- [x]`) pipa száma egy ticketben. */
export type Pipak = { kesz: number; osszes: number };

/** Az állapot csoportja; ami nincs a `csoportok` között, az ismeretlen, a hiányzó állapot is. */
export type Allapotcsoport = "agentreVar" | "emberreVar" | "folyamatban" | "lezart" | "ismeretlen";

const csoportok = new Map<string, Allapotcsoport>([
  ["ready-for-agent", "agentreVar"],
  ["ready-for-human", "emberreVar"],
  ["needs-info", "emberreVar"],
  ["needs-triage", "emberreVar"],
  ["claimed", "folyamatban"],
  ["done", "lezart"],
  ["closed", "lezart"],
  ["resolved", "lezart"],
  ["wontfix", "lezart"],
]);

export async function olvasPillanatkep(projektMappa: string): Promise<Pillanatkep> {
  const readme = await haVan(olvasMarkdown(join(projektMappa, "README.md")));
  const teruletek = await olvasTeruletek(join(projektMappa, ".scratch"));
  const ticketek = teruletek.flatMap((terulet) => terulet.ticketek);
  const nemBlokkolt = (csoport: Allapotcsoport) =>
    ticketek.filter((ticket) => ticket.csoport === csoport && ticket.varRa.length === 0);
  return {
    projektNev: elsoCimsor(readme) ?? basename(resolve(projektMappa)),
    teruletek,
    most: {
      indithato: nemBlokkolt("agentreVar"),
      emberreVar: nemBlokkolt("emberreVar"),
      folyamatban: ticketek.filter((ticket) => ticket.csoport === "folyamatban"),
      blokkolt: ticketek.filter(
        (ticket) => (ticket.csoport === "agentreVar" || ticket.csoport === "emberreVar") && ticket.varRa.length > 0,
      ),
    },
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
  const ticketek: (Omit<Ticket, "varRa"> & { blokkolok: string[] })[] = [];
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
      csoport: csoportok.get(allapot ?? "") ?? "ismeretlen",
      pipak: pipak(ticket),
      blokkolok: olvasBlokkolok(mezo(ticket, "Blocked by")),
    });
  }
  ticketek.sort((a, b) => Number(a.szam) - Number(b.szam));
  return ticketek.map(({ blokkolok, ...ticket }) => ({
    ...ticket,
    varRa: blokkolok.flatMap((blokkolo) => {
      // A blokkoló számú ticketek a területen; a nem szám blokkolóhoz nincs ilyen.
      const ilyenek = /^\d+$/.test(blokkolo)
        ? ticketek.filter((masik) => Number(masik.szam) === Number(blokkolo))
        : [];
      // Lezárt, ha van ilyen számú ticket, és mind lezárt; ekkor már nem vár rá.
      if (ilyenek.length > 0 && ilyenek.every((masik) => masik.csoport === "lezart")) return [];
      return ilyenek.length > 0 ? [{ szam: blokkolo, cim: ilyenek[0].cim }] : [{ szam: blokkolo }];
    }),
  }));
}

/** A `**Blocked by:**` érték vesszővel elválasztott elemei; a `None…` kezdetű vagy hiányzó érték üres lista. */
function olvasBlokkolok(ertek: string | undefined): string[] {
  if (!ertek || ertek.startsWith("None")) return [];
  return ertek
    .split(",")
    .map((elem) => elem.trim())
    .filter((elem) => elem !== "");
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
function pipak(fa: Nodes): Pipak {
  const eredmeny: Pipak = { kesz: 0, osszes: 0 };
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
