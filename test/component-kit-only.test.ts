import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

// ADR 0005: outside the component kit, no Svelte file has `class`, `style` or `<style>`.

const source = fileURLToPath(new URL("../src", import.meta.url));
const componentKit = "web/lib/components/ui/";
const forbidden = /\bclass\s*[=:]|\bstyle\s*[=:]|<style[\s>]/;

test("no Svelte file outside the component kit has its own styling", async () => {
  const svelteFiles = (await readdir(source, { recursive: true }))
    .filter((f) => f.endsWith(".svelte"))
    .filter((f) => !f.startsWith(componentKit));
  expect(svelteFiles, "there are no Svelte files to check").not.toEqual([]);

  const violations: string[] = [];
  for (const file of svelteFiles) {
    const lines = (await readFile(join(source, file), "utf8")).split("\n");
    lines.forEach((line, i) => {
      if (forbidden.test(line)) violations.push(`${relative(".", join(source, file))}:${i + 1}: ${line.trim()}`);
    });
  }
  expect(violations).toEqual([]);
});
