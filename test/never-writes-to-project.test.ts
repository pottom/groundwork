import { createHash } from "node:crypto";
import { cp, mkdtemp, readdir, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import { readSnapshot } from "../src/server/snapshot.ts";
import { watchProject } from "../src/server/watcher.ts";

// ADR 0001: Groundwork never writes to the project folder.

const sample = fileURLToPath(new URL("./fixtures/sample-3-tickets", import.meta.url));

/** Every entry of the folder: path, type, modification time, and for files the hash of the contents. */
async function fingerprint(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true });
  return Promise.all(
    [dir, ...entries.sort().map((e) => join(dir, e))].map(async (path) => {
      const stats = await stat(path);
      const contents = stats.isFile()
        ? createHash("sha256").update(await readFile(path)).digest("hex")
        : "dir";
      return `${path} ${stats.mtimeMs} ${contents}`;
    }),
  );
}

async function sampleCopy(): Promise<string> {
  const project = join(await mkdtemp(join(tmpdir(), "groundwork-")), "project");
  await cp(sample, project, { recursive: true });
  return project;
}

test("after reading, the project folder is unchanged", async () => {
  const project = await sampleCopy();
  const before = await fingerprint(project);

  await readSnapshot(project);

  expect(await fingerprint(project)).toEqual(before);
});

test("after watching, the project folder is unchanged", async () => {
  const project = await sampleCopy();
  const before = await fingerprint(project);

  const watcher = await watchProject(project, () => {});
  await watcher.close();

  expect(await fingerprint(project)).toEqual(before);
});
