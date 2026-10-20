import { relative, sep } from "node:path";
import { watch } from "chokidar";

/** A running watcher; `close()` stops it. */
export type Watcher = { close(): Promise<void> };

/** How long to wait after changes before notifying: a quick burst becomes a single notification. */
const debounceMs = 200;

/**
 * Watches what the snapshot shows in the project folder: anything under `.scratch/` and the
 * root `README.md`. If any of these changes (is modified, created or deleted), it calls the
 * `onChange` callback, debouncing quick bursts. It only reads, it never writes to the project
 * (ADR 0001). Returns once watching is ready.
 */
export async function watchProject(projectDir: string, onChange: () => void): Promise<Watcher> {
  const isWatched = (path: string) => {
    const rel = relative(projectDir, path);
    return rel === "" || rel === "README.md" || rel === ".scratch" || rel.startsWith(`.scratch${sep}`);
  };

  let timer: NodeJS.Timeout | undefined;
  const watcher = watch(projectDir, {
    ignored: (path) => !isWatched(path),
    ignoreInitial: true,
  });
  watcher.on("all", (_event, path) => {
    if (path === projectDir) return;
    clearTimeout(timer);
    timer = setTimeout(onChange, debounceMs);
  });
  watcher.on("error", (error) => console.error("Groundwork: a figyelés hibát jelzett:", error));
  await new Promise<void>((resolve, reject) => {
    watcher.once("ready", resolve);
    watcher.once("error", reject);
  });

  return {
    async close() {
      clearTimeout(timer);
      await watcher.close();
    },
  };
}
