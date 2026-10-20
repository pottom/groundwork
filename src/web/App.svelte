<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { EmptyState } from "$lib/components/ui/empty-state";
  import { Heading } from "$lib/components/ui/heading";
  import { Item } from "$lib/components/ui/item";
  import { ItemList } from "$lib/components/ui/item-list";
  import { Page } from "$lib/components/ui/page";
  import { Progress } from "$lib/components/ui/progress";
  import { Section } from "$lib/components/ui/section";
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
        <Section>
          <Subheading>{terulet.cim}</Subheading>
          {#if terulet.ticketek.length > 0}
            <ItemList>
              {#each terulet.ticketek as ticket}
                <Item number={ticket.szam} title={ticket.cim} dimmed={ticket.csoport === "lezart"}>
                  {#if ticket.allapot}
                    <Badge variant={ticket.csoport === "ismeretlen" ? "warning" : "secondary"}>{ticket.allapot}</Badge>
                  {/if}
                  <Progress done={ticket.pipak.kesz} total={ticket.pipak.osszes} />
                </Item>
              {/each}
            </ItemList>
          {/if}
        </Section>
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
