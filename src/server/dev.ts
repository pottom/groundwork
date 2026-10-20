// Fejlesztői indítás: egy folyamat, egy port. A Vite szolgálja ki az oldalt,
// a /api/ kéréseket pedig a Hono-app kapja meg. A figyelő a projekt változásait
// a Hono-appon át jelzi a böngészőnek.
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { getRequestListener } from "@hono/node-server";
import { createServer } from "vite";
import { groundworkApi } from "./app.ts";
import { figyel } from "./figyelo.ts";

const { values } = parseArgs({ options: { root: { type: "string" } } });
if (!values.root) {
  console.error("Használat: npm run dev -- --root <a projekt mappája>");
  process.exit(1);
}
const projektMappa = resolve(values.root);
const { app, valtozott } = groundworkApi(projektMappa);
const api = getRequestListener(app.fetch);
const figyelo = await figyel(projektMappa, valtozott);

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
console.log(`Groundwork: ${projektMappa}`);
vite.printUrls();

// Leállításkor (Ctrl+C, vagy amikor a `node --watch-path` újraindít) a figyelőt is lezárjuk.
async function leall() {
  await figyelo.close();
  await vite.close();
  process.exit();
}
process.once("SIGINT", leall);
process.once("SIGTERM", leall);
