import { appendFile, cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, type Mock, test, vi } from "vitest";
import { figyel, type Figyelo } from "../src/server/watcher.ts";

const pelda = fileURLToPath(new URL("./fixtures/sample-3-tickets", import.meta.url));
const ticket = ".scratch/aktualis-idojaras/issues/01-vegigfuto-vaz-egy-telepules-homerseklete.md";

// Ennyi ideig figyeljük, hogy valami NEM jelez: bőven több, mint az összevonás várakozása.
const csendIdo = 1000;

let projekt: string;
let figyelo: Figyelo | undefined;
let jelzes: Mock<() => void>;

beforeEach(async () => {
  projekt = join(await mkdtemp(join(tmpdir(), "groundwork-")), "projekt");
  await cp(pelda, projekt, { recursive: true });
  jelzes = vi.fn<() => void>();
  figyelo = await figyel(projekt, jelzes);
});

afterEach(async () => {
  await figyelo?.close();
});

/** Megvárja az első jelzést (vi.waitFor: rövid időközönként újranézi, nem vak várakozás). */
const jelzesre = () => vi.waitFor(() => expect(jelzes).toHaveBeenCalled(), { timeout: 5000 });

describe("figyelő", () => {
  test("egy ticket módosítása jelez", async () => {
    await appendFile(join(projekt, ticket), "\nMódosítás.\n");
    await jelzesre();
  });

  test("egy új ticket létrehozása jelez", async () => {
    await writeFile(join(projekt, ".scratch/aktualis-idojaras/issues/99-uj.md"), "# 99: Új\n");
    await jelzesre();
  });

  test("egy ticket törlése jelez", async () => {
    await rm(join(projekt, ticket));
    await jelzesre();
  });

  test("egy új terület mappájának létrehozása jelez", async () => {
    await mkdir(join(projekt, ".scratch/uj-terulet"));
    await jelzesre();
  });

  test("a gyökér README módosítása jelez", async () => {
    await appendFile(join(projekt, "README.md"), "\nMódosítás.\n");
    await jelzesre();
  });

  test("a .scratch/-en kívüli, nem README változás nem jelez", async () => {
    await writeFile(join(projekt, "jegyzet.md"), "Valami.\n");
    await mkdir(join(projekt, "src"), { recursive: true });
    await writeFile(join(projekt, "src/README.md"), "# Nem a gyökér README\n");
    await new Promise((r) => setTimeout(r, csendIdo));
    expect(jelzes).not.toHaveBeenCalled();

    // A figyelő közben is élt: egy .scratch/-beli változásra jelez.
    await appendFile(join(projekt, ticket), "\nMódosítás.\n");
    await jelzesre();
  });

  test("egy gyors változássorozat egyetlen jelzés", async () => {
    for (let i = 0; i < 10; i++) {
      await writeFile(join(projekt, `.scratch/aktualis-idojaras/issues/${10 + i}-uj.md`), `# ${10 + i}: Új\n`);
    }
    await jelzesre();
    await new Promise((r) => setTimeout(r, csendIdo));
    expect(jelzes).toHaveBeenCalledTimes(1);
  });

  test("lezárás után nem jelez", async () => {
    await figyelo!.close();
    await appendFile(join(projekt, ticket), "\nMódosítás.\n");
    await new Promise((r) => setTimeout(r, csendIdo));
    expect(jelzes).not.toHaveBeenCalled();
  });
});
