import { appendFile, cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, type Mock, test, vi } from "vitest";
import { type Watcher, watchProject } from "../src/server/watcher.ts";

const sample = fileURLToPath(new URL("./fixtures/sample-3-tickets", import.meta.url));
const ticket = ".scratch/aktualis-idojaras/issues/01-vegigfuto-vaz-egy-telepules-homerseklete.md";

// How long we watch to see that something does NOT notify: well over the debounce delay.
const quietMs = 1000;

let project: string;
let watcher: Watcher | undefined;
let onChange: Mock<() => void>;

beforeEach(async () => {
  project = join(await mkdtemp(join(tmpdir(), "groundwork-")), "project");
  await cp(sample, project, { recursive: true });
  onChange = vi.fn<() => void>();
  watcher = await watchProject(project, onChange);
});

afterEach(async () => {
  await watcher?.close();
});

/** Waits for the first notification (vi.waitFor: re-checks at short intervals, not a blind wait). */
const notified = () => vi.waitFor(() => expect(onChange).toHaveBeenCalled(), { timeout: 5000 });

describe("watcher", () => {
  test("modifying a ticket notifies", async () => {
    await appendFile(join(project, ticket), "\nMódosítás.\n");
    await notified();
  });

  test("creating a new ticket notifies", async () => {
    await writeFile(join(project, ".scratch/aktualis-idojaras/issues/99-uj.md"), "# 99: Új\n");
    await notified();
  });

  test("deleting a ticket notifies", async () => {
    await rm(join(project, ticket));
    await notified();
  });

  test("creating a new area folder notifies", async () => {
    await mkdir(join(project, ".scratch/uj-terulet"));
    await notified();
  });

  test("modifying the root README notifies", async () => {
    await appendFile(join(project, "README.md"), "\nMódosítás.\n");
    await notified();
  });

  test("a change outside .scratch/ that is not the README does not notify", async () => {
    await writeFile(join(project, "jegyzet.md"), "Valami.\n");
    await mkdir(join(project, "src"), { recursive: true });
    await writeFile(join(project, "src/README.md"), "# Nem a gyökér README\n");
    await new Promise((r) => setTimeout(r, quietMs));
    expect(onChange).not.toHaveBeenCalled();

    // The watcher stayed alive meanwhile: a change in .scratch/ notifies.
    await appendFile(join(project, ticket), "\nMódosítás.\n");
    await notified();
  });

  test("a quick burst of changes is a single notification", async () => {
    for (let i = 0; i < 10; i++) {
      await writeFile(join(project, `.scratch/aktualis-idojaras/issues/${10 + i}-uj.md`), `# ${10 + i}: Új\n`);
    }
    await notified();
    await new Promise((r) => setTimeout(r, quietMs));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("does not notify after closing", async () => {
    await watcher!.close();
    await appendFile(join(project, ticket), "\nMódosítás.\n");
    await new Promise((r) => setTimeout(r, quietMs));
    expect(onChange).not.toHaveBeenCalled();
  });
});
