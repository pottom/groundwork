import { type ChildProcess, execFile, spawn } from "node:child_process";
import { appendFile, cp, mkdtemp } from "node:fs/promises";
import { createServer, type Server } from "node:net";
import { networkInterfaces, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, beforeAll, describe, expect, test } from "vitest";

// Smoke test of the product (ADR 0003): `npm run build`, then the output folder copied to a
// temporary place without node_modules, started there with Node alone.

const repo = fileURLToPath(new URL("..", import.meta.url));
const sample = fileURLToPath(new URL("./fixtures/sample-3-tickets", import.meta.url));
const ticket = ".scratch/aktualis-idojaras/issues/01-vegigfuto-vaz-egy-telepules-homerseklete.md";

let product: string;

beforeAll(async () => {
  await promisify(execFile)("npm", ["run", "build"], { cwd: repo });
  product = join(await mkdtemp(join(tmpdir(), "groundwork-product-")), "groundwork");
  await cp(join(repo, "dist/groundwork"), product, { recursive: true });
}, 120_000);

async function sampleCopy(): Promise<string> {
  const project = join(await mkdtemp(join(tmpdir(), "groundwork-")), "project");
  await cp(sample, project, { recursive: true });
  return project;
}

/** A port that was free a moment ago. */
async function freePort(): Promise<number> {
  const server = await occupyPort(0);
  const port = (server.address() as { port: number }).port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

/** Occupies a port on 127.0.0.1 (0: any free one) until the returned server is closed. */
function occupyPort(port: number): Promise<Server> {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

type Run = { child: ChildProcess; output: () => string; exited: Promise<number | null> };
const runs: Run[] = [];
const occupied: Server[] = [];

/** Runs the copied product with Node. */
function run(args: string[], cwd = product): Run {
  const child = spawn(process.execPath, [join(product, "groundwork.mjs"), ...args], { cwd });
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const exited = new Promise<number | null>((resolve) => child.once("exit", (code) => resolve(code)));
  const started = { child, output: () => output, exited };
  runs.push(started);
  return started;
}

/** Runs the product and waits until it prints its address. */
async function start(args: string[], cwd?: string): Promise<Run & { url: string }> {
  const started = run(["--no-open", ...args], cwd);
  const deadline = Date.now() + 10_000;
  for (;;) {
    const url = /http:\/\/[^\s/]+\//.exec(started.output())?.[0];
    if (url) return { ...started, url };
    if (started.child.exitCode !== null || Date.now() > deadline) {
      throw new Error(`The product did not start:\n${started.output()}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

afterEach(async () => {
  for (const { child, exited } of runs.splice(0)) {
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    await exited;
  }
  for (const server of occupied.splice(0)) await new Promise((resolve) => server.close(resolve));
});

describe("the product", () => {
  test("starts with Node alone, away from node_modules, and serves the page and the snapshot", async () => {
    const { url } = await start(["--root", await sampleCopy(), "--port", String(await freePort())]);

    const page = await fetch(url);
    expect(page.status).toBe(200);
    const html = await page.text();
    expect(html).toContain('<div id="app">');
    const script = /<script[^>]+src="\/([^"]+\.js)"/.exec(html)?.[1];
    expect(script, "the page has no script").toBeDefined();
    expect((await fetch(new URL(script!, url))).status).toBe(200);

    const snapshot = await (await fetch(new URL("api/snapshot", url))).json();
    expect(snapshot.projectName).toBe("Időjárás app: a Groundwork példaprojektje");
    expect(snapshot.areas[0].tickets).toHaveLength(5);
  });

  test("without --root, it shows the folder it was started in", async () => {
    const project = await sampleCopy();
    const { url } = await start(["--port", String(await freePort())], project);
    const snapshot = await (await fetch(new URL("api/snapshot", url))).json();
    expect(snapshot.projectName).toBe("Időjárás app: a Groundwork példaprojektje");
  });

  test("a change in the project is sent to the browser", async () => {
    const project = await sampleCopy();
    const { url } = await start(["--root", project, "--port", String(await freePort())]);
    const abort = new AbortController();
    const changes = (await fetch(new URL("api/changes", url), { signal: abort.signal })).body!.getReader();
    try {
      await appendFile(join(project, ticket), "\nMódosítás.\n");
      let received = "";
      while (!received.includes("event: changed")) {
        const { value, done } = await changes.read();
        if (done) break;
        received += new TextDecoder().decode(value);
      }
      expect(received).toContain("event: changed");
    } finally {
      abort.abort();
    }
  });

  test("listens on 127.0.0.1 only", async () => {
    const { url } = await start(["--root", await sampleCopy(), "--port", String(await freePort())]);
    expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);
    const port = new URL(url).port;
    const outside = Object.values(networkInterfaces())
      .flat()
      .find((address) => address && !address.internal && address.family === "IPv4");
    if (outside) {
      await expect(fetch(`http://${outside.address}:${port}/`, { signal: AbortSignal.timeout(2000) })).rejects.toThrow();
    }
  });

  test("if the port is taken, it uses the next free one and says so", async () => {
    const taken = await occupyPort(await freePort());
    occupied.push(taken);
    const takenPort = (taken.address() as { port: number }).port;

    const { url, output } = await start(["--root", await sampleCopy(), "--port", String(takenPort)]);

    expect(Number(new URL(url).port)).toBeGreaterThan(takenPort);
    expect(output()).toContain(`A ${takenPort} port foglalt`);
    expect((await fetch(new URL("api/snapshot", url))).status).toBe(200);
  });

  test("stops cleanly on Ctrl+C, even with the browser connected", async () => {
    const { child, url, exited } = await start(["--root", await sampleCopy(), "--port", String(await freePort())]);
    const abort = new AbortController();
    await fetch(new URL("api/changes", url), { signal: abort.signal });
    try {
      child.kill("SIGINT");
      expect(await exited).toBe(0);
    } finally {
      abort.abort();
    }
  });

  test("a project folder that does not exist is a clear error", async () => {
    const missing = join(await mkdtemp(join(tmpdir(), "groundwork-")), "nincs-ilyen");
    const { output, exited } = run(["--root", missing, "--no-open"]);
    expect(await exited).toBe(1);
    expect(output()).toContain(`A projekt mappája nem létezik: ${missing}`);
  });

  test("--help lists the options", async () => {
    const { output, exited } = run(["--help"]);
    expect(await exited).toBe(0);
    for (const option of ["--root", "--port", "--no-open", "--help"]) expect(output()).toContain(option);
  });
});
