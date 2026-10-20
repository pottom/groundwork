<script lang="ts">
  import { onMount } from "svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Detail } from "$lib/components/ui/detail";
  import { EmptyState } from "$lib/components/ui/empty-state";
  import { Group } from "$lib/components/ui/group";
  import { Heading } from "$lib/components/ui/heading";
  import { Item } from "$lib/components/ui/item";
  import { ItemList } from "$lib/components/ui/item-list";
  import { Note } from "$lib/components/ui/note";
  import { Notice } from "$lib/components/ui/notice";
  import { Page } from "$lib/components/ui/page";
  import { Progress } from "$lib/components/ui/progress";
  import { Section } from "$lib/components/ui/section";
  import { Stack } from "$lib/components/ui/stack";
  import { Subheading } from "$lib/components/ui/subheading";
  import type { Pillanatkep, Ticket } from "../server/pillanatkep.ts";

  // A legutóbb betöltött pillanatkép. Frissítéskor a régi látszik, amíg az új meg nem jön.
  let pillanatkep = $state<Pillanatkep>();
  let betoltesiHiba = $state(false);
  let megszakadt = $state(false);

  // Csak a legutóbb indított lekérés eredménye kerül ki, így egy lassú, régebbi válasz
  // nem írhatja felül az újabbat.
  let utolsoLekeres = 0;

  async function betolt() {
    const lekeres = ++utolsoLekeres;
    try {
      const valasz = await fetch("/api/pillanatkep");
      if (!valasz.ok) throw new Error(`HTTP ${valasz.status}`);
      const uj: Pillanatkep = await valasz.json();
      if (lekeres !== utolsoLekeres) return;
      pillanatkep = uj;
      betoltesiHiba = false;
      document.title = uj.projektNev;
    } catch {
      if (lekeres === utolsoLekeres) betoltesiHiba = true;
    }
  }

  // Az első betöltés, aztán a szerver jelzésére újra; megszakadt kapcsolat után
  // (az EventSource magától újracsatlakozik) is újra, mert közben változhatott valami.
  onMount(() => {
    betolt();
    const valtozasok = new EventSource("/api/valtozasok");
    valtozasok.addEventListener("valtozott", betolt);
    valtozasok.onerror = () => (megszakadt = true);
    valtozasok.onopen = () => {
      if (!megszakadt) return;
      megszakadt = false;
      betolt();
    };
    return () => valtozasok.close();
  });
</script>

{#snippet mireVar(ticket: Ticket)}
  {#each ticket.varRa as blokkolo}
    {#if blokkolo.cim === undefined}
      <Detail label="vár" number={blokkolo.szam} variant="warning">nincs ilyen ticket ezen a területen</Detail>
    {:else}
      <Detail label="vár" number={blokkolo.szam}>{blokkolo.cim}</Detail>
    {/if}
  {/each}
  {#if ticket.csoport === "emberreVar"}
    <Detail>utána emberre vár</Detail>
  {/if}
{/snippet}

{#snippet ticketek(lista: Ticket[], blokkolt = false)}
  <ItemList>
    {#each lista as ticket}
      <Item number={ticket.szam} title={ticket.cim} dimmed={ticket.csoport === "lezart"}>
        {#snippet details()}
          {#if blokkolt}{@render mireVar(ticket)}{/if}
        {/snippet}
        {#if ticket.allapot}
          <Badge variant={ticket.csoport === "ismeretlen" ? "warning" : "secondary"}>{ticket.allapot}</Badge>
        {/if}
        <Progress done={ticket.pipak.kesz} total={ticket.pipak.osszes} />
      </Item>
    {/each}
  </ItemList>
{/snippet}

{#snippet mostCsoport(cim: string, lista: Ticket[], ures: string, blokkolt = false)}
  <Group title={cim}>
    {#if lista.length > 0}
      {@render ticketek(lista, blokkolt)}
    {:else}
      <Note>{ures}</Note>
    {/if}
  </Group>
{/snippet}

<Page>
  {#if pillanatkep}
    {@const { projektNev, teruletek, most } = pillanatkep}
    <Stack>
      <Heading>{projektNev}</Heading>
      {#if teruletek.length > 0}
        <Section>
          <Subheading>Most</Subheading>
          {@render mostCsoport("Indítható", most.indithato, "Most nincs indítható ticket.")}
          {@render mostCsoport("Emberre vár", most.emberreVar, "Most semmi nem vár rád.")}
          {@render mostCsoport("Folyamatban", most.folyamatban, "Most semmi nincs folyamatban.")}
          {@render mostCsoport("Blokkolt", most.blokkolt, "Most semmi nem blokkolt.", true)}
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
  {:else if betoltesiHiba}
    A pillanatkép nem tölthető be.
  {/if}
  {#if megszakadt}
    <Notice>A kapcsolat megszakadt, újracsatlakozás…</Notice>
  {/if}
</Page>
