// Builds the product (ADR 0003): dist/groundwork/ with the compiled page (web/) and the server
// bundled with all its dependencies into a single file (groundwork.mjs). Running it needs
// Node only, no npm install. Prints the size of each file and the total.
import { readdir, rm, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { build as bundleServer } from "esbuild";
import { build as buildPage } from "vite";

const repo = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(repo, "dist/groundwork");

await rm(outDir, { recursive: true, force: true });

await buildPage({
  configFile: join(repo, "vite.config.ts"),
  build: { outDir: join(outDir, "web"), emptyOutDir: true },
  logLevel: "warn",
});

await bundleServer({
  entryPoints: [join(repo, "src/server/main.ts")],
  outfile: join(outDir, "groundwork.mjs"),
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  logLevel: "warning",
});

const files = (await readdir(outDir, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name))
  .sort();
const sizes = await Promise.all(files.map(async (file) => (await stat(file)).size));
const kB = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`;
const total = sizes.reduce((sum, size) => sum + size, 0);

console.log(`\nA végtermék elkészült: ${relative(process.cwd(), outDir)}/ (összesen ${kB(total)})`);
files.forEach((file, i) => console.log(`  ${kB(sizes[i]).padStart(9)}  ${relative(outDir, file)}`));
console.log(`\nIndítás: node ${relative(process.cwd(), join(outDir, "groundwork.mjs"))} --root <a projekt mappája>`);
