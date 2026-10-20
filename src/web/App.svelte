<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { EmptyState } from "$lib/components/ui/empty-state";
  import { Group } from "$lib/components/ui/group";
  import { Heading } from "$lib/components/ui/heading";
  import { Item } from "$lib/components/ui/item";
  import { ItemList } from "$lib/components/ui/item-list";
  import { Note } from "$lib/components/ui/note";
  import { Page } from "$lib/components/ui/page";
  import { Progress } from "$lib/components/ui/progress";
  import { Section } from "$lib/components/ui/section";
  import { Stack } from "$lib/components/ui/stack";
  import { Subheading } from "$lib/components/ui/subheading";
  import type { Pillanatkep, Ticket } from "../server/pillanatkep.ts";

  async function betolt(): Promise<Pillanatkep> {
    const valasz = await fetch("/api/pillanatkep");
    if (!valasz.ok) throw new Error(`HTTP ${valasz.status}`);
    const pillanatkep: Pillanatkep = await valasz.json();
    document.title = pillanatkep.projektNev;
    return pillanatkep;
  }
</script>

{#snippet ticketek(lista: Ticket[])}
  <ItemList>
    {#each lista as ticket}
      <Item number={ticket.szam} title={ticket.cim} dimmed={ticket.csoport === "lezart"}>
        {#if ticket.allapot}
          <Badge variant={ticket.csoport === "ismeretlen" ? "warning" : "secondary"}>{ticket.allapot}</Badge>
        {/if}
        <Progress done={ticket.pipak.kesz} total={ticket.pipak.osszes} />
      </Item>
    {/each}
  </ItemList>
{/snippet}

{#snippet mostCsoport(cim: string, lista: Ticket[], ures: string)}
  <Group title={cim}>
    {#if lista.length > 0}
      {@render ticketek(lista)}
    {:else}
      <Note>{ures}</Note>
    {/if}
  </Group>
{/snippet}

<Page>
  {#await betolt() then { projektNev, teruletek, most }}
    <Stack>
      <Heading>{projektNev}</Heading>
      {#if teruletek.length > 0}
        <Section>
          <Subheading>Most</Subheading>
          {@render mostCsoport("Indítható", most.indithato, "Most nincs indítható ticket.")}
          {@render mostCsoport("Emberre vár", most.emberreVar, "Most semmi nem vár rád.")}
          {@render mostCsoport("Folyamatban", most.folyamatban, "Most semmi nincs folyamatban.")}
        </Section>
      {/if}
      {#each teruletek as terulet (terulet.slug)}
        <Section>
          <Subheading>{terulet.cim}</Subheading>
          {#if terulet.ticketek.length > 0}
            {@render ticketek(terulet.ticketek)}
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
