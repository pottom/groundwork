import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { readSnapshot } from "./snapshot.ts";

/**
 * The Groundwork API: serves a snapshot of a project folder, and tells the browser over a
 * Server-Sent Events connection when the project has changed. `notifyChange()` sends the
 * notification to every open connection; the launcher wires the watcher (`watcher.ts`) to it.
 */
export function groundworkApi(projectDir: string) {
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

  return { app, notifyChange: () => connections.forEach((notify) => notify()) };
}
