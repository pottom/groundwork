import { Hono } from "hono";
import { olvasPillanatkep } from "./pillanatkep.ts";

/** A Groundwork API-ja: egy projekt mappájáról ad pillanatképet. */
export function groundworkApi(projektMappa: string) {
  return new Hono().get("/api/pillanatkep", async (c) => c.json(await olvasPillanatkep(projektMappa)));
}
