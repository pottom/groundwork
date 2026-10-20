<script lang="ts">
  import { Heading } from "$lib/components/ui/heading";
  import { Page } from "$lib/components/ui/page";
  import type { Pillanatkep } from "../server/pillanatkep.ts";

  async function betolt(): Promise<Pillanatkep> {
    const valasz = await fetch("/api/pillanatkep");
    if (!valasz.ok) throw new Error(`HTTP ${valasz.status}`);
    const pillanatkep: Pillanatkep = await valasz.json();
    document.title = pillanatkep.projektNev;
    return pillanatkep;
  }
</script>

<Page>
  {#await betolt() then { projektNev }}
    <Heading>{projektNev}</Heading>
  {:catch}
    A pillanatkép nem tölthető be.
  {/await}
</Page>
