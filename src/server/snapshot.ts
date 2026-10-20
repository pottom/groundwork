import { readdir, readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import type { Nodes, Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";

/** What Groundwork sees of a project folder at one moment, reading only. */
export type Snapshot = {
  projectName: string;
  areas: Area[];
  now: Now;
};

/**
 * The unblocked tickets awaiting an agent or a human, the in-progress and the blocked tickets, from every area, in order.
 * A ticket awaiting an agent or a human is blocked when its `waitingOn` list is not empty; an in-progress
 * (`claimed`) ticket is only in `inProgress`, even when it is blocked.
 */
export type Now = {
  startable: Ticket[];
  awaitingHuman: Ticket[];
  inProgress: Ticket[];
  blocked: Ticket[];
};

/** A `.scratch/<slug>/` folder that has a `spec.md` or an `issues/`. */
export type Area = {
  slug: string;
  title: string;
  tickets: Ticket[];
};

/** A `.scratch/<slug>/issues/<NN>-<name>.md` file. */
export type Ticket = {
  number: string;
  title: string;
  /** The value of the `**Status:**` line; missing if there is no such line. */
  status?: string;
  group: StatusGroup;
  checklist: Checklist;
  /**
   * The blockers from the `**Blocked by:**` line that are not closed, in the order they appear on the line.
   * A blocker is looked up in the same area, by number; one that does not exist does not count as closed.
   * An open ticket is blocked when this is not empty; for a closed or unknown-status ticket it does not matter.
   */
  waitingOn: Blocker[];
};

/** A blocker as it appears on the `**Blocked by:**` line, and its title; the title is missing if the area has no ticket with that number. */
export type Blocker = { number: string; title?: string };

/** The number of `- [x]` checkboxes and of all (`- [ ]` and `- [x]`) checkboxes in a ticket. */
export type Checklist = { done: number; total: number };

/** The group of a status; anything not in `statusGroups` is unknown, and so is a missing status. */
export type StatusGroup = "awaitingAgent" | "awaitingHuman" | "inProgress" | "closed" | "unknown";

const statusGroups = new Map<string, StatusGroup>([
  ["ready-for-agent", "awaitingAgent"],
  ["ready-for-human", "awaitingHuman"],
  ["needs-info", "awaitingHuman"],
  ["needs-triage", "awaitingHuman"],
  ["claimed", "inProgress"],
  ["done", "closed"],
  ["closed", "closed"],
  ["resolved", "closed"],
  ["wontfix", "closed"],
]);

export async function readSnapshot(projectDir: string): Promise<Snapshot> {
  const readme = await ifExists(readMarkdown(join(projectDir, "README.md")));
  const areas = await readAreas(join(projectDir, ".scratch"));
  const tickets = areas.flatMap((area) => area.tickets);
  const unblocked = (group: StatusGroup) =>
    tickets.filter((ticket) => ticket.group === group && ticket.waitingOn.length === 0);
  return {
    projectName: firstHeading(readme) ?? basename(resolve(projectDir)),
    areas,
    now: {
      startable: unblocked("awaitingAgent"),
      awaitingHuman: unblocked("awaitingHuman"),
      inProgress: tickets.filter((ticket) => ticket.group === "inProgress"),
      blocked: tickets.filter(
        (ticket) => (ticket.group === "awaitingAgent" || ticket.group === "awaitingHuman") && ticket.waitingOn.length > 0,
      ),
    },
  };
}

async function readAreas(scratch: string): Promise<Area[]> {
  const dirs = ((await ifExists(readdir(scratch, { withFileTypes: true }))) ?? [])
    .filter((entry) => entry.isDirectory())
    .map((dir) => dir.name)
    .sort();
  const areas: Area[] = [];
  for (const slug of dirs) {
    const contents = await readdir(join(scratch, slug), { withFileTypes: true });
    const hasSpec = contents.some((e) => e.name === "spec.md" && e.isFile());
    const hasIssues = contents.some((e) => e.name === "issues" && e.isDirectory());
    if (!hasSpec && !hasIssues) continue;
    const spec = hasSpec ? await readMarkdown(join(scratch, slug, "spec.md")) : undefined;
    const tickets = hasIssues ? await readTickets(join(scratch, slug, "issues")) : [];
    areas.push({ slug, title: firstHeading(spec) ?? slug, tickets });
  }
  return areas;
}

/** The area's tickets by number; a ticket's title comes from its `# NN: Title` heading, or failing that, from the file name. */
async function readTickets(issues: string): Promise<Ticket[]> {
  const tickets: (Omit<Ticket, "waitingOn"> & { blockers: string[] })[] = [];
  // Sorted by name first, so that tickets with the same number also keep a stable order.
  const files = (await readdir(issues, { withFileTypes: true })).sort((a, b) => (a.name < b.name ? -1 : 1));
  for (const file of files) {
    const name = file.isFile() && /^(\d+)-(.+)\.md$/.exec(file.name);
    if (!name) continue;
    const ticket = await readMarkdown(join(issues, file.name));
    const heading = firstHeading(ticket);
    const status = field(ticket, "Status");
    tickets.push({
      number: name[1],
      title: heading ? (/^\d+:\s*(.+)$/.exec(heading)?.[1] ?? heading) : name[2],
      status,
      group: statusGroups.get(status ?? "") ?? "unknown",
      checklist: countChecklist(ticket),
      blockers: parseBlockers(field(ticket, "Blocked by")),
    });
  }
  tickets.sort((a, b) => Number(a.number) - Number(b.number));
  return tickets.map(({ blockers, ...ticket }) => ({
    ...ticket,
    waitingOn: blockers.flatMap((blocker) => {
      // The tickets in the area with the blocker's number; a non-numeric blocker has none.
      const matches = /^\d+$/.test(blocker)
        ? tickets.filter((other) => Number(other.number) === Number(blocker))
        : [];
      // Closed if there are tickets with that number and all of them are closed; then it no longer waits on it.
      if (matches.length > 0 && matches.every((other) => other.group === "closed")) return [];
      return matches.length > 0 ? [{ number: blocker, title: matches[0].title }] : [{ number: blocker }];
    }),
  }));
}

/** The comma-separated items of a `**Blocked by:**` value; a value starting with `None…`, or a missing one, is an empty list. */
function parseBlockers(value: string | undefined): string[] {
  if (!value || value.startsWith("None")) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

async function readMarkdown(file: string): Promise<Root> {
  return remark().parse(await readFile(file, "utf8"));
}

/** The text of the first `#` heading, or undefined if there is none (or it is empty). */
function firstHeading(tree: Root | undefined): string | undefined {
  const heading = tree?.children.find((node) => node.type === "heading" && node.depth === 1);
  return (heading && toString(heading)) || undefined;
}

/** The value of a `**Name:** value` paragraph, or undefined if there is none (or it is empty). */
function field(tree: Root, name: string): string | undefined {
  const label = `${name}:`;
  const paragraph = tree.children.find(
    (node) =>
      node.type === "paragraph" && node.children[0]?.type === "strong" && toString(node.children[0]) === label,
  );
  return (paragraph && toString(paragraph).slice(label.length).trim()) || undefined;
}

/**
 * The checkbox list items (`- [ ] …`, `- [x] …`) in the tree, at any depth; those inside a code block are not.
 * Without GFM, remark does not know checkboxes, so we read them from the start of the list item's text.
 */
function countChecklist(tree: Nodes): Checklist {
  const result: Checklist = { done: 0, total: 0 };
  if (tree.type === "listItem" && tree.children[0]?.type === "paragraph") {
    const checkbox = /^\[([ xX])\]\s/.exec(toString(tree.children[0]));
    if (checkbox) {
      result.total++;
      if (checkbox[1] !== " ") result.done++;
    }
  }
  for (const child of "children" in tree ? tree.children : []) {
    const below = countChecklist(child);
    result.done += below.done;
    result.total += below.total;
  }
  return result;
}

/** The result of a file operation, or undefined if the file or folder does not exist. */
async function ifExists<T>(operation: Promise<T>): Promise<T | undefined> {
  try {
    return await operation;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}
