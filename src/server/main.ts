// Production launcher, the entry of the product's groundwork.mjs (`scripts/build.ts` bundles it
// with all its dependencies). It serves the compiled page from the web/ folder next to it and
// the Groundwork API (`app.ts`, the same one the development launcher uses), on 127.0.0.1 only.
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import type { Server } from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createAdaptorServer } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { groundworkApi } from "./app.ts";

const host = "127.0.0.1";
const defaultPort = 4477;

const help = `Groundwork: megmutatja egy projekt állapotát a böngészőben.

Használat: node groundwork.mjs [kapcsolók]

  --root <mappa>  a megmutatandó projekt mappája (alapból az aktuális mappa)
  --port <szám>   a port (alapból ${defaultPort}); ha foglalt, a következő szabadot használja
  --no-open       ne nyissa meg a böngészőt
  --help          ez a súgó

A Groundwork csak olvassa a projektet, és csak erről a gépről érhető el (${host}).`;

function fail(message: string): never {
  console.error(`${message}\nSúgó: node groundwork.mjs --help`);
  process.exit(1);
}

let options;
try {
  options = parseArgs({
    options: {
      root: { type: "string" },
      port: { type: "string" },
      open: { type: "boolean", default: true },
      help: { type: "boolean" },
    },
    allowNegative: true,
  }).values;
} catch {
  fail(`Ismeretlen kapcsoló vagy hiányzó érték: ${process.argv.slice(2).join(" ")}`);
}

if (options.help) {
  console.log(help);
  process.exit(0);
}

const portText = options.port ?? String(defaultPort);
const port = Number(portText);
if (!/^\d+$/.test(portText) || port < 1 || port > 65535) {
  fail(`A --port értéke 1 és 65535 közötti egész szám legyen, nem ez: ${portText}`);
}

const projectDir = resolve(options.root ?? ".");
const projectStats = await stat(projectDir).catch(() => undefined);
if (!projectStats) fail(`A projekt mappája nem létezik: ${projectDir}`);
if (!projectStats.isDirectory()) fail(`A --root nem mappára mutat: ${projectDir}`);

const { app: api, close } = await groundworkApi(projectDir);
const page = fileURLToPath(new URL("./web/", import.meta.url));
const app = new Hono().route("/", api).use(serveStatic({ root: page }));
const server = createAdaptorServer({ fetch: app.fetch }) as Server;

const listeningPort = await listen(server, port);
const url = `http://${host}:${listeningPort}/`;
if (listeningPort !== port) console.log(`A ${port} port foglalt, helyette a következő szabadot használom: ${listeningPort}`);
console.log(`Groundwork: ${projectDir}\nCím: ${url}\nLeállítás: Ctrl+C`);
if (options.open) openBrowser(url);

// On Ctrl+C we stop the watcher too; exiting closes the open connections.
async function shutdown() {
  try {
    await close();
  } finally {
    process.exit();
  }
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

/** Listens on 127.0.0.1, on the first free port from `port` up; returns the port it got. */
async function listen(server: Server, port: number): Promise<number> {
  for (let candidate = port; candidate <= 65535; candidate++) {
    const error = await new Promise<NodeJS.ErrnoException | undefined>((resolve) => {
      const onError = (error: NodeJS.ErrnoException) => {
        server.off("listening", onListening);
        resolve(error);
      };
      const onListening = () => {
        server.off("error", onError);
        resolve(undefined);
      };
      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(candidate, host);
    });
    if (!error) return candidate;
    if (error.code !== "EADDRINUSE") fail(`Nem tudok figyelni a ${candidate} porton: ${error.message}`);
  }
  fail(`A ${port} és a 65535 között nincs szabad port.`);
}

/** Opens the address in the default browser; if that fails, the server keeps running and says so. */
function openBrowser(url: string) {
  const [command, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", '""', url]]
        : ["xdg-open", [url]];
  let warned = false;
  const warn = () => {
    if (!warned) console.log(`A böngészőt nem sikerült megnyitni, nyisd meg kézzel: ${url}`);
    warned = true;
  };
  try {
    // Detached, so that Ctrl+C here does not close a browser it started.
    const opener = spawn(command, args, { stdio: "ignore", detached: true, windowsVerbatimArguments: true });
    opener.once("error", warn);
    opener.once("exit", (code) => code !== 0 && warn());
    opener.unref();
  } catch {
    warn();
  }
}
