// Fejlesztői indítás: egy folyamat, egy port. A Vite szolgálja ki az oldalt,
// a /api/ kéréseket pedig a Hono-app kapja meg.
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { getRequestListener } from "@hono/node-server";
import { createServer } from "vite";
import { groundworkApi } from "./app.ts";

const { values } = parseArgs({ options: { root: { type: "string" } } });
if (!values.root) {
  console.error("Használat: npm run dev -- --root <a projekt mappája>");
  process.exit(1);
}
const projektMappa = resolve(values.root);
const api = getRequestListener(groundworkApi(projektMappa).fetch);

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
