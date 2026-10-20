import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { olvasPillanatkep } from "./pillanatkep.ts";

/**
 * A Groundwork API-ja: egy projekt mappájáról ad pillanatképet, és egy Server-Sent Events
 * kapcsolaton jelzi a böngészőnek, ha a projekt változott. A jelzést a `valtozott()` küldi
 * minden nyitott kapcsolatnak; a figyelőt (`figyelo.ts`) az indító köti hozzá.
 */
export function groundworkApi(projektMappa: string) {
  const kapcsolatok = new Set<() => void>();

  const app = new Hono()
    .get("/api/pillanatkep", async (c) => c.json(await olvasPillanatkep(projektMappa)))
    .get("/api/valtozasok", (c) =>
      streamSSE(c, async (stream) => {
        const jelez = () => void stream.writeSSE({ event: "valtozott", data: "" });
        kapcsolatok.add(jelez);
        await new Promise<void>((resolve) => stream.onAbort(resolve));
        kapcsolatok.delete(jelez);
      }),
    );

  return { app, valtozott: () => kapcsolatok.forEach((jelez) => jelez()) };
}
