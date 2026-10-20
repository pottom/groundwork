import { relative, sep } from "node:path";
import { watch } from "chokidar";

/** Egy futó figyelő; a `close()` leállítja. */
export type Figyelo = { close(): Promise<void> };

/** Ennyi ideig vár a változások után, mielőtt jelez: egy gyors sorozat így egy jelzés. */
const osszevonas = 200;

/**
 * Figyeli a projekt mappájában azt, amit a pillanatkép megmutat: a `.scratch/` alatt
 * bármit és a gyökér `README.md`-t. Ha ezek közül valami változik (módosul, létrejön
 * vagy törlődik), meghívja a `valtozott` visszahívást, a gyors sorozatokat összevonva.
 * Csak olvas, a projektbe nem ír (ADR 0001). Akkor tér vissza, amikor a figyelés kész.
 */
export async function figyel(projektMappa: string, valtozott: () => void): Promise<Figyelo> {
  const figyelt = (utvonal: string) => {
    const resz = relative(projektMappa, utvonal);
    return resz === "" || resz === "README.md" || resz === ".scratch" || resz.startsWith(`.scratch${sep}`);
  };

  let idozito: NodeJS.Timeout | undefined;
  const watcher = watch(projektMappa, {
    ignored: (utvonal) => !figyelt(utvonal),
    ignoreInitial: true,
  });
  watcher.on("all", (_esemeny, utvonal) => {
    if (utvonal === projektMappa) return;
    clearTimeout(idozito);
    idozito = setTimeout(valtozott, osszevonas);
  });
  await new Promise<void>((resolve, reject) => {
    watcher.once("ready", resolve);
    watcher.once("error", reject);
  });

  return {
    async close() {
      clearTimeout(idozito);
      await watcher.close();
    },
  };
}

