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
  import type { Snapshot, Ticket } from "../server/snapshot.ts";

  // The most recently loaded snapshot. While refreshing, the old one stays visible until the new one arrives.
  let snapshot = $state<Snapshot>();
  let loadFailed = $state(false);
  let disconnected = $state(false);

  // Only the result of the most recently started request is shown, so a slow, older response
  // cannot overwrite a newer one.
  let latestRequest = 0;

  async function load() {
    const request = ++latestRequest;
    try {
      const response = await fetch("/api/snapshot");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const next: Snapshot = await response.json();
      if (request !== latestRequest) return;
      snapshot = next;
      loadFailed = false;
      document.title = next.projectName;
    } catch {
      if (request === latestRequest) loadFailed = true;
    }
  }

  // We reload the snapshot when the server says so, and on every (re)connect: something may
  // have changed before the connection was up or while it was down. On a network error the
  // EventSource reconnects by itself; if it closed the connection for good (for example because
  // the server returned an error while restarting), we open a new one after a short pause.
  onMount(() => {
    let changes: EventSource;
    let retryTimer: ReturnType<typeof setTimeout>;

    function connect() {
      changes = new EventSource("/api/changes");
      changes.addEventListener("changed", load);
      changes.onopen = () => {
        disconnected = false;
        load();
      };
      changes.onerror = () => {
        disconnected = true;
        if (changes.readyState === EventSource.CLOSED) retryTimer = setTimeout(connect, 3000);
      };
    }

    load();
    connect();
    return () => {
      clearTimeout(retryTimer);
      changes.close();
    };
  });
</script>

{#snippet blockers(ticket: Ticket)}
  {#each ticket.waitingOn as blocker}
    {#if blocker.title === undefined}
      <Detail label="vár" number={blocker.number} variant="warning">nincs ilyen ticket ezen a területen</Detail>
    {:else}
      <Detail label="vár" number={blocker.number}>{blocker.title}</Detail>
    {/if}
  {/each}
  {#if ticket.group === "awaitingHuman"}
    <Detail>utána emberre vár</Detail>
  {/if}
{/snippet}

{#snippet ticketList(tickets: Ticket[], blocked = false)}
  <ItemList>
    {#each tickets as ticket}
      <Item number={ticket.number} title={ticket.title} dimmed={ticket.group === "closed"}>
        {#snippet details()}
          {#if blocked}{@render blockers(ticket)}{/if}
        {/snippet}
        {#if ticket.status}
          <Badge variant={ticket.group === "unknown" ? "warning" : "secondary"}>{ticket.status}</Badge>
        {/if}
        <Progress done={ticket.checklist.done} total={ticket.checklist.total} />
      </Item>
    {/each}
  </ItemList>
{/snippet}

{#snippet nowGroup(title: string, tickets: Ticket[], emptyText: string, blocked = false)}
  <Group title={title}>
    {#if tickets.length > 0}
      {@render ticketList(tickets, blocked)}
    {:else}
      <Note>{emptyText}</Note>
    {/if}
  </Group>
{/snippet}

<Page>
  {#if snapshot}
    {@const { projectName, areas, now } = snapshot}
    <Stack>
      <Heading>{projectName}</Heading>
      {#if areas.length > 0}
        <Section>
          <Subheading>Most</Subheading>
          {@render nowGroup("Indítható", now.startable, "Most nincs indítható ticket.")}
          {@render nowGroup("Emberre vár", now.awaitingHuman, "Most semmi nem vár rád.")}
          {@render nowGroup("Folyamatban", now.inProgress, "Most semmi nincs folyamatban.")}
          {@render nowGroup("Blokkolt", now.blocked, "Most semmi nem blokkolt.", true)}
        </Section>
      {/if}
      {#each areas as area (area.slug)}
        <Section>
          <Subheading>{area.title}</Subheading>
          {#if area.tickets.length > 0}
            {@render ticketList(area.tickets)}
          {/if}
        </Section>
      {:else}
        <EmptyState>
          Még nincs mit mutatni. Amint egy skill specet vagy ticketeket ír a projekt .scratch/ mappájába, itt
          megjelennek a területek.
        </EmptyState>
      {/each}
    </Stack>
  {:else if loadFailed}
    A pillanatkép nem tölthető be.
  {/if}
  {#if disconnected}
    <Notice>A kapcsolat megszakadt, újracsatlakozás…</Notice>
  {:else if snapshot && loadFailed}
    <Notice>A legutóbbi frissítés nem sikerült, a korábbi állapot látszik.</Notice>
  {/if}
</Page>
