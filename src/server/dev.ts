// Development launcher: one process, one port. Vite serves the page, and the /api/
// requests go to the Hono app. The watcher reports project changes to the browser
// through the Hono app.
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { getRequestListener } from "@hono/node-server";
import { createServer } from "vite";
import { groundworkApi } from "./app.ts";
import { watchProject } from "./watcher.ts";

const { values } = parseArgs({ options: { root: { type: "string" } } });
if (!values.root) {
  console.error("Használat: npm run dev -- --root <a projekt mappája>");
  process.exit(1);
}
const projectDir = resolve(values.root);
const { app, notifyChange } = groundworkApi(projectDir);
const api = getRequestListener(app.fetch);
const watcher = await watchProject(projectDir, notifyChange);

const vite = await createServer({
  plugins: [
    {
      name: "groundwork-api",
      configureServer(server) {
        server.middlewares.use((req, res, next) => (req.url?.startsWith("/api/") ? api(req, res) : next()));
      },
    },
  ],
});
await vite.listen();
console.log(`Groundwork: ${projectDir}`);
vite.printUrls();

// On shutdown (Ctrl+C, or when `node --watch-path` restarts) we close the watcher too.
async function shutdown() {
  try {
    await watcher.close();
    await vite.close();
  } finally {
    process.exit();
  }
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
