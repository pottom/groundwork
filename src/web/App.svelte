<script lang="ts">
  import { EmptyState } from "$lib/components/ui/empty-state";
  import { Heading } from "$lib/components/ui/heading";
  import { Page } from "$lib/components/ui/page";
  import { Stack } from "$lib/components/ui/stack";
  import { Subheading } from "$lib/components/ui/subheading";
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
  {#await betolt() then { projektNev, teruletek }}
    <Stack>
      <Heading>{projektNev}</Heading>
      {#each teruletek as terulet (terulet.slug)}
        <Subheading>{terulet.cim}</Subheading>
      {:else}
        <EmptyState>
          Még nincs mit mutatni. Amint egy skill specet vagy ticketeket ír a projekt .scratch/ mappájába, itt
          megjelennek a területek.
        </EmptyState>
      {/each}
    </Stack>
  {:catch}
    A pillanatkép nem tölthető be.
  {/await}
</Page>
