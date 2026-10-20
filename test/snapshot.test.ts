import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { readSnapshot } from "../src/server/snapshot.ts";

const fixture = (name: string) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

describe("snapshot", () => {
  test("the project name is the first heading of the README", async () => {
    const snapshot = await readSnapshot(fixture("sample-3-tickets"));
    expect(snapshot.projectName).toBe("Időjárás app: a Groundwork példaprojektje");
  });

  test("if the README has no first-level heading, the project name is the folder name", async () => {
    const snapshot = await readSnapshot(fixture("readme-without-heading"));
    expect(snapshot.projectName).toBe("readme-without-heading");
  });

  test("a # line inside a code block is not a heading", async () => {
    const snapshot = await readSnapshot(fixture("readme-starting-with-code-block"));
    expect(snapshot.projectName).toBe("Kódblokk utáni cím");
  });

  test("if there is no README, the project name is the folder name", async () => {
    const dir = join(await mkdtemp(join(tmpdir(), "groundwork-")), "project-without-readme");
    await mkdir(dir);
    const snapshot = await readSnapshot(dir);
    expect(snapshot.projectName).toBe("project-without-readme");
  });

  test("the area title is the first heading of the spec", async () => {
    const snapshot = await readSnapshot(fixture("sample-3-tickets"));
    expect(snapshot.areas).toMatchObject([
      { slug: "aktualis-idojaras", title: "Aktuális időjárás egy Településen" },
    ]);
  });

  test("the area's tickets with number, title and status, by number", async () => {
    const snapshot = await readSnapshot(fixture("sample-3-tickets"));
    expect(snapshot.areas[0].tickets).toMatchObject([
      { number: "01", title: "Végigfutó váz: egy Település hőmérséklete", status: "ready-for-agent" },
      { number: "02", title: "Azonos nevű Települések: választás megyével", status: "ready-for-agent" },
      { number: "03", title: "Szélerősség és Égkép a kártyán", status: "ready-for-agent" },
      { number: "04", title: "Érthető hibák", status: "ready-for-agent" },
      { number: "05", title: "Kézi ellenőrzés telefonon", status: "ready-for-human" },
    ]);
  });

  test("the ticket's checklist ratio from the - [ ] and - [x] lines", async () => {
    const snapshot = await readSnapshot(fixture("sample-3-tickets"));
    expect(snapshot.areas[0].tickets.map((t) => t.checklist)).toEqual([
      { done: 0, total: 7 },
      { done: 0, total: 7 },
      { done: 0, total: 5 },
      { done: 0, total: 7 },
      { done: 0, total: 4 },
    ]);
  });

  test("a nested list item is a checkbox too, one in a code block or without a space is not", async () => {
    const snapshot = await readSnapshot(fixture("checklist-edge-cases"));
    expect(snapshot.areas[0].tickets[0].checklist).toEqual({ done: 3, total: 4 });
  });

  test("a ticket with done, closed, resolved or wontfix status is closed", async () => {
    const snapshot = await readSnapshot(fixture("closed-tickets"));
    expect(snapshot.areas[0].tickets.map(({ status, group }) => ({ status, group }))).toEqual([
      { status: "done", group: "closed" },
      { status: "closed", group: "closed" },
      { status: "resolved", group: "closed" },
      { status: "wontfix", group: "closed" },
      { status: "ready-for-agent", group: "awaitingAgent" },
    ]);
  });

  test("a ticket with an unknown status is shown too, with its raw status", async () => {
    const snapshot = await readSnapshot(fixture("unknown-status"));
    expect(snapshot.areas[0].tickets).toMatchObject([
      { number: "01", title: "Átnézésre vár", status: "in-review", group: "unknown" },
      { number: "02", title: "Indítható", status: "ready-for-agent", group: "awaitingAgent" },
    ]);
  });

  test("if the spec has no first-level heading, the area title is the slug", async () => {
    const snapshot = await readSnapshot(fixture("spec-without-heading"));
    expect(snapshot.areas).toEqual([{ slug: "uj-otlet", title: "uj-otlet", tickets: [] }]);
  });

  test("without a spec, tickets alone make an area, titled by its slug", async () => {
    const snapshot = await readSnapshot(fixture("tickets-only"));
    expect(snapshot.areas).toMatchObject([
      {
        slug: "kis-javitasok",
        title: "kis-javitasok",
        tickets: [{ number: "01", title: "Elírás a láblécben", status: "ready-for-agent" }],
      },
    ]);
  });

  test("the ticket number comes from the file name, the title from the heading or the file name, the status from the Status line, unknown without one", async () => {
    const snapshot = await readSnapshot(fixture("ticket-edge-cases"));
    expect(snapshot.areas[0].tickets.map(({ number, title, status, group }) => ({ number, title, status, group }))).toEqual([
      { number: "2", title: "Második", status: "ready-for-agent", group: "awaitingAgent" },
      { number: "03", title: "Cím szám nélkül", status: "claimed", group: "inProgress" },
      { number: "04", title: "cimsor-nelkuli", status: "needs-info", group: "awaitingHuman" },
      { number: "06", title: "Állapot nélkül", group: "unknown" },
      { number: "10", title: "Tizedik", status: "needs-triage", group: "awaitingHuman" },
    ]);
  });

  test("a folder without a spec.md file or an issues/ folder, and a loose file, are not areas", async () => {
    const snapshot = await readSnapshot(fixture("not-an-area"));
    expect(snapshot.areas).toEqual([]);
  });

  test("if there is no .scratch, there are no areas", async () => {
    const snapshot = await readSnapshot(fixture("readme-without-heading"));
    expect(snapshot.areas).toEqual([]);
  });
  test("a ticket waits on its blockers that are not closed; a Blocked by starting with None… is empty", async () => {
    const snapshot = await readSnapshot(fixture("sample-3-tickets"));
    expect(snapshot.areas[0].tickets.map(({ number, waitingOn }) => ({ number, waitingOn }))).toEqual([
      { number: "01", waitingOn: [] },
      { number: "02", waitingOn: [{ number: "01", title: "Végigfutó váz: egy Település hőmérséklete" }] },
      { number: "03", waitingOn: [{ number: "01", title: "Végigfutó váz: egy Település hőmérséklete" }] },
      { number: "04", waitingOn: [{ number: "01", title: "Végigfutó váz: egy Település hőmérséklete" }] },
      {
        number: "05",
        waitingOn: [
          { number: "02", title: "Azonos nevű Települések: választás megyével" },
          { number: "03", title: "Szélerősség és Égkép a kártyán" },
          { number: "04", title: "Érthető hibák" },
        ],
      },
    ]);
  });

  test("Now: in the sample project only 01 is startable, 05 awaiting a human is blocked", async () => {
    const { now } = await readSnapshot(fixture("sample-3-tickets"));
    expect(now.startable.map((t) => t.number)).toEqual(["01"]);
    expect(now.awaitingHuman).toEqual([]);
    expect(now.inProgress).toEqual([]);
  });

  test("Now: in the sample project 02, 03, 04 and 05 awaiting a human are blocked", async () => {
    const { now } = await readSnapshot(fixture("sample-3-tickets"));
    expect(now.blocked.map(({ number, group, waitingOn }) => ({ number, group, waitingOn: waitingOn.map((blocker) => blocker.number) }))).toEqual([
      { number: "02", group: "awaitingAgent", waitingOn: ["01"] },
      { number: "03", group: "awaitingAgent", waitingOn: ["01"] },
      { number: "04", group: "awaitingAgent", waitingOn: ["01"] },
      { number: "05", group: "awaitingHuman", waitingOn: ["02", "03", "04"] },
    ]);
  });

  test("after a closed blocker the ticket is startable; the blocker is in the same area, by number; a nonexistent one is not closed", async () => {
    const snapshot = await readSnapshot(fixture("closed-blocker"));
    expect(snapshot.areas[1].tickets.map(({ number, waitingOn }) => ({ number, waitingOn }))).toEqual([
      { number: "01", waitingOn: [] },
      { number: "02", waitingOn: [] },
      { number: "03", waitingOn: [] },
      { number: "04", waitingOn: [{ number: "02", title: "Utána indítható" }] },
      { number: "05", waitingOn: [{ number: "09" }] },
    ]);
    expect(snapshot.now.startable.map(({ number, title }) => ({ number, title }))).toEqual([
      { number: "01", title: "Nyitott" },
      { number: "02", title: "Utána indítható" },
    ]);
    expect(snapshot.now.awaitingHuman.map(({ number, title }) => ({ number, title }))).toEqual([
      { number: "03", title: "Utána emberre vár" },
    ]);
    expect(snapshot.now.blocked.map(({ number, waitingOn }) => ({ number, waitingOn }))).toEqual([
      { number: "04", waitingOn: [{ number: "02", title: "Utána indítható" }] },
      { number: "05", waitingOn: [{ number: "09" }] },
    ]);
  });

  test("Now: a claimed ticket is in progress, needs-info and needs-triage await a human", async () => {
    const { now } = await readSnapshot(fixture("in-progress"));
    expect(now.startable).toEqual([]);
    expect(now.awaitingHuman.map((t) => t.number)).toEqual(["02", "03"]);
    expect(now.inProgress.map((t) => t.number)).toEqual(["01"]);
  });

  test("Now: a blocked claimed ticket shows only under In progress, not under Blocked", async () => {
    const { areas, now } = await readSnapshot(fixture("in-progress"));
    expect(areas[0].tickets[0]).toMatchObject({ number: "01", group: "inProgress", waitingOn: [{ number: "02" }] });
    expect(now.inProgress.map((t) => t.number)).toEqual(["01"]);
    expect(now.blocked).toEqual([]);
  });

  test("if there are no areas, Now is empty", async () => {
    const { now } = await readSnapshot(fixture("readme-without-heading"));
    expect(now).toEqual({ startable: [], awaitingHuman: [], inProgress: [], blocked: [] });
  });
});
