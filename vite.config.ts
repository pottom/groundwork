import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "src/web",
  plugins: [tailwindcss(), svelte({ configFile: false })],
  resolve: {
    alias: { $lib: fileURLToPath(new URL("./src/web/lib", import.meta.url)) },
  },
  test: {
    root: ".",
    include: ["test/*.test.ts"],
  },
});
