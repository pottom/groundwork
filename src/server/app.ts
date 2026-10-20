import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { readSnapshot } from "./snapshot.ts";
import { watchProject } from "./watcher.ts";

/**
 * The Groundwork API for a project folder, shared by the development and the production
 * launcher: it serves a snapshot of the folder, and tells the browser over a Server-Sent Events
 * connection when the project has changed. It starts watching the folder (`watcher.ts`), and
 * `close()` stops the watching.
 */
export async function groundworkApi(projectDir: string) {
  const connections = new Set<() => void>();

  const app = new Hono()
    .get("/api/snapshot", async (c) => c.json(await readSnapshot(projectDir)))
    .get("/api/changes", (c) =>
      streamSSE(c, async (stream) => {
        const notify = () => void stream.writeSSE({ event: "changed", data: "" });
        connections.add(notify);
        await new Promise<void>((resolve) => stream.onAbort(resolve));
        connections.delete(notify);
      }),
    );

  const watcher = await watchProject(projectDir, () => connections.forEach((notify) => notify()));
  return { app, close: () => watcher.close() };
}
