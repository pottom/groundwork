<script lang="ts">
  import type { Snippet } from "svelte";

  /** Egy sor az `ItemList`-ben: szám, cím, és a végén például egy `Badge`. */
  let { number, title, children }: { number: string; title: string; children?: Snippet } = $props();
</script>

<li class="flex items-baseline gap-3 py-3">
  <span class="text-muted-foreground min-w-6 shrink-0 font-mono text-sm tabular-nums">{number}</span>
  <span class="text-foreground min-w-0 flex-1 text-pretty">{title}</span>
  {@render children?.()}
</li>
